import React, { useState, useEffect, useContext } from 'react';
import { format } from 'date-fns';
import { useRouter} from 'next/router';
import { gql, useQuery, useMutation } from '@apollo/client';
import Layout from '../../../../components/Layout';
import ManejoDeStock from '../../../../components/registros/produccionesponjas/ManejoDeStock';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import UsuarioContext from '../../../../context/usuarios/UsuarioContext';
import Swal from 'sweetalert2';

const REGISTRO = gql `
    query obtenerRegistroCE($id: ID!){
        obtenerRegistroCE(id: $id){
            creado
            operario
            lote
            producto
            lBolsa
            lEsponja
            cantProducida
        }
    }
`;

const LISTA_STOCK_CATEGORIA = gql `
    query obtneterStockInsumosPorCategoria($input: String!){
        obtneterStockInsumosPorCategoria(input: $input) {
            id
            insumo
            insumoID
            cantidad
            lote
        }
    }
`;

const NUEVO_REGISTRO = gql`
    mutation nuevoRegistroPE($id: ID, $input: CPEInput){
        nuevoRegistroPE(id: $id, input: $input){
            id
            creado
            modificado
            operario
            lote
            producto
            lBolsa
            lEsponja
            cantProducida
            descarteBolsa
            descarteEsponja
            observaciones
            estado
        }
    }
`;

const ACTUALIZAR_REGISTRO = gql`
    mutation actualizarRegistroPE($id: ID!, $input: CPEInput){
            actualizarRegistroPE(id: $id, input: $input){
            producto
            cantProducida           
        }
    }
`;

const FinalizarRegistro = () => {

    const router = useRouter();
    const { query: { id } } = router;
    const usuarioContext = useContext(UsuarioContext);
    const { productos } = usuarioContext;
    const { nombre } = usuarioContext.usuario;
    const [ actualizarRegistroPE ] = useMutation(ACTUALIZAR_REGISTRO);
    const [ nuevoRegistroPE ] = useMutation(NUEVO_REGISTRO);
    const { data: dataEsponjas, loading: loadingEsponjas } = useQuery(LISTA_STOCK_CATEGORIA, {
        variables: {
            input: "Esponjas"
        }
    });
    const { data: dataBolsas, loading: loadingBolsas } = useQuery(LISTA_STOCK_CATEGORIA, {
        variables: {
            input: "Polietileno"
        }
    });
    const { data, loading } = useQuery(REGISTRO, {
        variables: {
            id
        }
    });
    const [registro, setRegistro] = useState({
        cantProducida: 0,
        lBolsa: '',
        lBolsaID: '',
        bolsaDisp: 0,
        lEsponja: '',
        lEsponjaID: '',
        esponjaDisp: 0,
        descarteBolsa: 0,
        descarteEsponja: 0
    });
    const formikCierre = useFormik({
        initialValues: {
            descarteBolsa: 0,
            descarteEsponja: 0,
            observaciones: ''
        },
        validationSchema: Yup.object({
            descarteBolsa: Yup.number()
                            .max(registro.cantProducida, `Debe ser menor a la cantidad producida`)
                            .required('Ingrese el descarte generado'),
            descarteEsponja: Yup.number()
                            .max(registro.cantProducida, `Debe ser menor a la cantidad producida`)
                            .required('Ingrese el descarte generado'),
            observaciones: Yup.string()               
        }),
        onSubmit: valores => {       
            terminarProduccion(valores);            
        }
    });
    useEffect(() => {
        if(dataEsponjas && dataBolsas && data) {
            const { obtenerRegistroCE } = data;
            const loteEsponja = dataEsponjas.obtneterStockInsumosPorCategoria
                                    .find(i => i.lote === obtenerRegistroCE.lEsponja);
            const loteBolsa = dataBolsas.obtneterStockInsumosPorCategoria
                                    .find(i => i.lote === obtenerRegistroCE.lBolsa);
            const productoID = productos.find(i => i.nombre === obtenerRegistroCE.producto).id;

            setRegistro({...registro,
                operario: nombre,
                lEsponja: loteEsponja.lote,
                esponjaDisp: loteEsponja.cantidad,
                lEsponjaID: loteEsponja.id,
                lBolsa: loteBolsa.lote,
                bolsaDisp: loteBolsa.cantidad,
                lBolsaID: loteBolsa.id,
                lote: obtenerRegistroCE.lote,
                producto: obtenerRegistroCE.producto,
                productoID: productoID,
                cantProducida: obtenerRegistroCE.cantProducida

            })
        }
    },[dataEsponjas, dataBolsas, data])
   
    if(loading || loadingEsponjas || loadingBolsas) return (
        <Layout>
          <p className="text-2xl text-gray-800 font-light" >Cargando...</p>
        </Layout>
    );
    
    const { obtenerRegistroCE } = data;

    const terminarProduccion = valores => {
        const { descarteEsponja, descarteBolsa, observaciones } = valores;
        Swal.fire({
            title: 'Verifique los datos antes de confirmar',
            html:   "Lote: " + registro.lote + "</br>" + 
                    "Producto: " + registro.producto + "</br>" +
                    "Operario: " + nombre + "</br>" +
                    "Lote de Esponja: " + registro.lEsponja + "</br>" +
                    "Lote de Bolsa: " + registro.lBolsa + "</br>" +
                    "Cantidad producida: " + registro.cantProducida + "</br>" +
                    "Bolsas descartadas: " + descarteBolsa + "</br>" +
                    "Esponjas desccartadas: " + descarteEsponja + "</br>" +
                    "Observaciones: " + observaciones + "</br>",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Confirmar',
            cancelButtonText: 'Cancelar'
          }).then( async (result) => {
            if (result.value) {
                try {
                    const { data } = await nuevoRegistroPE({
                        variables: {
                            id,
                            input: {
                                operario: nombre,
                                lote: registro.lote,
                                producto: registro.producto,
                                cantProducida: registro.cantProducida,
                                lBolsa: registro.lBolsa,
                                lEsponja: registro.lEsponja,
                                descarteBolsa,
                                descarteEsponja,
                                observaciones
                            }
                        }                
                    });
                    console.log(data)
                    Swal.fire(
                        'Se guardo el registro y se actualizo el stock de productos',
                        `Producidas: ${data.nuevoRegistroPE.cantProducida} esponjas ${data.nuevoRegistroPE.producto}`,
                        'success'
                    )
                    router.push('/registros/produccionesponjas');
                } catch (error) {
                    console.log(error)
                }
            }
          })        
    }
    const cantidades = async valores => {
        const {esponjas} = valores;
        setRegistro({...registro, 
            cantProducida: registro.cantProducida + esponjas, 
            esponjaDisp: registro.esponjaDisp - esponjas, 
            bolsaDisp: registro.bolsaDisp - esponjas
        })
        try {
            const { data } = await actualizarRegistroPE({
                variables: {
                    id: id,
                    input: {
                        cantProducida: registro.cantProducida + esponjas
                    }
                }})
                let timerInterval
                Swal.fire({
                    html: `Se sumaron ${esponjas} esponjas`,
                    timer: 1000,
                    position: 'top',
                    showConfirmButton: false,
                    width: 300,
                    padding: 10,
                    willOpen: () => {
                        Swal.showLoading()
                        timerInterval = setInterval(() => {
                            const content = Swal.getContent()
                                if (content) {
                                    const b = content.querySelector('b')
                                    if (b) {
                                    b.textContent = Swal.getTimerLeft()
                                    }
                                }
                            }, 100)
                        },
                });
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <Layout>
            <h1 className="text-2xl text-gray-800 font-light">Finalizar Registro</h1>

            <div className="flex justify-center mt-5">
                <div className="w-full bg-white shadow-md px-8 pt-6 pb-8 mb-4 max-w-lg">
                    <div className="mb-2 border-b-2 border-gray-600">
                        <div className="flex justify-between pb-2">
                            <div className="flex">
                                <p className="text-gray-700 text-mm font-bold mr-1">Dia: </p>
                                <p className="text-gray-700 font-light">{format(new Date(obtenerRegistroCE.creado), 'dd/MM/yy')}</p>
                            </div>
                            <div className="flex">
                                <p className="text-gray-700 text-mm font-bold mr-1">Hora de inicio: </p>
                                <p className="text-gray-700 font-light">{format(new Date(obtenerRegistroCE.creado), 'HH:mm')}</p>
                            </div>
                        </div>
                        
                        <div className="flex">
                            <p className="text-gray-700 text-mm font-bold mr-1">Lote: </p>
                            <p className="text-gray-700 font-light">{registro.lote}</p>
                        </div>
                        <div className="flex">
                            <p className="text-gray-700 text-mm font-bold mr-1">Producto: </p>
                            <p className="text-gray-700 font-light">{registro.producto}</p>
                        </div>
                        <div className="flex justify-between">
                            <div className="flex">
                                <p className="text-gray-700 text-mm font-bold mr-1">Lote de Esponja: </p>
                                <p className="text-gray-700 font-light ">{registro.lEsponja}</p>
                            </div>
                            <div className="flex">
                                <p className="text-gray-700 text-mm font-bold mr-1">Disponibles: </p>
                                <p className="text-gray-700 font-light">{registro.esponjaDisp}</p>
                            </div>
                        </div>
                        <div className="flex justify-between pb-2">
                            <div className="flex">
                                <p className="text-gray-700 text-mm font-bold mr-1">Lote de Bolsa: </p>
                                <p className="text-gray-700 font-light ">{registro.lBolsa}</p>
                            </div>
                            <div className="flex">
                                <p className="text-gray-700 text-mm font-bold mr-1">Disponibles: </p>
                                <p className="text-gray-700 font-light">{registro.bolsaDisp}</p>
                            </div>
                        </div>
                        {registro.esponjaDisp < 0 || registro.bolsaDisp < 0 ?
                            <p className="text-red-700 text-mm font-bold mr-1">Disponibilidad en negativo - Revise el Stock de Insumos</p>
                        : null}
                        
                        <div className="flex py-2">
                            <p className="text-gray-700 text-lg font-bold mr-1">Cantidad Producida: </p>
                            <p className="text-gray-700 text-lg font-light ">{registro.cantProducida}</p>
                        </div>
                    </div>

                    <ManejoDeStock registro={registro} cantidades={cantidades}/>

                    <form
                        className="bg-white shadow-md px-8 pt-2 pb-8 mb-2"
                        onSubmit={formikCierre.handleSubmit}
                    >
                                <div className="mb-4">
                                    <label className="block text-gray-700 font-bold mb-2" htmlFor="descarteBolsa">
                                        Bolsas descartadas
                                    </label>

                                    <input
                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                        id="descarteBolsa"
                                        type="number"
                                        placeholder="Ingrese la cantidad bolsas descartadas..."
                                        onChange={formikCierre.handleChange}
                                        onBlur={formikCierre.handleBlur}
                                        value={formikCierre.values.descarteBolsa}
                                    />
                                </div>

                                { formikCierre.touched.descarteBolsa && formikCierre.errors.descarteBolsa ? (
                                    <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4" >
                                        <p className="font-bold">Error</p>
                                        <p>{formikCierre.errors.descarteBolsa}</p>
                                    </div>
                                ) : null  }

                                <div className="mb-4">
                                    <label className="block text-gray-700 font-bold mb-2" htmlFor="descarteEsponja">
                                        Esponjas descartadas
                                    </label>

                                    <input
                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                        id="descarteEsponja"
                                        type="number"
                                        placeholder="Ingrese la cantidad de esponjas descartadas..."
                                        onChange={formikCierre.handleChange}
                                        onBlur={formikCierre.handleBlur}
                                        value={formikCierre.values.descarteEsponja}
                                    />
                                </div>

                                { formikCierre.touched.descarteEsponja && formikCierre.errors.descarteEsponja ? (
                                    <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4" >
                                        <p className="font-bold">Error</p>
                                        <p>{formikCierre.errors.descarteEsponja}</p>
                                    </div>
                                ) : null  }


                        <div className="mb-2">
                            <label className="block text-gray-700 font-bold mb-2" htmlFor="observaciones">
                                Observaciones
                            </label>

                            <input
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                id="observaciones"
                                type="text"
                                placeholder="Observaciones..."
                                onChange={formikCierre.handleChange}
                                onBlur={formikCierre.handleBlur}
                                value={formikCierre.values.observaciones}
                            />
                        </div>

                        { formikCierre.touched.observaciones && formikCierre.errors.observaciones ? (
                            <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4" >
                                <p className="font-bold">Error</p>
                                <p>{formikCierre.errors.observaciones}</p>
                            </div>
                        ) : null  }

                        <input
                            type="submit"
                            className="bg-red-800 w-full mt-2 p-2 text-white uppercase font-bold hover:bg-red-900"
                            value="Finalizar Producción"
                        />
                    </form>
                </div>
            </div>
        </Layout>
    );
}

export default FinalizarRegistro;
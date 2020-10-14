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
    mutation nuevoRegistroCE($id: ID, $input: CPEInput){
        nuevoRegistroCE(id: $id, input: $input){
            id
            creado
            modificado
            operario
            lote
            producto
            lBolsa
            lEsponja
            cantProducida
            cantDescarte
            observaciones
            estado
        }
    }
`;

const ACTUALIZAR_REGISTRO = gql`
    mutation actualizarRegistroCE($id: ID!, $input: CPEInput){
            actualizarRegistroCE(id: $id, input: $input){
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
    const [ actualizarRegistroCE ] = useMutation(ACTUALIZAR_REGISTRO);
    const [ nuevoRegistroCE ] = useMutation(NUEVO_REGISTRO);
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
        cantDescarte: 0
    });
    const formikCierre = useFormik({
        initialValues: {
            cantDescarte: 0,
            observaciones: ''
        },
        validationSchema: Yup.object({
            cantDescarte: Yup.number()
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
                lEsponja: loteEsponja.lote,
                esponjaDisp: loteEsponja.cantidad,
                lEsponjaID: loteEsponja.id,
                lBolsa: loteEsponja.lote,
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
        const { cantDescarte, observaciones } = valores;
        Swal.fire({
            title: 'Verifique los datos antes de confirmar',
            html:   "Lote: " + registro.lote + "</br>" + 
                    "Producto: " + registro.producto + "</br>" +
                    "Operario: " + nombre + "</br>" +
                    "Lote de Esponja: " + registro.lEsponja + "</br>" +
                    "Lote de Bolsa: " + registro.lBolsa + "</br>" +
                    "Cantidad producida: " + registro.cantProducida + "</br>" +
                    "Cantidad de descarte: " + cantDescarte + "</br>" +
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
                    const { data } = await nuevoRegistroCE({
                        variables: {
                            id: id,
                            input: {
                                operario: nombre,
                                lote: registro.lote,
                                producto: registro.producto,
                                cantProducida: registro.cantProducida,
                                cantDescarte: cantDescarte,
                                observaciones: observaciones
                            }
                        }                
                    });
                    Swal.fire(
                        'Se guardo el registro y se actualizo el stock de productos',
                        data.nuevoRegistroCE,
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
            const { data } = await actualizarRegistroCE({
                variables: {
                    id: id,
                    input: {
                        cantProducida: registro.cantProducida + esponjas
                    }
                }})
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
                            <label className="block text-gray-700 font-bold mb-2" htmlFor="cantDescarte">
                                Descarte
                            </label>

                            <input
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                id="cantDescarte"
                                type="number"
                                placeholder="Ingrese la cantidad de cantDescarte..."
                                onChange={formikCierre.handleChange}
                                onBlur={formikCierre.handleBlur}
                                value={formikCierre.values.cantDescarte}
                            />
                        </div>

                        { formikCierre.touched.cantDescarte && formikCierre.errors.cantDescarte ? (
                            <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4" >
                                <p className="font-bold">Error</p>
                                <p>{formikCierre.errors.cantDescarte}</p>
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
                        <button className="bg-gray-800 w-full mt-2 p-2 text-white uppercase font-bold hover:bg-gray-900" onClick={() => handleCierre()}>Volver</button>
                    </form>
                </div>
            </div>
        </Layout>
    );
}

export default FinalizarRegistro;
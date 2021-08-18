import React, { useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/router';
import { useQuery, useMutation } from '@apollo/client';
import { format } from 'date-fns';
import { useFormik } from 'formik';
import Swal from 'sweetalert2';
import * as Yup from 'yup';

import Layout from '../../../../components/Layout';
import UsuarioContext from '../../../../context/usuarios/UsuarioContext';
import { OBTENER_REGISTRO, NUEVO_REGISTRO } from '../../../../servicios/produccionDeGel';
import { OBTENER_STOCK_CATEGORIA } from '../../../../servicios/insumos';

const FinalizarRegistro = () => {
    const router = useRouter();
    const { query } = router;
    if (!query) return null;
    const { pid: id } = query;
    const usuarioContext = useContext(UsuarioContext);
    const { productos } = usuarioContext;
    const [ nuevoRegistroCPG ] = useMutation(NUEVO_REGISTRO);
    const { data, loading } = useQuery(OBTENER_REGISTRO, {
        variables: {
            id
        }
    });
    const { data: dataBolsas, loading: loadingBolsas } = useQuery(OBTENER_STOCK_CATEGORIA, {
        variables: {
            input: "Polietileno"
        }
    });
    const [ registro, setRegistro ] = useState();
    const [ bolsasDisponibles, setBolsasDisponibles ] = useState(0);
    useEffect(() => {
        if (data && dataBolsas) {
            const { obtenerRegistroCPG } = data;
            const { obtneterStockInsumosPorCategoria } = dataBolsas;
            const loteBolsa = obtneterStockInsumosPorCategoria.find(i => i.lote === obtenerRegistroCPG.loteBolsa);
            const loteProducto = productos.find(i => i.nombre === obtenerRegistroCPG.producto)
            setRegistro({...registro,
                id: id,
                lote: obtenerRegistroCPG.lote,
                producto: obtenerRegistroCPG.producto,
                cantProducida: obtenerRegistroCPG.cantProducida,
                descarteEsponja: obtenerRegistroCPG.descarteEsponja,
                descarteBolsa: obtenerRegistroCPG.descarteBolsa,
                creado: obtenerRegistroCPG.creado,
                operario: obtenerRegistroCPG.operario,
                loteBolsa: obtenerRegistroCPG.loteBolsa,
                loteGel: obtenerRegistroCPG.loteGel,
                cliente:  obtenerRegistroCPG.cliente,
                puesto1: obtenerRegistroCPG.puesto1,
                puesto2: obtenerRegistroCPG.puesto2,
                dobleBolsa: obtenerRegistroCPG.dobleBolsa,
                manta: obtenerRegistroCPG.loteGel,
                observaciones: obtenerRegistroCPG.observaciones,
                loteBolsaID: loteBolsa.id,
                productoID: loteProducto.id,
            })
            setBolsasDisponibles(loteBolsa.cantidad)
        }
    }, [data, dataBolsas]);
    const formik = useFormik({
        initialValues: {
            cantProducida: 0,
            cantDescarte: 0,
            puesto1: '',
            puesto2: '',
            observaciones: ''
        },
        validationSchema: Yup.object({
            cantProducida: Yup.number()
                                    .max(bolsasDisponibles, `Debe ser menor o igual a ${bolsasDisponibles}`)
                                    .required('Ingrese la cantidad producida'),
            cantDescarte: Yup.number()
                                    .required('Ingrese el descarte')
                                    .test('disponibilidad', 'No hay disponibilidad',
                                    function(cantDescarte) {
                                        return cantDescarte <= bolsasDisponibles - cantProducida.value
                                    }),
            puesto1: Yup.string().required('Ingrese los operarios en el Puesto 1'),
            puesto2: Yup.string().required('Ingrese los operarios en el Puesto 2'),
            observaciones: Yup.string(),
        }), 
        onSubmit: valores => {
            finalizarRegistro(valores);
        }
    });

    if(loading || loadingBolsas) return (
        <Layout>
          <p className="text-2xl text-gray-800 font-light" >Cargando...</p>
        </Layout>
    );

    const finalizarRegistro = valores => {
        const { cantProducida, cantDescarte, puesto1, puesto2, observaciones } = valores;
        let msjDobleBolsa;
        let msjManta;
        registro.dobleBolsa ? msjDobleBolsa = "Si" : msjDobleBolsa = "No";
        registro.manta ? msjManta = "Si" : msjManta = "No";

        Swal.fire({
            title: 'Verifique los datos antes de confirmar',
            html:   "Lote: " + registro.lote + "</br>" + 
                    "Producto: " + registro.producto + "</br>" +
                    "Operario: " + registro.operario + "</br>" +
                    "Cliente: " + registro.cliente + "</br>" +
                    "Lote de Bolsa: " + registro.loteBolsa + "</br>" +
                    "Lote de Gel: " + registro.loteGel + "</br>" +
                    "Doble Bolsa: " + msjDobleBolsa + "</br>" +
                    "Manta: " + msjManta + "</br>" +
                    "Cantidad producida: " + cantProducida + "</br>" +
                    "Cantidad de descarte: " + cantDescarte + "</br>" +
                    "Puesto 1: " + puesto1 + "</br>" +
                    "Puesto 2: " + puesto2 + "</br>" +
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
                    const { data } = await nuevoRegistroCPG({
                        variables: {
                            id: id,
                            input: {      
                                cantProducida,
                                cantDescarte,
                                puesto1,
                                puesto2,
                                observaciones,
                                operario: registro.operario, 
                                lote: registro.lote, 
                                producto: registro.producto,
                                productoID: registro.productoID,
                                loteBolsa: registro.loteBolsa,
                                loteBolsaID: registro.loteBolsaID
                            }   
                        }                
                    });
                    Swal.fire(
                        'Se guardo el registro y se actualizo el stock de productos',
                        data.nuevoRegistroCPG.cantProducida - data.nuevoRegistroCPG.cantDescarte + ' bolsas de gel producidas',
                        'success'
                    )
                    router.push('/registros/producciongel');
                } catch (error) {
                    console.log(error)
                }
            }
        })
    }

    return(
        <Layout>
            <h1 className='text-2xl text-gray-800 font-light'>Finalizar registro</h1>
            {registro ?
                <div className="flex justify-center mt-5">
                    <div className="w-full bg-white shadow-md px-8 pt-6 pb-8 mb-4 max-w-lg">
                        <div className="mb-2 border-b-2 border-gray-600">
                            <div className="flex justify-between pb-2">
                                <div className="flex">
                                    <p className="text-gray-700 text-mm font-bold mr-1">Dia: </p>
                                    <p className="text-gray-700 font-light">{format(new Date(data.obtenerRegistroCPG.creado), 'dd/MM/yy')}</p>
                                </div>
                                <div className="flex">
                                    <p className="text-gray-700 text-mm font-bold mr-1">Hora de inicio: </p>
                                    <p className="text-gray-700 font-light">{format(new Date(data.obtenerRegistroCPG.creado), 'HH:mm')}</p>
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
                            <div className="flex">
                                <p className="text-gray-700 text-mm font-bold mr-1">Cliente: </p>
                                <p className="text-gray-700 font-light">{registro.cliente}</p>
                            </div>
                            <div className="flex">
                                <p className="text-gray-700 text-mm font-bold mr-1">Doble Bolsa: </p>
                                <p>{registro.dobleBolsa ? '✔' : '✘'}</p>
                            </div>
                            <div className="flex">
                                <p className="text-gray-700 text-mm font-bold mr-1">Manta: </p>
                                <p>{registro.manta ? '✔' : '✘'}</p>
                            </div>
                            <div className="flex">
                                <p className="text-gray-700 text-mm font-bold mr-1">Lote de Gel: </p>
                                <p className="text-gray-700 font-light">{registro.loteGel}</p>
                            </div>
                            <div className="flex justify-between pb-2">
                                <div className="flex">
                                    <p className="text-gray-700 text-mm font-bold mr-1">Lote de Bolsa: </p>
                                    <p className="text-gray-700 font-light">{registro.loteBolsa}</p>
                                </div>
                                <div className="flex">
                                    <p className="text-gray-700 text-mm font-bold mr-1">Disponibles: </p>
                                    <p className="text-gray-700 font-light">{bolsasDisponibles}</p>
                                </div>
                            </div>
                        </div>

                        <form
                            className="bg-white shadow-md px-8 pt-2 pb-8 mb-2"
                            onSubmit={formik.handleSubmit}
                            >
                            <div className="mb-4">
                                <label className="block text-gray-700 font-bold mb-2" htmlFor="cantProducida">
                                    Cantidad Producida
                                </label>

                                <input
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    id="cantProducida"
                                    type="number"
                                    placeholder="Ingrese la cantidad de cantProducida..."
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.cantProducida}
                                    />
                            </div>

                            { formik.touched.cantProducida && formik.errors.cantProducida ? (
                                <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4" >
                                    <p className="font-bold">Error</p>
                                    <p>{formik.errors.cantProducida}</p>
                                </div>
                            ) : null  }
                            
                            <div className="mb-4">
                                <label className="block text-gray-700 font-bold mb-2" htmlFor="cantDescarte">
                                    Descarte
                                </label>

                                <input
                                    className="shadow appearance-none border rounded w-full mb-1 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    id="cantDescarte"
                                    type="number"
                                    placeholder="Ingrese la cantidad de cantDescarte..."
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.cantDescarte}
                                    />
                            </div>

                            { formik.touched.cantDescarte && formik.errors.cantDescarte ? (
                                <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4" >
                                    <p className="font-bold">Error</p>
                                    <p>{formik.errors.cantDescarte}</p>
                                </div>
                            ) : null  }

                            <div className="mb-4">
                                <label className="block text-gray-700 font-bold mb-2" htmlFor="puesto1">
                                    Puesto 1
                                </label>

                                <input
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    id="puesto1"
                                    type="text"
                                    placeholder="Ingrese integrantes del Puesto 1"
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.puesto1}
                                    />
                            </div>

                            { formik.touched.puesto1 && formik.errors.puesto1 ? (
                                <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4" >
                                    <p className="font-bold">Error</p>
                                    <p>{formik.errors.puesto1}</p>
                                </div>
                            ) : null  }

                            <div className="mb-4">
                                <label className="block text-gray-700 font-bold mb-2" htmlFor="puesto2">
                                    Puesto 2
                                </label>

                                <input
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    id="puesto2"
                                    type="text"
                                    placeholder="Ingrese integrantes del Puesto 2"
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.puesto2}
                                    />
                            </div>

                            { formik.touched.puesto2 && formik.errors.puesto2 ? (
                                <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4" >
                                    <p className="font-bold">Error</p>
                                    <p>{formik.errors.puesto2}</p>
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
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.observaciones}
                                    />
                            </div>

                            { formik.touched.observaciones && formik.errors.observaciones ? (
                                <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4" >
                                    <p className="font-bold">Error</p>
                                    <p>{formik.errors.observaciones}</p>
                                </div>
                            ) : null  }

                            <input
                                type="submit"
                                className="bg-red-800 w-full mt-2 p-2 text-white uppercase font-bold hover:bg-red-900"
                                value="Finalizar Registro"
                                />
                        </form>  
                    </div>
                </div>
            : null}
        </Layout>
    );
}

export default FinalizarRegistro;
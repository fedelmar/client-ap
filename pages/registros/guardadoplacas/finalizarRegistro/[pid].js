import React, { useEffect, useState, useContext } from 'react';
import Layout from '../../../../components/Layout';
import { useRouter } from 'next/router';
import { gql, useQuery, useMutation } from '@apollo/client';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import Swal from 'sweetalert2';
import { format } from 'date-fns';
import UsuarioContext from '../../../../context/usuarios/UsuarioContext';
import { NUEVO_REGISTRO, OBTENER_REGISTRO } from '../../../../servicios/guardadoDePlacas';
import { LOTES_PLACAS } from '../../../../servicios/stockProductos';

const FinalizarRegistro = () => {
    const router = useRouter();
    const { query: { id } } = router;
    const usuarioContext = useContext(UsuarioContext);
    const { nombre } = usuarioContext.usuario;
    const [ registro, setRegistro ] = useState({
        operario: nombre,
        loteID: ''
    });
    const { data, loading } = useQuery(OBTENER_REGISTRO, {
        variables: {
            id
        }
    });
    const { data: dataLote, loading: loadingLote } = useQuery(LOTES_PLACAS, {
        pollInterval: 500,
    });
    const [ nuevoRegistroGP ] = useMutation(NUEVO_REGISTRO);
    const formikCierre = useFormik({
        initialValues: {
            guardado: '',
            descarte: 0,
            pallet: '',
            auxiliar: '',
            observaciones: ''
        },
        validationSchema: Yup.object({
            guardado: Yup.number()
                                .max(registro.cantidad, `Debe ser menor o igual a ${registro.cantidad}`)
                                .required('Ingrese la cantidad producida'),
            descarte: Yup.number()
                                .required('Ingrese el descarte generado')
                                .test('disponibilidad', 'No hay disponibilidad',
                                function(descarte) {
                                    return descarte <= registro.cantidad - guardado.value
                                }),
            pallet: Yup.string(),
            auxiliar: Yup.string(),
            observaciones: Yup.string()               
        }),
        onSubmit: valores => {       
            terminarProduccion(valores);            
        }
    });
    useEffect(() => {
        if (dataLote && registro.loteID) {
            dataLote.obtenerStockPlacas.map(i => 
                i.loteID === registro.loteID ?
                    setRegistro({...registro, 
                        cantidad: i.cantidad,
                        producto: i.producto,
                        estado: i.estado,
                    })
                : null
            )
        };
    }, [dataLote, registro.loteID]);
    useEffect(() => {
        if (data) {
            const { obtenerRegistroGP } = data;
            setRegistro({...registro,
                pallet: obtenerRegistroGP.pallet,
                creado: obtenerRegistroGP.creado,
                lote: obtenerRegistroGP.lote,
                loteID: obtenerRegistroGP.loteID
            })
        };
    }, [data]);
 
    useEffect(() => {
        if (nombre) {
            setRegistro({...registro, operario: nombre})
        }
    }, [nombre])

    if(loading || loadingLote) return (
        <Layout>
          <p className="text-2xl text-gray-800 font-light" >Cargando...</p>
        </Layout>
    );

    const terminarProduccion = valores => {
        //Volver a planillas de produccion y modificar base de datos
        const {descarte, guardado, pallet, observaciones, auxiliar} = valores;
        Swal.fire({
            title: 'Verifique los datos antes de confirmar',
            html:   "Lote: " + registro.lote + "</br>" + 
                    "Producto: " + registro.producto + "</br>" +
                    "Operario: " + registro.operario + "</br>" +
                    "Placas guardadas: " + guardado + "</br>" +
                    "Cantidad de descarte: " + descarte + "</br>" +
                    "Pallet: " + pallet + "</br>" +
                    "Auxiliar/es: " + auxiliar + "</br>" +
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
                    const { data } = await nuevoRegistroGP({
                        variables: {
                            id,
                            input: {
                                lote: registro.lote,
                                guardado: guardado,
                                descarte: descarte,
                                pallet: pallet,
                                auxiliar: auxiliar,
                                observaciones: observaciones
                            }
                        }                
                    });
                    Swal.fire(
                        'Se guardo el registro y se creo actualizo el stock.',
                        data.nuevoRegistroGP,
                        'success'
                    )
                    router.push('/registros/guardadoplacas');
                } catch (error) {
                    console.log(error)
                }
            }
        })
    }

    return (
        <Layout>
            <h1 className="text-2xl text-gray-800 font-light">Finalizar Registro</h1>

            <div className="flex justify-center mt-5">
                <div className="w-full bg-white shadow-md px-8 pt-6 pb-8 mb-4 max-w-lg">
                    <div className="mb-2 border-b-2 border-gray-600">
                        <div className="flex justify-between pb-2">
                            <div className="flex">
                                <p className="text-gray-700 text-mm font-bold mr-1">Dia: </p>
                                <p className="text-gray-700 font-light ">{format(new Date(data.obtenerRegistroGP.creado), 'dd/MM/yy')}</p>
                            </div>
                            <div className="flex">
                                <p className="text-gray-700 text-mm font-bold mr-1">Hora de inicio: </p>
                                <p className="text-gray-700 font-light">{format(new Date(data.obtenerRegistroGP.creado), 'HH:mm')}</p>
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
                            <p className="text-gray-700 text-mm font-bold mr-1">Estado del producto: </p>
                            <p className="text-gray-700 font-light">{registro.estado}</p>
                        </div>
                    </div>
                    <div className="flex justify-center mt-1 ">
                            <p className="text-gray-700 text-xl font-bold mr-1">Placas disponibles: </p>
                            <p className="text-gray-700 text-xl font-light px-2">{registro.cantidad}</p>
                    </div>
                    <form
                        className="bg-white shadow-md px-8 pt-6 pb-8 mb-4"
                        onSubmit={formikCierre.handleSubmit}
                    >

                        <div className="mb-4 mt-1">
                            <label className="block text-gray-700 font-bold mb-2" htmlFor="guardado">
                                Placas guardadas
                            </label>

                            <input
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                id="guardado"
                                type="number"
                                placeholder="Ingrese la cantidad producida..."
                                onChange={formikCierre.handleChange}
                                onBlur={formikCierre.handleBlur}
                                value={formikCierre.values.guardado}
                            />
                        </div>

                        { formikCierre.touched.guardado && formikCierre.errors.guardado ? (
                            <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4" >
                                <p className="font-bold">Error</p>
                                <p>{formikCierre.errors.guardado}</p>
                            </div>
                        ) : null  }

                        <div className="mb-4">
                            <label className="block text-gray-700 font-bold mb-2" htmlFor="descarte">
                                Cantidad de descarte
                            </label>

                            <input
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                id="descarte"
                                type="number"
                                placeholder="Ingrese la cantidad de descarte..."
                                onChange={formikCierre.handleChange}
                                onBlur={formikCierre.handleBlur}
                                value={formikCierre.values.descarte}
                            />
                        </div>

                        { formikCierre.touched.descarte && formikCierre.errors.descarte ? (
                            <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4" >
                                <p className="font-bold">Error</p>
                                <p>{formikCierre.errors.descarte}</p>
                            </div>
                        ) : null  }

                        <div className="mb-4">
                            <label className="block text-gray-700 font-bold mb-2" htmlFor="pallet">
                                Pallet
                            </label>

                            <input
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                id="pallet"
                                type="text"
                                placeholder="Ingrese el pallet..."
                                onChange={formikCierre.handleChange}
                                onBlur={formikCierre.handleBlur}
                                value={formikCierre.values.pallet}
                            />
                        </div>

                        { formikCierre.touched.pallet && formikCierre.errors.pallet ? (
                            <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4" >
                                <p className="font-bold">Error</p>
                                <p>{formikCierre.errors.pallet}</p>
                            </div>
                        ) : null  }

                        <div className="mb-4">
                            <label className="block text-gray-700 font-bold mb-2" htmlFor="auxiliar">
                                Auxiliar/es
                            </label>

                            <input
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                id="auxiliar"
                                type="text"
                                placeholder="auxiliar..."
                                onChange={formikCierre.handleChange}
                                onBlur={formikCierre.handleBlur}
                                value={formikCierre.values.auxiliar}
                            />
                        </div>

                        { formikCierre.touched.auxiliar && formikCierre.errors.auxiliar ? (
                            <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4" >
                                <p className="font-bold">Error</p>
                                <p>{formikCierre.errors.auxiliar}</p>
                            </div>
                        ) : null  }

                        <div className="mb-4">
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
                            className="bg-green-800 w-full mt-5 p-2 text-white uppercase font-bold hover:bg-green-900"
                            value="Finalizar Registro"
                        />
                    </form>
                </div>
            </div> 
        </Layout>
    );
}

export default FinalizarRegistro;
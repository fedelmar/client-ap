import React, { useState, useContext } from 'react';
import { useMutation } from '@apollo/client';
import Select from 'react-select';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useRouter } from 'next/router';

import Layout from '../../../components/Layout';
import UsuarioContext from '../../../context/usuarios/UsuarioContext';
import { LISTA_REGISTROS, NUEVO_INGRESO } from '../../../servicios/ingresos';

const NuevoIngreso = () => {
    const pedidoContext = useContext(UsuarioContext);
    const { insumos } = pedidoContext;
    const router = useRouter();
    const [mensaje, guardarMensaje] = useState(null);
    const [insumo, setInsumo] = useState();
    const [nuevoRegistroIngreso] = useMutation(NUEVO_INGRESO, {
        update(cache, {data: { nuevoRegistroIngreso }}) {
            const { obtenerRegistrosIngresos } = cache.readQuery({ query: LISTA_REGISTROS});

            cache.writeQuery({
                query: LISTA_REGISTROS,
                data: {
                    obtenerRegistrosIngresos: [...obtenerRegistrosIngresos, nuevoRegistroIngreso]
                }
            })
        }
    })

    const formik = useFormik({
        initialValues: {
            proveedor: '',
            remito: '',
            lote: '',
            loteProv: '',
            conLoteProv: false,
            insumo: '',
            cantidad: 0
        },
        validationSchema: Yup.object({
            proveedor: Yup.string().required('Ingrese un proveedor'),
            remito: Yup.string().required('Ingrese el remito'),
            lote: Yup.string().required('Ingrese el lote'),
            loteProv: Yup.string(),
            insumo: Yup.string(),
            cantidad: Yup.number().required('Ingrese la cantidad'),                    
        }),
        onSubmit: async valores => {
            let { lote, cantidad, proveedor, remito, loteProv } = valores;
            if (loteProv !== '') {
                lote = lote + ' - ' + loteProv;
            }
            try {
                const { data } = await nuevoRegistroIngreso({
                    variables: {
                        input: {
                            lote,
                            insumo: insumo.nombre,
                            insumoID: insumo.id,
                            cantidad,
                            proveedor,
                            remito
                        }
                    }
                });
                router.push('/registros/ingresos');
            } catch (error) {
                guardarMensaje(error.message.replace('GraphQL error: ', ''));
            }
        }
    })

    const seleccionarInsumo = value => {
        setInsumo({...insumo, id: value.id, nombre: value.nombre})
    }

    const mostrarMensaje = () => {
        return(
            <div className="bg-white py-2 px-3 w-full my-3 max-w-sm text-center mx-auto">
                <p>{mensaje}</p>
            </div>
        )
    }

    return (
        <Layout>
            <h1 className="text-2xl text-gray-800 font-light">Ingresar Insumos</h1>

            {mensaje && mostrarMensaje()}

            <div className="flex justify-center mt-5">
                <div className="w-full max-w-lg">
                    <form
                        className="bg-white shadow-md px-8 pt-6 pb-8 mb-4"
                        onSubmit={formik.handleSubmit}
                    >
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="lote">
                                    Lote
                                </label>

                                <input
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    id="lote"
                                    type="text"
                                    placeholder="Lote Insumo"
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.lote}
                                />
                            </div>

                            { formik.touched.lote && formik.errors.lote ? (
                                <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4" >
                                    <p className="font-bold">Error</p>
                                    <p>{formik.errors.lote}</p>
                                </div>
                            ) : null  }

                            <div className="mb-4">
                                <div className="flex mb-3">
                                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="loteProv">
                                        Lote de Proveedor
                                    </label>

                                    <input
                                        className="mt-1 ml-2 form-checkbox h-5 w-5 text-gray-600"
                                        id="conLoteProv"
                                        type="checkbox"
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        value={formik.values.conLoteProv}
                                    />
                                </div>

                                {formik.values.conLoteProv ?
                                    <input
                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                        id="loteProv"
                                        type="text"
                                        placeholder="Lote de proveedor"
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        value={formik.values.loteProv}
                                    /> : null}
                            </div>

                            { formik.touched.loteProv && formik.errors.loteProv ? (
                                <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4" >
                                    <p className="font-bold">Error</p>
                                    <p>{formik.errors.loteProv}</p>
                                </div>
                            ) : null  }

                            <p className="block text-gray-700 text-sm font-bold mb-2">Seleccione o busque el insumo</p>
                            <Select
                                className="mt-3 mb-4"
                                options={insumos}
                                onChange={opcion => seleccionarInsumo(opcion) }
                                getOptionValue={ opciones => opciones.id }
                                getOptionLabel={ opciones => opciones.nombre}
                                placeholder="Insumo..."
                                noOptionsMessage={() => "No hay resultados"}
                                onBlur={formik.handleBlur}
                                isMulti={false}
                            />

                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="cantidad">
                                    Cantidad
                                </label>

                                <input
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    id="cantidad"
                                    type="number"
                                    placeholder="Cantidad"
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.cantidad}
                                />
                            </div>

                            { formik.touched.cantidad && formik.errors.cantidad ? (
                                <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4" >
                                    <p className="font-bold">Error</p>
                                    <p>{formik.errors.cantidad}</p>
                                </div>
                            ) : null  }

                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="remito">
                                    Remito
                                </label>

                                <input
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    id="remito"
                                    type="text"
                                    placeholder="Remito"
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.remito}
                                />
                            </div>

                            { formik.touched.remito && formik.errors.remito ? (
                                <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4" >
                                    <p className="font-bold">Error</p>
                                    <p>{formik.errors.remito}</p>
                                </div>
                            ) : null  }

                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="proveedor">
                                    Proveedor
                                </label>

                                <input
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    id="proveedor"
                                    type="text"
                                    placeholder="Proveedor"
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.proveedor}
                                />
                            </div>           
                            
                            { formik.touched.proveedor && formik.errors.proveedor ? (
                                <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4" >
                                    <p className="font-bold">Error</p>
                                    <p>{formik.errors.proveedor}</p>
                                </div>
                            ) : null  }                    

                            <input
                                type="submit"
                                className="bg-gray-800 w-full mt-5 p-2 text-white uppercase font-bold hover:bg-gray-900"
                                value="Ingresar Insumos"
                            />
                    </form>
                </div>
            </div>
        </Layout>
    );
}

export default NuevoIngreso;
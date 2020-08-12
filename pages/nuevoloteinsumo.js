import React, { useContext, useState } from 'react';
import Layout from '../components/Layout';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import Select from 'react-select';
import UsuarioContext from '../context/usuarios/UsuarioContext';
import { gql, useMutation } from '@apollo/client';
import { useRouter } from 'next/router';

const CREAR_LOTE = gql`
    mutation nuevoInsumoStock($input: sInsumoInput){
        nuevoInsumoStock(input: $input) {
            id
            lote
            cantidad
            insumo
        }
    }
`;

const OBTENER_STOCK = gql`
    query obtenerStockInsumos{
        obtenerStockInsumos{
            id
            insumo
            lote
            cantidad
        }
    }
`;

const NuevoLoteInsumo = () => {

    const router = useRouter();
    const [mensaje, guardarMensaje] = useState(null);
    const [idInsumo, setIdInsumo] = useState();

    const [nuevoInsumoStock] = useMutation(CREAR_LOTE, {
        update(cache, {data: { nuevoInsumoStock }}) {
            const { obtenerStockInsumos } = cache.readQuery({ query: OBTENER_STOCK});

            cache.writeQuery({
                query: OBTENER_STOCK,
                data: {
                    obtenerStockInsumos: [...obtenerStockInsumos, nuevoInsumoStock]
                }
            })
        }
    })

    const pedidoContext = useContext(UsuarioContext);
    const { insumos } = pedidoContext;

    const formik = useFormik({
        initialValues: {
            lote: '',
            insumo: '',
            cantidad: 0
        },
        validationSchema: Yup.object({
            lote: Yup.string().required('El lote del producto es obligatorio'),
            insumo: Yup.string(),
            cantidad: Yup.number()                        
        }),
        onSubmit: async valores => {
            
            const{ lote, cantidad } = valores
            const insumo = idInsumo;

            try {
                // eslint-disable-next-line no-unused-vars
                const { data } = await nuevoInsumoStock({
                    variables: {
                        input: {
                            lote,
                            insumo,
                            cantidad
                        }
                    }
                });

                router.push('/stockinsumos');
            } catch (error) {
                guardarMensaje(error.message.replace('GraphQL error: ', ''));
            }
            
        }
        
    })

    const mostrarMensaje = () => {
        return(
            <div className="bg-white py-2 px-3 w-full my-3 max-w-sm text-center mx-auto">
                <p>{mensaje}</p>
            </div>
        )
    }

    const seleccionarInsumo = insumo => {
        setIdInsumo(insumo.id)
    }


    return (
        <Layout>
            <h1 className="text-2xl text-gray-800 font-light">Nuevo Lote de Insumos</h1>
        
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

                            <input
                                type="submit"
                                className="bg-gray-800 w-full mt-5 p-2 text-white uppercase font-bold hover:bg-gray-900"
                                value="Crear Lote"
                            />
                    </form>
                </div>
            </div>
        </Layout>
    );
}

export default NuevoLoteInsumo
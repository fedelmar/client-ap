import React, { useContext, useState } from 'react';
import Layout from '../components/Layout';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import Select from 'react-select';
import UsuarioContext from '../context/usuarios/UsuarioContext';
import { gql, useMutation } from '@apollo/client';
import { useRouter } from 'next/router';

const CREAR_LOTE = gql`
    mutation nuevoProductoStock($input: sProductoInput){
        nuevoProductoStock(input: $input){
            id
            lote
            producto        
            estado
            cantidad
        }
    }
`;

const OBTENER_STOCK = gql`
    query obtenerProductosStock{
        obtenerProductosStock{
            id
            lote
            cantidad
            producto
            estado
        }
    }
`;

const NuevoLoteProducto = () => {

    const router = useRouter();
    const [mensaje, guardarMensaje] = useState(null);
    const [idProducto, setIdProducto] = useState();

    const [nuevoProductoStock] = useMutation(CREAR_LOTE, {
        update(cache, {data: { nuevoProductoStock }}) {
            const { obtenerProductosStock } = cache.readQuery({ query: OBTENER_STOCK});

            cache.writeQuery({
                query: OBTENER_STOCK,
                data: {
                    obtenerProductosStock: [...obtenerProductosStock, nuevoProductoStock]
                }
            })
        }
    })

    const pedidoContext = useContext(UsuarioContext);
    const { productos } = pedidoContext;

    const formik = useFormik({
        initialValues: {
            lote: '',
            producto: '',
            estado: '',
            cantidad: 0
        },
        validationSchema: Yup.object({
            lote: Yup.string().required('El lote del producto es obligatorio'),
            producto: Yup.string(),
            estado: Yup.string(),
            cantidad: Yup.number()                        
        }),
        onSubmit: async valores => {
            
            const{ lote, estado, cantidad } = valores
            const producto = idProducto;

            try {
                // eslint-disable-next-line no-unused-vars
                const { data } = await nuevoProductoStock({
                    variables: {
                        input: {
                            lote,
                            producto,
                            estado,
                            cantidad
                        }
                    }
                });

                router.push('/stockproductos');
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

    const seleccionarProducto = producto => {
        setIdProducto(producto.id)
    }

    return (
        <Layout>
            <h1 className="text-2xl text-gray-800 font-light" >Nuevo Lote de Productos</h1>
        
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
                                    placeholder="Lote Producto"
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

                            <p className="block text-gray-700 text-sm font-bold mb-2">Seleccione o busque el producto</p>
                            <Select
                                className="mt-3 mb-4"
                                options={productos}
                                onChange={opcion => seleccionarProducto(opcion) }
                                getOptionValue={ opciones => opciones.id }
                                getOptionLabel={ opciones => opciones.nombre}
                                placeholder="Producto..."
                                noOptionsMessage={() => "No hay resultados"}
                                onBlur={formik.handleBlur}
                                isMulti={false}
                            />

                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="estado">
                                    Estado
                                </label>
                                <select
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    name="estado"
                                    id="estado"
                                    type="text"
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                >
                                    <option value="" label="Seleccione una estado" />
                                    <option value="Terminado" label="Terminado" />
                                    <option value="Proceso" label="Proceso" />
                                    <option value="Reproceso" label="Reproceso" />
                                </select>
                            </div>

                            { formik.touched.estado && formik.errors.estado ? (
                                <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4" >
                                    <p className="font-bold">Error</p>
                                    <p>{formik.errors.estado}</p>
                                </div>
                            ) : null  }

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
export default NuevoLoteProducto
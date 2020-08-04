import React, { useState } from 'react'
import Layout from '../components/Layout'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { gql, useMutation } from '@apollo/client'
import { useRouter } from 'next/router'

const CREAR_PRODUCTO = gql`
    mutation nuevoProducto($input: ProductoInput) {
        nuevoProducto(input: $input) {
            id
            nombre
            categoria
            cantidad
        }
    }
`;

const OBTENER_PRODUCTOS = gql`
  query obtenerProductos {
    obtenerProductos{
      id
      nombre
      categoria
      cantidad
    }
  }
`;


const NuevoProducto = () => {

    const router = useRouter();
    const [mensaje, guardarMensaje] = useState(null);

    // Mutation para actualizar cache y nuevo cliente
    const [ nuevoProducto ] = useMutation(CREAR_PRODUCTO, {
        update(cache, {data: { nuevoProducto }}) {
            
            const { obtenerProductos } = cache.readQuery({ query: OBTENER_PRODUCTOS });

            cache.writeQuery({
                query: OBTENER_PRODUCTOS,
                data: {
                    obtenerProductos: [...obtenerProductos, nuevoProducto ]
                }
            })
        }
    })

    const formik = useFormik({
        initialValues: {
            nombre: '',
            categoria: '',
            cantidad: 0
        },
        validationSchema: Yup.object({
            nombre: Yup.string().required('El nombre del producto es obligatorio'),
            categoria: Yup.string().required('Campo obligatorio'),
            cantidad: Yup.number().required('Ingrese una cantidad') 
                        
        }),
        onSubmit: async valores => {   
            
            const { nombre, categoria, cantidad } = valores

            try {
                // eslint-disable-next-line no-unused-vars
                const { data } = await nuevoProducto({
                    variables: {
                        input: {
                            nombre,
                            categoria,
                            cantidad
                        }
                    }
                });
                //console.log(data.nuevoProducto);
                router.push('/productos');
                
            } catch (error) {
                guardarMensaje(error.message.replace('GraphQL error: ', ''));

               // setTimeout(() => {guardarMensaje(null);}, 2000);
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

    return (
        <Layout>
            <h1 className="text-2xl text-gray-800 font-light" >Nuevo Producto</h1>
        
            {mensaje && mostrarMensaje() }

            <div className="flex justify-center mt-5">
                <div className="w-full max-w-lg">
                    <form
                        className="bg-white shadow-md px-8 pt-6 pb-8 mb-4"
                        onSubmit={formik.handleSubmit}
                    >
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="nombre">
                                    Nombre
                                </label>

                                <input
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    id="nombre"
                                    type="text"
                                    placeholder="Nombre Producto"
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.nombre}
                                />
                            </div>

                            { formik.touched.nombre && formik.errors.nombre ? (
                                <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4" >
                                    <p className="font-bold">Error</p>
                                    <p>{formik.errors.nombre}</p>
                                </div>
                            ) : null  }

                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="categoria">
                                    Categoria
                                </label>
                                <select
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    name="categoria"
                                    id="categoria"
                                    type="text"
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                >
                                    <option value="" label="Seleccione una categoria" />
                                    <option value="Esponjas" label="Esponjas" />
                                    <option value="Placas" label="Placas" />
                                    <option value="Geles" label="Geles" />
                                    <option value="Sistemas" label="Sistemas" />
                                </select>
                            </div>

                            { formik.touched.categoria && formik.errors.categoria ? (
                                <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4" >
                                    <p className="font-bold">Error</p>
                                    <p>{formik.errors.categoria}</p>
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
                                value="Crear producto"
                            />
                    </form>
                </div>
            </div>
        
        </Layout>
    );
}

export default NuevoProducto;
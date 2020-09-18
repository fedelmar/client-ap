/* eslint-disable react/prop-types */
import React, {useState, useContext} from 'react';
import Layout from '../../components/Layout';
import { useRouter } from 'next/router'
import { Formik} from 'formik'
import * as Yup from 'yup'
import { gql, useQuery, useMutation } from '@apollo/client';
import UsuarioContext from '../../context/usuarios/UsuarioContext';
import Select from 'react-select';
import Swal from 'sweetalert2';

const LOTE_PRODUCTO = gql `
    query	obtenerProductoStock($id: ID!){
        obtenerProductoStock(id: $id){
            id
            lote
            cantidad
            producto
            estado
        }
    }
`;

const ACTUALIZAR_LOTE = gql `
    mutation actualizarProductoStock($id: ID!, $input: sProductoInput){
        actualizarProductoStock(id: $id, input: $input){
            id
            lote
            cantidad
            producto
            estado
        }
    }
`;

const EditarLoteProducto = () => {

    const router = useRouter();
    const { query: { id } } = router;
  
    const [idProducto, setIdProducto] = useState();

    const { data, loading } = useQuery(LOTE_PRODUCTO, {
        variables: {
            id
        }
    });

    const [ actualizarProductoStock ] = useMutation(ACTUALIZAR_LOTE);

    const usuarioContext = useContext(UsuarioContext);
    const { productos } = usuarioContext;

    if(loading) return (   
        <Layout>
            Cargando...   
        </Layout>
    );

    const { obtenerProductoStock } = data;

    const schemaValidacion = Yup.object({
        lote: Yup.string(),
        producto: Yup.string(),
        estado: Yup.string(),
        cantidad: Yup.number()
                    
    });

    const actualizarInfoStock = async valores => {
        const { lote, cantidad, estado } = valores;
        const producto = idProducto;
        try {
            // eslint-disable-next-line no-unused-vars
            const { data } = actualizarProductoStock({
                variables: {
                    id,
                    input: {
                        lote,
                        cantidad,
                        estado,
                        producto
                    }
                }
            })

            // Mostrar Alerta
            Swal.fire(
                'Actualizado',
                'El lote se actualizó correctamente',
                'success'
            )

            // Redireccionar
            router.push('/stockproductos');
        } catch (error) {
            console.log(error);
        }
    }

    const seleccionarProducto = producto => {
        setIdProducto(producto.id)
    }

    return (
        <Layout>
            <h1 className="text-2xl text-gray-800 font-light">Editar Lote de Productos</h1>

            <div className="flex justify-center mt-5">
                <div className="w-full max-w-lg">

                    <Formik
                        validationSchema={ schemaValidacion }
                        enableReinitialize
                        initialValues={ obtenerProductoStock }
                        onSubmit={ ( valores ) => { actualizarInfoStock(valores) }}
                    >

                    {props => {
                    return (
                            <form
                                className="bg-white shadow-md px-8 pt-6 pb-8 mb-4"
                                onSubmit={props.handleSubmit}
                            >
                                    <div className="mb-4">
                                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="lote">
                                            Lote
                                        </label>

                                        <input
                                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                            id="lote"
                                            type="text"
                                            placeholder="Lote del producto"
                                            onChange={props.handleChange}
                                            onBlur={props.handleBlur}
                                            value={props.values.lote}
                                        />
                                    </div>

                                    { props.touched.lote && props.errors.lote ? (
                                        <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4" >
                                            <p className="font-bold">Error</p>
                                            <p>{props.errors.lote}</p>
                                        </div>
                                    ) : null  }                                                                                                                                                                                 

                                    {productos.length > 0 ? 
                                        <>
                                            <p className="block text-gray-700 text-sm font-bold mb-2">Seleccione o busque el producto</p>
                                            <Select
                                                className="mt-3 mb-4"
                                                options={productos}
                                                onChange={opcion => seleccionarProducto(opcion) }
                                                getOptionValue={ opciones => opciones.id }
                                                getOptionLabel={ opciones => opciones.nombre}
                                                placeholder="Producto..."
                                                noOptionsMessage={() => "No hay resultados"}
                                                onBlur={props.handleBlur}
                                                isMulti={false}
                                                defaultValue={productos.find( i => i.id === props.values.producto)}
                                            />
                                        </>
                                    : 'Cargando...'}
        
                                    <div className="mb-4">
                                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="estado">
                                            Estado
                                        </label>
                                        <select
                                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                            name="estado"
                                            id="estado"
                                            type="text"
                                            onChange={props.handleChange}
                                            onBlur={props.handleBlur}
                                            value={props.values.estado}
                                        >
                                            <option value={props.values.estado} label={props.values.estado} />
                                            <option value="Terminado" label="Terminado" />
                                            <option value="Proceso" label="Proceso" />
                                            <option value="Reproceso" label="Reproceso" />
                                        </select>
                                    </div>
        
                                    { props.touched.estado && props.errors.estado ? (
                                        <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4" >
                                            <p className="font-bold">Error</p>
                                            <p>{props.errors.estado}</p>
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
                                            onChange={props.handleChange}
                                            onBlur={props.handleBlur}
                                            value={props.values.cantidad}
                                        />
                                    </div>
        
                                    { props.touched.cantidad && props.errors.cantidad ? (
                                        <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4" >
                                            <p className="font-bold">Error</p>
                                            <p>{props.errors.cantidad}</p>
                                        </div>
                                    ) : null  }  


                                    <input
                                        type="submit"
                                        className="bg-gray-800 w-full mt-5 p-2 text-white uppercase font-bold hover:bg-gray-900"
                                        value="Editar Producto"
                                    />
                            </form>
                        )
                    }}
                    </Formik>
                </div>
            </div> 
        </Layout>
     );
}

export default EditarLoteProducto
/* eslint-disable react/prop-types */
import React, {useState, useContext} from 'react';
import { useRouter} from 'next/router'
import Layout from '../../components/Layout';
import { Formik} from 'formik'
import { gql, useQuery, useMutation } from '@apollo/client'
import * as Yup from 'yup'
import Swal from 'sweetalert2';
import UsuarioContext from '../../context/usuarios/UsuarioContext';
import Select from 'react-select';

const OBTENER_PRODUCTO = gql`
    query obtenerProducto($id: ID!) {
        obtenerProducto(id: $id) {
            id
            nombre
            categoria
            caja
            cantCaja
            insumos
        }
    }
`; 

const ACTUALIZAR_PRODUCTO = gql`
    mutation actualizarProducto($id: ID!, $input: ProductoInput) {
        actualizarProducto(id: $id, input: $input) {
            id
            nombre
            categoria
            caja
            cantCaja
            insumos
        }
}
`;

const EditarProducto = () => {

    const router = useRouter();
    const { query: { id } } = router;
    const [nuevosInsumos, setNuevosInsumos] = useState([]);

    const pedidoContext = useContext(UsuarioContext);
    const { insumos } = pedidoContext;

    const { data, loading } = useQuery(OBTENER_PRODUCTO, {
        variables: {
            id
        }
    });

    const [ actualizarProducto ] = useMutation( ACTUALIZAR_PRODUCTO );

    const schemaValidacion = Yup.object({
        nombre: Yup.string(),
        categoria: Yup.string(),
        caja: Yup.string(),
        cantCaja: Yup.number(),
        insumos: Yup.array() 
                    
    });
    
    if(loading) return (   
        <Layout>
            Cargando...   
        </Layout>
    );

    const { obtenerProducto } = data;

    const actualizarInfoProducto = async valores => {
        const { nombre, categoria, caja, cantCaja } = valores;
        const insumos = nuevosInsumos;
        try {
            // eslint-disable-next-line no-unused-vars
            const { data } = await actualizarProducto({
                variables: {
                    id,
                    input: {
                        nombre, 
                        categoria,
                        caja,
                        cantCaja,
                        insumos
                    }
                }
            });

            // console.log(data);
  
            // Mostrar Alerta
            Swal.fire(
                'Actualizado',
                'El producto se actualizó correctamente',
                'success'
            )

            // Redireccionar
            router.push('/productos');
        } catch (error) {
            console.log(error);
        }
    }

    const seleccionarInsumo = insumo => {
        if (insumo) {
            setNuevosInsumos(insumo.map(insumo => insumo.id)) 
        } else 
            setNuevosInsumos([]);

    }

    return (
        <Layout>
          <h1 className="text-2xl text-gray-800 font-light">Editar Producto</h1>

          <div className="flex justify-center mt-5">
                <div className="w-full max-w-lg">

                    <Formik
                        validationSchema={ schemaValidacion }
                        enableReinitialize
                        initialValues={ obtenerProducto }
                        onSubmit={ ( valores ) => { actualizarInfoProducto(valores) }}
                    >

                    {props => {
                    return (
                            <form
                                className="bg-white shadow-md px-8 pt-6 pb-8 mb-4"
                                onSubmit={props.handleSubmit}
                            >
                                    <div className="mb-4">
                                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="nombre">
                                            Nombre
                                        </label>

                                        <input
                                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                            id="nombre"
                                            type="text"
                                            placeholder="Nombre del producto"
                                            onChange={props.handleChange}
                                            onBlur={props.handleBlur}
                                            value={props.values.nombre}
                                        />
                                    </div>

                                    { props.touched.nombre && props.errors.nombre ? (
                                        <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4" >
                                            <p className="font-bold">Error</p>
                                            <p>{props.errors.nombre}</p>
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
                                            onChange={props.handleChange}
                                            onBlur={props.handleBlur}
                                        >
                                            <option value={props.values.categoria} label={props.values.categoria} />
                                            <option value="Esponjas" label="Esponjas" />
                                            <option value="Placas" label="Placas" />
                                            <option value="Geles" label="Geles" />
                                            <option value="Sistemas" label="Sistemas" />
                                        </select>
                                    </div>

                                    { props.touched.categoria && props.errors.categoria ? (
                                        <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4" >
                                            <p className="font-bold">Error</p>
                                            <p>{props.errors.categoria}</p>
                                        </div>
                                    ) : null  }

                                    <div className="mb-4">
                                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="caja">
                                            Caja
                                        </label>

                                        <input
                                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                            id="caja"
                                            type="text"
                                            placeholder="Caja del producto"
                                            onChange={props.handleChange}
                                            onBlur={props.handleBlur}
                                            value={props.values.caja}
                                        />
                                    </div>

                                    { props.touched.caja && props.errors.caja ? (
                                        <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4" >
                                            <p className="font-bold">Error</p>
                                            <p>{props.errors.caja}</p>
                                        </div>
                                    ) : null  }

                                    <div className="mb-4">
                                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="cantCaja">
                                            Cantidad por caja
                                        </label>

                                        <input
                                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                            id="cantCaja"
                                            type="number"
                                            placeholder="Cantidad"
                                            onChange={props.handleChange}
                                            onBlur={props.handleBlur}
                                            value={props.values.cantCaja}
                                        />
                                    </div>

                                    { props.touched.cantCaja && props.errors.cantCaja ? (
                                        <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4" >
                                            <p className="font-bold">Error</p>
                                            <p>{props.errors.cantCaja}</p>
                                        </div>
                                    ) : null  }

                                    <p className="block text-gray-700 text-sm font-bold mb-2">Seleccione o busque los insumos</p>
                                    <Select
                                        className="mt-3"
                                        options={insumos}
                                        onChange={opcion => seleccionarInsumo(opcion) }
                                        getOptionValue={ opciones => opciones.id }
                                        getOptionLabel={ opciones => `${opciones.nombre} - Material: ${opciones.categoria}`}
                                        placeholder="Busque o Seleccione el Insumo"
                                        noOptionsMessage={() => "No hay resultados"}
                                        isMulti={true}
                                        onBlur={props.handleBlur}
                                        defaultValue={insumos.filter(({id}) => props.values.insumos.includes(id))}
                                    /> 


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

export default EditarProducto
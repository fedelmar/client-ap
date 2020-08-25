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

const LOTE_INSUMO = gql `
    query obtenerInsumoEnStock($id: ID!){
        obtenerInsumoEnStock(id: $id){
            id
            lote
            cantidad
            insumo
        }
    }
`;

const ACTUALIZAR_LOTE = gql `
    mutation actualizarInsumoStock($id: ID!, $input: sInsumoInput){
        actualizarInsumoStock(id: $id, input: $input) {
            id
            lote
            insumo
            cantidad
        }
    }
`;

const EditarLoteInsumo = () => {

    const router = useRouter();
    const { query: { id } } = router;

    const [idInsumo, setIdInsumo] = useState();

    const { data, loading } = useQuery(LOTE_INSUMO, {
        variables: {
            id
        }
    });

    const [ actualizarInsumoStock ] = useMutation(ACTUALIZAR_LOTE);

    const usuarioContext = useContext(UsuarioContext);
    const { insumos } = usuarioContext;

    if(loading) return (   
        <Layout>
            Cargando...   
        </Layout>
    );

    const {obtenerInsumoEnStock} = data;

    const schemaValidacion = Yup.object({
        lote: Yup.string(),
        insumo: Yup.string(),
        cantidad: Yup.number()                    
    });

    const actualizarInfoStock = async valores => {
        const { lote, cantidad } = valores;
        const insumo = idInsumo;
        try {
            // eslint-disable-next-line no-unused-vars
            const { data } = actualizarInsumoStock({
                variables: {
                    id,
                    input: {
                        lote,
                        cantidad,
                        insumo
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
            router.push('/stockinsumos');
        } catch (error) {
            console.log(error);
        }
    }

    const seleccionarInsumo = insumo => {
        setIdInsumo(insumo.id)
    }

    return (
        <Layout>
        <h1 className="text-2xl text-gray-800 font-light">Editar Lote de Insumos</h1>

        <div className="flex justify-center mt-5">
            <div className="w-full max-w-lg">

                <Formik
                    validationSchema={ schemaValidacion }
                    enableReinitialize
                    initialValues={ obtenerInsumoEnStock }
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
                                        placeholder="Lote del insumo"
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

                                {insumos.length > 0 ? 
                                    <>
                                        <p className="block text-gray-700 text-sm font-bold mb-2">Seleccione o busque el producto</p>
                                        <Select
                                            className="mt-3 mb-4"
                                            options={insumos}
                                            onChange={opcion => seleccionarInsumo(opcion) }
                                            getOptionValue={ opciones => opciones.id }
                                            getOptionLabel={ opciones => opciones.nombre}
                                            placeholder="Insumo..."
                                            noOptionsMessage={() => "No hay resultados"}
                                            onBlur={props.handleBlur}
                                            isMulti={false}
                                            defaultValue={insumos.find( i => i.id === props.values.insumo)}
                                        />
                                    </>
                                : 'Cargando...'}

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
                                    value="Editar Insumo"
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

export default EditarLoteInsumo
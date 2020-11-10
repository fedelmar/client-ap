import React, { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { useRouter } from 'next/router';
import { Formik } from 'formik';
import Swal from 'sweetalert2';
import * as Yup from 'yup';
import Layout from '../../../../components/Layout';
import { gql, useQuery, useMutation } from '@apollo/client';

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
            cantDescarte
            observaciones
        }
    }
`;

const ACTUALIZAR_REGISTRO = gql`
    mutation actualizarRegistroCE($id: ID!, $input: CPEInput){
            actualizarRegistroCE(id: $id, input: $input){
                cantDescarte
                cantProducida         
        }
    }
`;

const EditarRegistro = () => {

    const router = useRouter();
    const { query: { id } } = router;
    const [ actualizarRegistroCE ] = useMutation(ACTUALIZAR_REGISTRO);
    const { data, loading } = useQuery(REGISTRO, {
        variables: {
            id
        }
    });
    const [registro, setRegistro] = useState({
        cantProducida: '',
        cantDescarte: '',
        observaciones: ''
    });
    const schemaValidacion = Yup.object({
        cantProducida: Yup.number(),
        cantDescarte: Yup.string(),
        observaciones: Yup.string()                    
    });
    useEffect(() => {
        if (data) {
            const { obtenerRegistroCE } = data;
            setRegistro({...registro,
                id: id,
                lote: obtenerRegistroCE.lote,
                producto: obtenerRegistroCE.producto,
                cantProducida: obtenerRegistroCE.cantProducida,
                cantDescarte: obtenerRegistroCE.cantDescarte,
                creado: obtenerRegistroCE.creado,
                operario: obtenerRegistroCE.operario,
                lBolsa: obtenerRegistroCE.lBolsa,
                lEsponja: obtenerRegistroCE.lEsponja,
                observaciones: obtenerRegistroCE.observaciones
            })
        }
    }, [data])

    if(loading) return (
        <Layout>
          <p className="text-2xl text-gray-800 font-light" >Cargando...</p>
        </Layout>
    );

    const finalizar = async valores => {
        const {cantProducida, cantDescarte} = valores;
        Swal.fire({
            title: 'Verifique los datos antes de confirmar',
            html:   "Cantidad producida: " + cantProducida + "</br>" +
                    "Cantidad de descarte: " + cantDescarte + "</br>", 
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Confirmar',
            cancelButtonText: 'Cancelar'
          }).then( async (result) => {
            if (result.value) {
                try {
                    const { data } = actualizarRegistroCE({
                        variables: {
                            id: id,
                            input: {
                                cantProducida: cantProducida,
                                cantDescarte: cantDescarte
                            }
                        }
                    });
                    Swal.fire(
                        'Registro actualizado, esta acción no actualiza el Stock',
                        ' ',
                        'success'
                    )
                    router.push('/registros/produccionesponjas');
                } catch (error) {
                    console.log(error)
                }
            }
        }); 
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
                                <p className="text-gray-700 font-light">{format(new Date(data.obtenerRegistroCE.creado), 'dd/MM/yy')}</p>
                            </div>
                            <div className="flex">
                                <p className="text-gray-700 text-mm font-bold mr-1">Hora de inicio: </p>
                                <p className="text-gray-700 font-light">{format(new Date(data.obtenerRegistroCE.creado), 'HH:mm')}</p>
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
                            <p className="text-gray-700 text-mm font-bold mr-1">Lote de Esponja: </p>
                            <p className="text-gray-700 font-light ">{registro.lEsponja}</p>
                        </div>   
                        <div className="flex pb-2">
                            <p className="text-gray-700 text-mm font-bold mr-1">Lote de Bolsa: </p>
                            <p className="text-gray-700 font-light ">{registro.lBolsa}</p>
                        </div>
                    </div>

                <Formik
                    validationSchema={ schemaValidacion }
                    enableReinitialize
                    initialValues={ registro }
                    onSubmit={( valores ) => { finalizar(valores) }}
                >

                {props => {
                    return (
                        <form
                            className="bg-white shadow-md px-8 pt-6 pb-8 mb-4"
                            onSubmit={props.handleSubmit}
                        >
                                <div className="mb-4">
                                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="cantProducida">
                                        Cantidad producida
                                    </label>

                                    <input
                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                        id="cantProducida"
                                        type="number"
                                        placeholder="Cantidad producida"
                                        onChange={props.handleChange}
                                        onBlur={props.handleBlur}
                                        value={props.values.cantProducida}
                                    />
                                </div>

                                { props.touched.cantProducida && props.errors.cantProducida ? (
                                    <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4" >
                                        <p className="font-bold">Error</p>
                                        <p>{props.errors.cantProducida}</p>
                                    </div>
                                ) : null  }
                                
                                <div className="mb-4">
                                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="cantDescarte">
                                        Cantidad de descarte
                                    </label>

                                    <input
                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                        id="cantDescarte"
                                        type="number"
                                        placeholder="Cantidad de descarte"
                                        onChange={props.handleChange}
                                        onBlur={props.handleBlur}
                                        value={props.values.cantDescarte}
                                    />
                                </div>

                                { props.touched.cantDescarte && props.errors.cantDescarte ? (
                                    <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4" >
                                        <p className="font-bold">Error</p>
                                        <p>{props.errors.cantDescarte}</p>
                                    </div>
                                ) : null  }          

                                <input
                                    type="submit"
                                    className="bg-gray-800 w-full mt-5 p-2 text-white uppercase font-bold hover:bg-gray-900"
                                    value="Editar Registro"
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

export default EditarRegistro;
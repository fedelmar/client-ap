import React, { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { useRouter } from 'next/router';
import { Formik } from 'formik';
import Swal from 'sweetalert2';
import * as Yup from 'yup';
import Layout from '../../../../components/Layout';
import { gql, useQuery, useMutation } from '@apollo/client';

const REGISTRO = gql `
    query obtenerRegistroGP($id: ID!){
        obtenerRegistroGP(id: $id){
            creado
            modificado
            operario
            lote
            producto
            loteID
            guardado
            descarte
            pallet
            auxiliar
            observaciones
            estado
        }
    }
`;

const ACTUALIZAR_REGISTRO = gql `
    mutation actualizarRegistroGP($id: ID!, $input: CGPInput){
        actualizarRegistroGP(id: $id, input: $input){
            lote
            guardado
            descarte
        }
    }
`;

const EditarRegistro = () => {

    const router = useRouter();
    const { query: { id } } = router;
    const [ actualizarRegistroGP ] = useMutation(ACTUALIZAR_REGISTRO);
    const { data, loading } = useQuery(REGISTRO, {
        variables: {
            id
        }
    });
    const [registro, setRegistro] = useState({
        lote: '',
        producto: '',
        guardado: 0,
        descarte: 0,
        operario: '',
        pallet: '',
        observaciones: '',
        auxiliar: ''
    });
    const schemaValidacion = Yup.object({
        guardado: Yup.number(),
        descarte: Yup.number()
    });
    useEffect(() => {
        if (data) {
            const { obtenerRegistroGP } = data;
            setRegistro({...registro,
                id: id,
                lote: obtenerRegistroGP.lote,
                producto: obtenerRegistroGP.producto,
                guardado: obtenerRegistroGP.guardado,
                descarte: obtenerRegistroGP.descarte,
                creado: obtenerRegistroGP.creado,
                modificado: obtenerRegistroGP.modificado,
                operario: obtenerRegistroGP.operario,
                pallet: obtenerRegistroGP.pallet,
                observaciones: obtenerRegistroGP.observaciones,
                auxiliar: obtenerRegistroGP.auxiliar
            })
        }
    }, [data])

    if(loading) return (
        <Layout>
          <p className="text-2xl text-gray-800 font-light" >Cargando...</p>
        </Layout>
    );

    const finalizar = valores => {
        const { guardado, descarte, lote } = valores;
        Swal.fire({
            title: 'Verifique los datos antes de confirmar',
            html:   "Lote: " + lote + "</br>" +
                    "Cantidad producida: " + guardado + "</br>" +
                    "Cantidad de descarte: " + descarte + "</br>", 
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Confirmar',
            cancelButtonText: 'Cancelar'
          }).then( async (result) => {
            if (result.value) {
                try {
                    const { data } = actualizarRegistroGP({
                        variables: {
                            id: id,
                            input: {
                                lote: lote,
                                guardado: guardado,
                                descarte: descarte
                            }
                        }
                    });
                    Swal.fire(
                        'Registro actualizado, esta acción no actualiza el Stock',
                        ' ',
                        'success'
                    )
                    router.push('/registros/guardadoplacas');
                } catch (error) {
                    console.log(error)
                }
            }
        }); 
    }

    return (
        <Layout>
            <h1 className="text-2xl text-gray-800 font-light">Editar Registro</h1>

            <div className="flex justify-center mt-5">
                <div className="w-full bg-white shadow-md px-8 pt-6 pb-8 mb-4 max-w-lg">
                    <div className="mb-2 border-b-2 border-gray-600">
                        <div className="flex justify-between pb-2">
                            <div className="flex">
                                <p className="text-gray-700 text-mm font-bold mr-1">Dia: </p>
                                <p className="text-gray-700 font-light">{format(new Date(data.obtenerRegistroGP.creado), 'dd/MM/yy')}</p>
                            </div>
                            <div className="flex">
                                <p className="text-gray-700 text-mm font-bold mr-1">Horario: </p>
                                <p className="text-gray-700 font-light">{format(new Date(data.obtenerRegistroGP.creado), 'HH:mm',)}</p>
                                <p className="text-gray-700 font-light mx-1">a</p>
                                <p className="text-gray-700 font-light">{format(new Date(data.obtenerRegistroGP.modificado), 'HH:mm')}</p>
                            </div>
                        </div>

                        <div className="flex">
                            <p className="text-gray-700 text-mm font-bold mr-1">Producto: </p>
                            <p className="text-gray-700 font-light">{registro.producto}</p>
                        </div>
                        <div className="flex">
                            <p className="text-gray-700 text-mm font-bold mr-1">Pallet: </p>
                            <p className="text-gray-700 font-light ">{registro.pallet}</p>
                        </div>
                        <div className="flex pb-2">
                            <p className="text-gray-700 text-mm font-bold mr-1">Auxiliares: </p>
                            <p className="text-gray-700 font-light ">{registro.auxiliar}</p>
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
                                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="lote">
                                        Lote
                                    </label>

                                    <input
                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                        id="lote"
                                        type="string"
                                        placeholder="Lote"
                                        onChange={props.handleChange}
                                        onBlur={props.handleBlur}
                                        value={props.values.lote}
                                    />
                                </div>
                            
                                <div className="mb-4">
                                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="guardado">
                                        Placas guardadas
                                    </label>

                                    <input
                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                        id="guardado"
                                        type="number"
                                        placeholder="Cantidad producida"
                                        onChange={props.handleChange}
                                        onBlur={props.handleBlur}
                                        value={props.values.guardado}
                                    />
                                </div>

                                { props.touched.guardado && props.errors.guardado ? (
                                    <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4" >
                                        <p className="font-bold">Error</p>
                                        <p>{props.errors.guardado}</p>
                                    </div>
                                ) : null  }
                                
                                <div className="mb-4">
                                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="descarte">
                                        Cantidad de descarte
                                    </label>

                                    <input
                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                        id="descarte"
                                        type="number"
                                        placeholder="Cantidad de descarte"
                                        onChange={props.handleChange}
                                        onBlur={props.handleBlur}
                                        value={props.values.descarte}
                                    />
                                </div>

                                { props.touched.descarte && props.errors.descarte ? (
                                    <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4" >
                                        <p className="font-bold">Error</p>
                                        <p>{props.errors.descarte}</p>
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
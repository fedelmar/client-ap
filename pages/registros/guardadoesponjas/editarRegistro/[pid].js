import React, { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { useRouter } from 'next/router';
import { Formik } from 'formik';
import Swal from 'sweetalert2';
import * as Yup from 'yup';
import Layout from '../../../../components/Layout';
import { gql, useQuery, useMutation } from '@apollo/client';

const REGISTRO = gql `
    query obtenerRegistroGE($id: ID!){
        obtenerRegistroGE(id: $id){
            creado
            modificado
            operario
            lote
            caja
            descCajas
            guardado
            descarte
            auxiliar
            observaciones
            producto
        }
    }
`;

const ACTUALIZAR_REGISTRO = gql `
    mutation actualizarRegistroGE($id: ID!, $input: CGEInput){
        actualizarRegistroGE(id: $id, input: $input){
            guardado
            descarte
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
        lote: '',
        producto: '',
        guardado: 0,
        descarte: 0,
        descCajas: 0,
        operario: '',
        caja: '',
        descCajas: '',
        observaciones: '',
        auxiliar: ''
    });
    const schemaValidacion = Yup.object({
        guardado: Yup.number(),
        descarte: Yup.number()
    });
    useEffect(() => {
        if (data) {
            const { obtenerRegistroGE } = data;
            setRegistro({...registro,
                id: id,
                lote: obtenerRegistroGE.lote,
                producto: obtenerRegistroGE.producto,
                guardado: obtenerRegistroGE.guardado,
                descarte: obtenerRegistroGE.descarte,
                creado: obtenerRegistroGE.creado,
                modificado: obtenerRegistroGE.modificado,
                operario: obtenerRegistroGE.operario,
                caja: obtenerRegistroGE.caja,
                descCajas: obtenerRegistroGE.descCajas,
                observaciones: obtenerRegistroGE.observaciones,
                auxiliar: obtenerRegistroGE.auxiliar
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
                    const { data } = actualizarRegistroCE({
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
                    router.push('/registros/guardadoesponjas');
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
                                <p className="text-gray-700 font-light">{format(new Date(data.obtenerRegistroGE.creado), 'dd/MM/yy')}</p>
                            </div>
                            <div className="flex">
                                <p className="text-gray-700 text-mm font-bold mr-1">Horario: </p>
                                <p className="text-gray-700 font-light">{format(new Date(data.obtenerRegistroGE.creado), 'HH:mm',)}</p>
                                <p className="text-gray-700 font-light mx-1">a</p>
                                <p className="text-gray-700 font-light">{format(new Date(data.obtenerRegistroGE.modificado), 'HH:mm')}</p>
                            </div>
                        </div>

                        <div className="flex">
                            <p className="text-gray-700 text-mm font-bold mr-1">Producto: </p>
                            <p className="text-gray-700 font-light">{registro.producto}</p>
                        </div>             
                        <div className="flex">
                            <p className="text-gray-700 text-mm font-bold mr-1">Caja: </p>
                            <p className="text-gray-700 font-light ">{registro.caja}</p>
                        </div>   
                        <div className="flex">
                            <p className="text-gray-700 text-mm font-bold mr-1">Descarte de Cajas: </p>
                            <p className="text-gray-700 font-light ">{registro.descCajas}</p>
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
                                        Esponjas guardadas
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
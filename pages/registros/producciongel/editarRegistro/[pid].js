import React, { useEffect, useState } from 'react'; 
import { useRouter } from 'next/router';
import * as Yup from 'yup';
import { format } from 'date-fns';
import { Formik } from 'formik';
import Swal from 'sweetalert2';
import { useQuery, useMutation } from '@apollo/client';

import Layout from '../../../../components/Layout';
import { ACTUALIZAR_REGISTRO, OBTENER_REGISTRO } from '../../../../servicios/produccionDeGel';

const EditarRegistro = () => {

    const router = useRouter();
    const { query } = router;
    if (!query) return null;
    const { pid: id } = query;
    const [ actualizarRegistroCPG ] = useMutation(ACTUALIZAR_REGISTRO);
    const { data, loading } = useQuery(OBTENER_REGISTRO, {
        variables: {
            id
        }
    });
    const [registro, setRegistro] = useState({});
    const schemaValidacion = Yup.object({
        lote: Yup.string(),
        cantProducida: Yup.number(),
        cantDescarte: Yup.number(),
        loteBolsa: Yup.string(),                   
    });

    useEffect(() => {
        if (data) {
            const { obtenerRegistroCPG } = data;
            setRegistro({...registro, obtenerRegistroCPG })
        }
    }, [data])

    if(loading) return (
        <Layout>
          <p className="text-2xl text-gray-800 font-light" >Cargando...</p>
        </Layout>
    );

    const finalizar = async valores => {
        const { cantProducida, cantDescarte, lote, loteGel } = valores;
        Swal.fire({
            title: 'Verifique los datos antes de confirmar',
            html:   "Lote: " + lote + "</br>" +
                    "Cantidad producida: " + cantProducida + "</br>" +
                    "Cantidad de descarte: " + cantDescarte + "</br>" +
                    "Lote de Gel: " + loteGel + "</br>", 
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Confirmar',
            cancelButtonText: 'Cancelar'
          }).then( async (result) => {
            if (result.value) {
                try {
                    const { data } = await actualizarRegistroCPG({
                        variables: {
                            id: id,
                            input: {
                                lote,
                                cantProducida,
                                cantDescarte,
                                loteGel,
                            }
                        }
                    });
                    Swal.fire(
                        'Registro actualizado, esta acción no modifica el Stock',
                        ' ',
                        'success'
                    )
                    router.push('/registros/producciongel');
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
                                <p className="text-gray-700 font-light">{format(new Date(data.obtenerRegistroCPG.creado), 'dd/MM/yy')}</p>
                            </div>
                            <div className="flex">
                                <p className="text-gray-700 text-mm font-bold mr-1">Horario: </p>
                                <p className="text-gray-700 font-light">{format(new Date(data.obtenerRegistroCPG.creado), 'HH:mm',)}</p>
                                <p className="text-gray-700 font-light mx-1">a</p>
                                <p className="text-gray-700 font-light">{format(new Date(data.obtenerRegistroCPG.modificado), 'HH:mm')}</p>
                            </div>
                        </div>
                        
                        <div className="flex">
                            <p className="text-gray-700 text-mm font-bold mr-1">Producto: </p>
                            <p className="text-gray-700 font-light">{registro.producto}</p>
                        </div>
                        <div className="flex">
                            <p className="text-gray-700 text-mm font-bold mr-1">Cliente: </p>
                            <p className="text-gray-700 font-light">{registro.cliente}</p>
                        </div>
                        <div className="flex">
                            <p className="text-gray-700 text-mm font-bold mr-1">Doble Bolsa: </p>
                            <p>{registro.dobleBolsa ? '✔' : '✘'}</p>
                        </div>
                        <div className="flex">
                            <p className="text-gray-700 text-mm font-bold mr-1">Manta: </p>
                            <p>{registro.manta ? '✔' : '✘'}</p>
                        </div>             
                        <div className="flex">
                            <p className="text-gray-700 text-mm font-bold mr-1">Lote de Bolsa: </p>
                            <p className="text-gray-700 font-light ">{registro.loteBolsa}</p>
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
                            
                                {registro.cantProducida ?
                                <>
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
                                </> : null}
                                
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

                                <div className="mb-4">
                                    <label className="block text-gray-700 font-bold mb-2" htmlFor="loteGel">
                                        Lote de Gel
                                    </label>
    
                                    <input
                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                        id="loteGel"
                                        type="text"
                                        placeholder="Ingrese el lote de gel..."
                                        onChange={props.handleChange}
                                        onBlur={props.handleBlur}
                                        value={props.values.loteGel}
                                    />
                                </div>
    
                                { props.touched.loteGel && props.errors.loteGel ? (
                                    <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4" >
                                        <p className="font-bold">Error</p>
                                        <p>{props.errors.loteGel}</p>
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
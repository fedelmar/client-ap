import React, { useEffect, useState } from 'react'; 
import { useRouter } from 'next/router';
import * as Yup from 'yup';
import { format } from 'date-fns';
import { Formik } from 'formik';
import Swal from 'sweetalert2';
import { gql, useQuery, useMutation } from '@apollo/client';

import Layout from '../../../../components/Layout';

const REGISTRO = gql `
    query obtenerRegistroIngreso($id: ID!){
        obtenerRegistroIngreso(id:$id){
            id
            insumo
            cantidad
            proveedor
            remito
            creado
            lote
        }
    }
`;

const ACTUALIZAR_REGISTRO = gql`
    mutation actualizarRegistroIngreso($id: ID!, $input: IngresoInput){
        actualizarRegistroIngreso(id: $id, input: $input){
            id
            insumo
            cantidad
            proveedor
            remito
            creado
            lote
        }
    }
`;

const EditarRegistro = () => {
    const router = useRouter();
    const { query: { id } } = router;
    const [ actualizarRegistroIngreso ] = useMutation(ACTUALIZAR_REGISTRO);
    const { data, loading } = useQuery(REGISTRO, {
        variables: {
            id
        }
    });
    const [registro, setRegistro] = useState();
    const schemaValidacion = Yup.object({
        lote: Yup.string(),
        cantidad: Yup.number(),
        proveedor: Yup.string(),
        remito: Yup.string(),                   
    });

    useEffect(() => {
        if (data) {
            const { 
                    lote,
                    creado,
                    cantidad,
                    insumo,
                    proveedor,
                    remito,       
            } = data.obtenerRegistroIngreso;
                
            setRegistro({...registro,
                lote,
                creado,
                cantidad,
                insumo,
                proveedor,
                remito,
            })
        }
    }, [data])

    if(loading) return (
        <Layout>
          <p className="text-2xl text-gray-800 font-light" >Cargando...</p>
        </Layout>
    );

    const finalizar = async valores => {
        const { remito, proveedor, lote, cantidad } = valores;
        Swal.fire({
            title: 'Verifique los datos antes de confirmar',
            html:   "Lote: " + lote + "</br>" +
                    "Remito: " + remito + "</br>" +
                    "Proveedor: " + proveedor + "</br>" +
                    "Cantidad: " + cantidad + "</br>", 
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Confirmar',
            cancelButtonText: 'Cancelar'
          }).then( async (result) => {
            if (result.value) {
                try {
                    const { data } = await actualizarRegistroIngreso({
                        variables: {
                            id,
                            input: {
                                lote,
                                remito,
                                proveedor,
                                cantidad,
                            }
                        }
                    });
                    Swal.fire(
                        'Registro actualizado, esta acción no modifica el Stock',
                        ' ',
                        'success'
                    )
                    router.push('/registros/ingresos');
                } catch (error) {
                    console.log(error)
                }
            }
        });
    };

    return (
        <Layout>
            <h1 className="text-2xl text-gray-800 font-light">Editar Registro</h1>

            {registro ? 
                <div className="flex justify-center mt-5">
                    <div className="w-full bg-white shadow-md px-8 pt-6 pb-8 mb-4 max-w-lg">
                        <div className="mb-2 border-b-2 border-gray-600">
                            <div className="flex justify-between pb-2">
                                <div className="flex">
                                    <p className="text-gray-700 text-mm font-bold mr-1">Dia: </p>
                                    <p className="text-gray-700 font-light">{format(new Date(registro.creado), 'dd/MM/yy')}</p>
                                </div>
                                <div className="flex">
                                    <p className="text-gray-700 text-mm font-bold mr-1">Horario: </p>
                                    <p className="text-gray-700 font-light">{format(new Date(registro.creado), 'HH:mm',)}</p>
                                </div>
                            </div>
                            
                            <div className="flex mb-2">
                                <p className="text-gray-700 text-mm font-bold mr-1">Insumo: </p>
                                <p className="text-gray-700 font-light">{registro.insumo}</p>
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

                                    { props.touched.lote && props.errors.lote ? (
                                        <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4" >
                                            <p className="font-bold">Error</p>
                                            <p>{props.errors.lote}</p>
                                        </div>
                                    ) : null  }

                                    <div className="mb-4">
                                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="remito">
                                            Remito
                                        </label>

                                        <input
                                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                            id="remito"
                                            type="string"
                                            placeholder="Remito"
                                            onChange={props.handleChange}
                                            onBlur={props.handleBlur}
                                            value={props.values.remito}
                                        />
                                    </div>

                                    { props.touched.remito && props.errors.remito ? (
                                        <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4" >
                                            <p className="font-bold">Error</p>
                                            <p>{props.errors.remito}</p>
                                        </div>
                                    ) : null  }

                                    <div className="mb-4">
                                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="proveedor">
                                            Proveedor
                                        </label>

                                        <input
                                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                            id="proveedor"
                                            type="string"
                                            placeholder="Proveedor"
                                            onChange={props.handleChange}
                                            onBlur={props.handleBlur}
                                            value={props.values.proveedor}
                                        />
                                    </div>

                                    { props.touched.proveedor && props.errors.proveedor ? (
                                        <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4" >
                                            <p className="font-bold">Error</p>
                                            <p>{props.errors.proveedor}</p>
                                        </div>
                                    ) : null  }

                                    <div className="mb-4">
                                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="proveedor">
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
                                        value="Editar Registro"
                                    />
                                </form>      
                            )
                        }}
                        </Formik>
                    </div>
                </div>: null} 
        </Layout>
    );
}

export default EditarRegistro;
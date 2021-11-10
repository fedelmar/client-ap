import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { format } from 'date-fns';
import Swal from 'sweetalert2';
import { useMutation, useQuery } from '@apollo/client';
import { useRouter } from 'next/router';
import { NUEVO_DOBLE_REGISTRO } from '../../../../servicios/produccionDeGel';
import { LOTE_INSUMO } from '../../../../servicios/stockInsumos';
import { OBTENER_PRODUCTO_POR_NOMBRE } from '../../../../servicios/productos';

const FormLlenado = ({registro, sesionActiva, volver}) => {
    const router = useRouter();
    const [ nuevoDobleRegistroCPG ] = useMutation(NUEVO_DOBLE_REGISTRO);
    const [mensaje, guardarMensaje] = useState(null);
    const { data, loading } = useQuery(LOTE_INSUMO, {
        variables: {
            input: registro ? registro.loteBolsa : '',
        }
    });
    const { data: dataProd, loading: loadingProd } = useQuery(OBTENER_PRODUCTO_POR_NOMBRE, {
        variables: {
            nombre: registro ? registro.producto : '',
        }
    });
    // Definicion de formulario de finalizacion de registro
    const formikCierre = useFormik({
        initialValues: {
            cantDescarte: 0,
            puesto1: '',
            puesto2: '',
            observaciones: ''
        },
        validationSchema: Yup.object({
            cantDescarte: Yup.number()
                                    .required('Ingrese el descarte'),
            puesto1: Yup.string().required('Ingrese los operarios en el Puesto 1'),
            puesto2: Yup.string().required('Ingrese los operarios en el Puesto 2'),
            observaciones: Yup.string(),
        }), 
        onSubmit: valores => {
            finalizarRegistro(valores);
        }
    });

    if(loading || loadingProd) return (
          <p className="text-2xl text-gray-800 font-light" >Cargando...</p>
    );
    
    // Finalizar el registro actualizando los datos en la BD
    const finalizarRegistro = async valores => {
        const { cantDescarte, puesto1, puesto2, observaciones } = valores;
        let msjManta;
        registro.manta ? msjManta = "Si" : msjManta = "No";
    
        Swal.fire({
            title: 'Verifique los datos antes de confirmar',
            html:   "Lote: " + registro.lote + "</br>" + 
                    "Producto: " + registro.producto + "</br>" +
                    "Operario: " + registro.operario + "</br>" +
                    "Cliente: " + registro.cliente + "</br>" +
                    "Lote de Bolsa: " + registro.loteBolsa + "</br>" +
                    "Lote de Gel: " + registro.loteGel + "</br>" +
                    "Manta: " + msjManta + "</br>" +
                    "Cantidad de descarte: " + cantDescarte + "</br>" +
                    "Puesto 1: " + puesto1 + "</br>" +
                    "Puesto 2: " + puesto2 + "</br>" +
                    "Observaciones: " + observaciones + "</br>",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Confirmar',
            cancelButtonText: 'Cancelar'
        }).then( async (result) => {
            if (result.value) {
                try {
                    const { data } = await nuevoDobleRegistroCPG({
                        variables: {
                            id: sesionActiva.id,
                            input: {      
                                operario: registro.operario,
                                cantDescarte,
                                puesto1,
                                puesto2,
                                observaciones,
                                lote: registro.lote, 
                                producto: registro.producto,
                                productoID: registro.productoID ? registro.productoID : obtenerProductoPorNombre.id,
                                loteBolsa: registro.loteBolsa,
                                loteBolsaID: registro.loteBolsaID ? registro.loteBolsaID : obtenerInsumoPorLote.id,
                            }   
                        }                
                    });
                    Swal.fire(
                        'Se guardo el registro y se actualizo el stock de productos',
                        '¡Bien hecho!',
                        'success'
                    )
                    router.push('/registros/producciongel');
                } catch (error) {
                    console.log(error)
                    guardarMensaje(error.message.replace('GraphQL error: ', ''));
                }
            }
        })   
    };

    const { obtenerInsumoPorLote } = data;
    const { obtenerProductoPorNombre } = dataProd;

    // Mostrar mensaje de base de datos si hubo un error
    const mostrarMensaje = () => {
        return(
            <div className="bg-white py-2 px-3 w-full my-3 max-w-sm text-center mx-auto">
                <p>{mensaje}</p>
            </div>
        )
    };

    return (
        <div className="flex justify-center mt-5">
            {mensaje && mostrarMensaje()}
            <div className="w-full bg-white shadow-md px-8 pt-6 pb-8 mb-4 max-w-lg">
                <div className="mb-2 border-b-2 border-gray-600">
                    <div className="flex justify-between pb-2">
                        <div className="flex">
                            <p className="text-gray-700 text-mm font-bold mr-1">Dia: </p>
                            <p className="text-gray-700 font-light">{format(new Date(sesionActiva.creado), 'dd/MM/yy')}</p>
                        </div>
                        <div className="flex">
                            <p className="text-gray-700 text-mm font-bold mr-1">Hora de inicio: </p>
                            <p className="text-gray-700 font-light">{format(new Date(sesionActiva.creado), 'HH:mm')}</p>
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
                        <p className="text-gray-700 text-mm font-bold mr-1">Lote de Gel: </p>
                        <p className="text-gray-700 font-light">{registro.loteGel}</p>
                    </div>
                    <div className="flex justify-between pb-2">
                            <div className="flex">
                                <p className="text-gray-700 text-mm font-bold mr-1">Lote de Bolsa: </p>
                                <p className="text-gray-700 font-light">{registro.loteBolsa}</p>
                            </div>
                            <div className="flex">
                                <p className="text-gray-700 text-mm font-bold mr-1">Disponibles: </p>
                                <p className="text-gray-700 font-light">{registro.bolsasDisponibles ? registro.bolsasDisponibles : obtenerInsumoPorLote.cantidad }</p>
                            </div>
                        </div>
                </div>
                <form
                    className="bg-white shadow-md px-8 pt-2 pb-8 mb-2"
                    onSubmit={formikCierre.handleSubmit}
                >                            
                    <div className="mb-4">
                        <label className="block text-gray-700 font-bold mb-2" htmlFor="cantDescarte">
                            Descarte
                        </label>

                        <input
                            className="shadow appearance-none border rounded w-full mb-1 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            id="cantDescarte"
                            type="number"
                            placeholder="Ingrese la cantidad de cantDescarte..."
                            onChange={formikCierre.handleChange}
                            onBlur={formikCierre.handleBlur}
                            value={formikCierre.values.cantDescarte}
                        />
                    </div>

                    { formikCierre.touched.cantDescarte && formikCierre.errors.cantDescarte ? (
                        <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4" >
                            <p className="font-bold">Error</p>
                            <p>{formikCierre.errors.cantDescarte}</p>
                        </div>
                    ) : null  }

                    <div className="mb-4">
                        <label className="block text-gray-700 font-bold mb-2" htmlFor="puesto1">
                            Puesto 1
                        </label>

                        <input
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            id="puesto1"
                            type="text"
                            placeholder="Ingrese integrantes del Puesto 1"
                            onChange={formikCierre.handleChange}
                            onBlur={formikCierre.handleBlur}
                            value={formikCierre.values.puesto1}
                        />
                    </div>

                    { formikCierre.touched.puesto1 && formikCierre.errors.puesto1 ? (
                        <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4" >
                            <p className="font-bold">Error</p>
                            <p>{formikCierre.errors.puesto1}</p>
                        </div>
                    ) : null  }

                    <div className="mb-4">
                        <label className="block text-gray-700 font-bold mb-2" htmlFor="puesto2">
                            Puesto 2
                        </label>

                        <input
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            id="puesto2"
                            type="text"
                            placeholder="Ingrese integrantes del Puesto 2"
                            onChange={formikCierre.handleChange}
                            onBlur={formikCierre.handleBlur}
                            value={formikCierre.values.puesto2}
                        />
                    </div>

                    { formikCierre.touched.puesto2 && formikCierre.errors.puesto2 ? (
                        <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4" >
                            <p className="font-bold">Error</p>
                            <p>{formikCierre.errors.puesto2}</p>
                        </div>
                    ) : null  }

                    <div className="mb-2">
                        <label className="block text-gray-700 font-bold mb-2" htmlFor="observaciones">
                            Observaciones
                        </label>

                        <input
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            id="observaciones"
                            type="text"
                            placeholder="Observaciones..."
                            onChange={formikCierre.handleChange}
                            onBlur={formikCierre.handleBlur}
                            value={formikCierre.values.observaciones}
                        />
                    </div>

                    { formikCierre.touched.observaciones && formikCierre.errors.observaciones ? (
                        <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4" >
                            <p className="font-bold">Error</p>
                            <p>{formikCierre.errors.observaciones}</p>
                        </div>
                    ) : null  }

                    <input
                        type="submit"
                        className="bg-red-800 w-full mt-2 p-2 text-white uppercase font-bold hover:bg-red-900"
                        value="Finalizar Registro"
                    />
                    <button
                        className="bg-gray-800 w-full mt-2 p-2 text-white uppercase font-bold hover:bg-gray-900" 
                        onClick={() => volver()}
                    >
                        Volver
                    </button>
                </form>
            </div>
        </div>
    );
}

export default FormLlenado;
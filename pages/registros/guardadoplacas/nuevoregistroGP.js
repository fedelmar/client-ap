import React, {useState, useContext, useEffect} from 'react';
import UsuarioContext from '../../../context/usuarios/UsuarioContext';
import Layout from '../../../components/Layout';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { format } from 'date-fns';
import {gql, useQuery, useMutation} from '@apollo/client';
import Select from 'react-select';
import Swal from 'sweetalert2';
import { useRouter } from 'next/router';

const LOTES_PLACAS = gql `
    query obtenerStockPlacas{
        obtenerStockPlacas{
            lote
            loteID
            estado
            caja
            producto
            cantCaja
            cantidad
        }
    }
`;

const NUEVO_REGISTRO = gql `
    mutation nuevoRegistroGP($id: ID, $input: CGPInput){
        nuevoRegistroGP(id: $id, input: $input){
            id
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

const NuevoRegistroGP = () => {

    const router = useRouter();
    const usuarioContext = useContext(UsuarioContext);
    const { nombre } = usuarioContext.usuario;
    const [mensaje, guardarMensaje] = useState(null);
    const [session, setSession] = useState(false);
    const [registro, setRegistro] = useState({
        lote: '',
        creado: '',
        id: '',
        operario: nombre,
        cantidad: ''
    });
    const { data, loading } = useQuery(LOTES_PLACAS, {
        pollInterval: 500,
    });
    const [ nuevoRegistroGP ] = useMutation(NUEVO_REGISTRO);
    const formikCierre = useFormik({
        initialValues: {
            cantGuardada: 0,
            cantDescarte: 0,
            pallet: '',
            auxiliar: '',
            observaciones: ''
        },
        validationSchema: Yup.object({
            cantGuardada: Yup.number()
                                .max(registro.cantidad, `Debe ser menor o igual a ${registro.cantidad}`)
                                .required('Ingrese la cantidad producida'),

            cantDescarte: Yup.number()
                                .required('Ingrese el descarte generado')
                                .test('disponibilidad', 'No hay disponibilidad',
                                function(cantDescarte) {
                                    return cantDescarte <= registro.cantidad - cantGuardada.value
                                }),
            pallet: Yup.string().required('Ingrese el pallet'),
            auxiliar: Yup.string(),
            observaciones: Yup.string()               
        }),
        onSubmit: valores => {       
            terminarProduccion(valores);            
        }
    });
    useEffect(() => {
        if (data) {
            data.obtenerStockPlacas.map(i => 
                i.loteID === registro.loteID ?
                    setRegistro({...registro, cantidad: i.cantidad})
                : null
            )
        }
    },[data])
    useEffect (() => {
        if (nombre) {
            setRegistro({...registro, operario: nombre})
        }
    },[nombre])

    if(loading) return (
        <Layout>
          <p className="text-2xl text-gray-800 font-light" >Cargando...</p>
        </Layout>
    );
    const {obtenerStockPlacas} = data;

    const terminarProduccion = async valores => {
        // Finaliza la produccion, se guarda registro en la DB y se modifican los datos de productos

        //Volver a planillas de produccion y modificar base de datos
        const {cantDescarte, cantGuardada, observaciones, auxiliar, pallet} = valores;

        Swal.fire({
            title: 'Verifique los datos antes de confirmar',
            html:   "Lote: " + registro.lote + "</br>" + 
                    "Producto: " + registro.producto + "</br>" +
                    "Operario: " + registro.operario + "</br>" +
                    "Esponjas guardadas: " + cantGuardada + "</br>" +
                    "Cantidad de descarte: " + cantDescarte + "</br>" +
                    "Pallet: " + pallet + "</br>" +
                    "Auxiliar/es: " + auxiliar + "</br>" +
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
                    const { data } = await nuevoRegistroGP({
                        variables: {
                            id: registro.id,
                            input: {
                                operario: registro.operario,
                                lote: registro.lote,
                                guardado: cantGuardada,
                                descarte: cantDescarte,
                                auxiliar: auxiliar,
                                observaciones: observaciones,
                                pallet: pallet
                            }
                        }                
                    });
                    Swal.fire(
                        'Se guardo el registro y se creo un nuevo lote en stock de productos',
                        data.nuevoRegistroGP,
                        'success'
                    )
                    router.push('/registros/guardadoplacas');
                } catch (error) {
                    guardarMensaje(error.message.replace('GraphQL error: ', ''));
                }
            }
          })
    }

    const handleInicio = async () => {   
        try {
            const { data } = await nuevoRegistroGP({
                variables: {
                    input: {
                        operario: registro.operario,
                        lote: registro.lote,
                        loteID: registro.loteID,
                        producto: registro.producto
                    }
                }                
            });
            setRegistro({...registro, creado: data.nuevoRegistroGP.creado, id: data.nuevoRegistroGP.id})
            setSession(true);
        } catch (error) {
            console.log(error)
        }
    }

    const seleccionarLPlaca = opcion => {
        const {lote, loteID, producto, caja, cantCaja, estado, cantidad} = opcion;
        setRegistro({...registro, lote, loteID, producto, caja, cantCaja, estado, cantidad})
    }

    // Mostrar mensaje de base de datos si hubo un error
    const mostrarMensaje = () => {
        return(
            <div className="bg-white py-2 px-3 w-full my-3 max-w-sm text-center mx-auto">
                <p>{mensaje}</p>
            </div>
        )
    }

    return (
        <Layout>
            <h1 className="text-2xl text-gray-800 font-light" >Nuevo Registro de Guardado de Placas</h1>

            {mensaje && mostrarMensaje()}

            <div>
                {!session ? (
                    <div className="flex justify-center mt-5">
                        <div className="w-full max-w-lg">
                            <div className="bg-white shadow-md px-8 pt-6 pb-8 mb-4">
                                <p className="block text-gray-700 font-bold mb-2">Lote de Placa</p>
                                <Select
                                    className="mt-3 mb-4"
                                    options={obtenerStockPlacas}
                                    onChange={opcion => seleccionarLPlaca(opcion)}
                                    getOptionValue={ opciones => opciones.loteId }
                                    getOptionLabel={ opciones => `${opciones.lote} ${opciones.producto} Disp: ${opciones.cantidad}`}
                                    placeholder="Lote..."
                                    noOptionsMessage={() => "No hay resultados"}
                                    isMulti={false}
                                />
                                <button 
                                    onClick={() => handleInicio()}
                                    className="bg-gray-800 w-full mt-5 p-2 text-white uppercase font-bold hover:bg-gray-900"
                                >
                                    Iniciar Guardado
                                </button>
                            </div>
                        </div>
                    </div>
                ) :(
                    <div className="flex justify-center mt-5">
                        <div className="w-full bg-white shadow-md px-8 pt-6 pb-8 mb-4 max-w-lg">
                            <div className="mb-2 border-b-2 border-gray-600">
                                <div className="flex justify-between pb-2">
                                    <div className="flex">
                                        <p className="text-gray-700 text-mm font-bold mr-1">Dia: </p>
                                        <p className="text-gray-700 font-light ">{format(new Date(registro.creado), 'dd/MM/yy')}</p>
                                    </div>
                                    <div className="flex">
                                        <p className="text-gray-700 text-mm font-bold mr-1">Hora de inicio: </p>
                                        <p className="text-gray-700 font-light">{format(new Date(registro.creado), 'HH:mm')}</p>
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
                                    <p className="text-gray-700 text-mm font-bold mr-1">Estado del producto: </p>
                                    <p className="text-gray-700 font-light">{registro.estado}</p>
                                </div>
                            </div>
                            <div className="flex justify-center mt-1 ">
                                    <p className="text-gray-700 text-xl font-bold mr-1">Placas disponibles: </p>
                                    <p className="text-gray-700 text-xl font-light px-2">{registro.cantidad}</p>
                            </div>
                            <form
                                className="bg-white shadow-md px-8 pt-6 pb-8 mb-4"
                                onSubmit={formikCierre.handleSubmit}
                            >

                                <div className="mb-4 mt-1">
                                    <label className="block text-gray-700 font-bold mb-2" htmlFor="cantGuardada">
                                        Placas guardadas
                                    </label>
    
                                    <input
                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                        id="cantGuardada"
                                        type="number"
                                        placeholder="Ingrese la cantidad guardada..."
                                        onChange={formikCierre.handleChange}
                                        onBlur={formikCierre.handleBlur}
                                        value={formikCierre.values.cantGuardada}
                                    />
                                </div>

                                { formikCierre.touched.cantGuardada && formikCierre.errors.cantGuardada ? (
                                    <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4" >
                                        <p className="font-bold">Error</p>
                                        <p>{formikCierre.errors.cantGuardada}</p>
                                    </div>
                                ) : null  }

                                <div className="mb-4">
                                    <label className="block text-gray-700 font-bold mb-2" htmlFor="cantDescarte">
                                        Cantidad de descarte
                                    </label>
    
                                    <input
                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                        id="cantDescarte"
                                        type="number"
                                        placeholder="Ingrese la cantidad de descarte..."
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
                                    <label className="block text-gray-700 font-bold mb-2" htmlFor="pallet">
                                        Pallet
                                    </label>
    
                                    <input
                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                        id="pallet"
                                        type="text"
                                        placeholder="pallet..."
                                        onChange={formikCierre.handleChange}
                                        onBlur={formikCierre.handleBlur}
                                        value={formikCierre.values.pallet}
                                    />
                                </div>
    
                                { formikCierre.touched.pallet && formikCierre.errors.pallet ? (
                                    <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4" >
                                        <p className="font-bold">Error</p>
                                        <p>{formikCierre.errors.pallet}</p>
                                    </div>
                                ) : null  }

                                <div className="mb-4">
                                    <label className="block text-gray-700 font-bold mb-2" htmlFor="auxiliar">
                                        Auxiliar/es
                                    </label>
    
                                    <input
                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                        id="auxiliar"
                                        type="text"
                                        placeholder="auxiliar..."
                                        onChange={formikCierre.handleChange}
                                        onBlur={formikCierre.handleBlur}
                                        value={formikCierre.values.auxiliar}
                                    />
                                </div>
    
                                { formikCierre.touched.auxiliar && formikCierre.errors.auxiliar ? (
                                    <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4" >
                                        <p className="font-bold">Error</p>
                                        <p>{formikCierre.errors.auxiliar}</p>
                                    </div>
                                ) : null  }

                                <div className="mb-4">
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
                                    className="bg-green-800 w-full mt-5 p-2 text-white uppercase font-bold hover:bg-green-900"
                                    value="Finalizar Producción"
                                />
                                <button className="bg-gray-800 w-full mt-5 p-2 text-white uppercase font-bold hover:bg-gray-900" onClick={() => handleCierre()}>Volver</button>
                            </form>                            
                        </div>
                    </div> 
                )}
            </div>
        </Layout>
    );
}

export default NuevoRegistroGP;
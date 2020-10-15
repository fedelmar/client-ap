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

const LOTES_ESPONJAS = gql `
    query	obtenerStockEsponjas{
        obtenerStockEsponjas{
            lote
            loteID
            producto
            estado
            caja
            cantCaja
            cantidad
        }
    }
`;

const LISTA_REGISTROS = gql `
    query obtenerRegistrosGE{
        obtenerRegistrosGE{
                id
                creado
                operario
                lote
                caja
                descCajas
                guardado
                descarte
                auxiliar
                observaciones
                producto
                estado
            }
        }
`;

const LOTE = gql `
    query obtenerProductoStock($id: ID!){
        obtenerProductoStock(id: $id){
            id
            lote
            producto
            estado
            cantidad
        }
    }
`;

const NUEVO_REGISTRO = gql `
    mutation nuevoRegistroGE($id: ID, $input: CGEInput){
        nuevoRegistroGE(id: $id, input: $input){
            id
            creado
            operario
            lote
            producto
            loteID
            caja
            descCajas
            guardado
            descarte
            auxiliar
            observaciones
            estado
        }
    }
`;

const NuevoRegistroGE = () => {

    const router = useRouter();
    const usuarioContext = useContext(UsuarioContext);
    const { nombre } = usuarioContext.usuario;
    const { data, loading } = useQuery(LOTES_ESPONJAS, {
        pollInterval: 500,
    });
    const [ nuevoRegistroGE ] = useMutation(NUEVO_REGISTRO, {
        update(cache, {data: { nuevoRegistroGE }}) {
            const { obtenerRegistrosGE } = cache.readQuery({ query: LISTA_REGISTROS });

            cache.writeQuery({
                query: LISTA_REGISTROS,
                data: {
                    obtenerRegistrosGE: [...obtenerRegistrosGE, nuevoRegistroGE ]
                }
            })
        }
    });
    const [mensaje, guardarMensaje] = useState(null);
    const [session, setSession] = useState(false);
    const [registro, setRegistro] = useState({
        lote: '',
        creado: '',
        id: '',
        operario: nombre,
        cantidad: ''
    });  
    const formikCierre = useFormik({
        initialValues: {
            cantGuardada: '',
            cantDescarte: 0,
            descCajas: 0,
            auxiliar: '',
            observaciones: ''
        },
        validationSchema: Yup.object({
            cantGuardada: Yup.number()
                                .max(registro.cantidad, `Debe ser menor o igual a ${registro.cantidad}`)
                                .required('Ingrese la cantidad producida'),
            cantDescarte: Yup.number()
                                .max(Yup.ref('cantGuardada'), `Debe ser menor a las esponjas guardadas`)
                                .required('Ingrese el descarte generado'),
            descCajas: Yup.number(),
            auxiliar: Yup.string(),
            observaciones: Yup.string()               
        }),
        onSubmit: valores => {       
            terminarProduccion(valores);            
        }
    });
    useEffect(() => {
        if (data) {
            data.obtenerStockEsponjas.map(i => 
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
    const {obtenerStockEsponjas} = data;

    const terminarProduccion = async valores => {
        // Finaliza la produccion, se guarda registro en la DB y se modifican los datos de productos

        //Volver a planillas de produccion y modificar base de datos
        const {cantDescarte, cantGuardada, descCajas, observaciones, auxiliar} = valores;

        Swal.fire({
            title: 'Verifique los datos antes de confirmar',
            html:   "Lote: " + registro.lote + "</br>" + 
                    "Producto: " + registro.producto + "</br>" +
                    "Operario: " + registro.operario + "</br>" +
                    "Esponjas guardadas: " + cantGuardada + "</br>" +
                    "Cantidad de descarte: " + cantDescarte + "</br>" +
                    "Cajas descartadas: " + descCajas + "</br>" +
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
                    const { data } = await nuevoRegistroGE({
                        variables: {
                            id: registro.id,
                            input: {
                                lote: registro.lote,
                                guardado: cantGuardada,
                                descarte: cantDescarte,
                                descCajas: 0,
                                auxiliar: auxiliar,
                                observaciones: observaciones
                            }
                        }                
                    });
                    Swal.fire(
                        'Se guardo el registro y se creo un nuevo lote en stock de productos',
                        data.nuevoRegistroGE,
                        'success'
                    )
                    router.push('/registros/guardadoesponjas');
                } catch (error) {
                    console.log(error)
                    guardarMensaje(error.message.replace('GraphQL error: ', ''));
                }
            }
          })
    }

    const handleInicio = async () => {    
      
        try {
            const { data } = await nuevoRegistroGE({
                variables: {
                    input: {
                        operario: registro.operario,
                        lote: registro.lote,
                        loteID: registro.loteID,
                        producto: registro.producto,
                        caja: registro.caja
                    }
                }                
            });
            
            setRegistro({...registro, creado: data.nuevoRegistroGE.creado, id: data.nuevoRegistroGE.id})
            setSession(true);
        } catch (error) {
            console.log(error)
        }
    }

    const handleCierre = () => {
        // Volver a iniciar por si hubo algun error
        setRegistro({...registro})
        setSession(false);        
    }

    const seleccionarLEsponja = opcion => {
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
            <h1 className="text-2xl text-gray-800 font-light">Nuevo Registro</h1>

            {mensaje && mostrarMensaje()}

            <div>
               { !session ? (
                    <div className="flex justify-center mt-5">
                        <div className="w-full max-w-lg">
                            <div className="bg-white shadow-md px-8 pt-6 pb-8 mb-4">
                                <p className="block text-gray-700 font-bold mb-2">Lote de Esponja</p>
                                <Select
                                    className="mt-3 mb-4"
                                    options={obtenerStockEsponjas}
                                    onChange={opcion => seleccionarLEsponja(opcion)}
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
            
                ) : (
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
                                <div className="flex">
                                    <p className="text-gray-700 text-mm font-bold mr-1">Caja: </p>
                                    <p className="text-gray-700 font-light">{registro.caja}</p>
                                </div>
                                <div className="flex">
                                    <p className="text-gray-700 text-mm font-bold mr-1">Cantidad por caja: </p>
                                    <p className="text-gray-700 font-light">{registro.cantCaja}</p>
                                </div>
                            </div>
                            <div className="flex justify-center mt-1 ">
                                    <p className="text-gray-700 text-xl font-bold mr-1">Esponjas disponibles: </p>
                                    <p className="text-gray-700 text-xl font-light px-2">{registro.cantidad}</p>
                            </div>
                            <form
                                className="bg-white shadow-md px-8 pt-6 pb-8 mb-4"
                                onSubmit={formikCierre.handleSubmit}
                            >

                                <div className="mb-4 mt-1">
                                    <label className="block text-gray-700 font-bold mb-2" htmlFor="cantGuardada">
                                        Esponjas guardadas
                                    </label>
    
                                    <input
                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                        id="cantGuardada"
                                        type="number"
                                        placeholder="Ingrese la cantidad producida..."
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
                                    <label className="block text-gray-700 font-bold mb-2" htmlFor="descCajas">
                                        Cajas descartadas
                                    </label>
    
                                    <input
                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                        id="descCajas"
                                        type="number"
                                        placeholder="Ingrese la cantidad de descarte..."
                                        onChange={formikCierre.handleChange}
                                        onBlur={formikCierre.handleBlur}
                                        value={formikCierre.values.descCajas}
                                    />
                                </div>

                                { formikCierre.touched.descCajas && formikCierre.errors.descCajas ? (
                                    <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4" >
                                        <p className="font-bold">Error</p>
                                        <p>{formikCierre.errors.descCajas}</p>
                                    </div>
                                ) : null  }

                                <div className="mb-4">
                                    <label className="block text-gray-700 font-bold mb-2" htmlFor="observaciones">
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

export default NuevoRegistroGE
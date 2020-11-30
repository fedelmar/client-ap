import React, {useState, useContext, useEffect} from 'react';
import Select from 'react-select';
import { useRouter } from 'next/router';
import { gql, useQuery, useMutation } from '@apollo/client';
import { format } from 'date-fns';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import Swal from 'sweetalert2';
import Layout from '../../../components/Layout';
import UsuarioContext from '../../../context/usuarios/UsuarioContext';

const LISTA_STOCK_CATEGORIA = gql `
    query obtneterStockInsumosPorCategoria($input: String!){
        obtneterStockInsumosPorCategoria(input: $input) {
            id
            insumo
            insumoID
            cantidad
            lote
        }
    }
`;

const NUEVO_REGISTRO = gql `
    mutation nuevoRegistroPP($id: ID, $input: CPPInput){
        nuevoRegistroPP(id: $id, input: $input){
            id
            creado
            modificado
            operario
            lote
            producto
            lTapon
            lPcm
            lPlaca
            cantProducida
            cantDescarte
            observaciones
            estado
        }
    }
`;

const NuevoRegistro = () => {

    const router = useRouter();
    const { data: dataPlacas, loading: loadingPlacas } = useQuery(LISTA_STOCK_CATEGORIA, {
        variables: {
            input: "Placas"
        }
    });
    const { data: dataQuimico, loading: loadingQuimico } = useQuery(LISTA_STOCK_CATEGORIA, {
        variables: {
            input: "Quimico"
        }
    });
    const { data: data, loading: loading } = useQuery(LISTA_STOCK_CATEGORIA, {
        variables: {
            input: "Polietileno"
        }
    });
    const [ nuevoRegistroPP ] = useMutation(NUEVO_REGISTRO);
    const usuarioContext = useContext(UsuarioContext);
    const { productos } = usuarioContext;
    const { nombre } = usuarioContext.usuario;
    const [session, setSession] = useState(false);
    const [sesionActiva, setSesionActiva] = useState();
    const [registro, setRegistro] = useState({
        placaDisp: 0,
        taponDisp: 0
    });
    // Formato del formulario de inicio se sesion
    const formikInicio = useFormik({
        initialValues: {
            lote: ''
        },
        validationSchema: Yup.object({
            lote: Yup.string().required('Ingrese el Lote')                      
        }),
        onSubmit: valores => {     
            handleInicio(valores);            
        }
    });
    // Formato del formulario de cierre de sesion
    let menor;
    registro.taponDisp <= registro.placaDisp ? menor = registro.taponDisp : menor = registro.placaDisp;
    const formikCierre = useFormik({
        initialValues: {
            cantProducida: 0,
            cantDescarte: 0,
            observaciones: ''
        },
        validationSchema: Yup.object({
            cantProducida: Yup.number()
                            .max(menor, `Debe ser menor o igual a ${menor}`)
                            .required('Ingrese la cantidad Producida'),
            cantDescarte: Yup.number()
                            .max(Yup.ref('cantProducida'), `Debe ser menor a la cantidad producida`)
                            .required('Ingrese el descarte generado'),
            observaciones: Yup.string()               
        }),
        onSubmit: valores => {       
            terminarProduccion(valores);            
        }
    });
    useEffect (() => {
        if (nombre) {
            setRegistro({...registro, operario: nombre})
        }
    },[nombre]);

    if(loadingQuimico || loadingPlacas || loading) return (
        <Layout>
          <p className="text-2xl text-gray-800 font-light" >Cargando...</p>
        </Layout>
    );

    // Definir lotes segun el stock de insumos
    const listaPlacas = dataPlacas.obtneterStockInsumosPorCategoria;
    const listaTapon = data.obtneterStockInsumosPorCategoria;
    const listaQuimico = dataQuimico.obtneterStockInsumosPorCategoria;

    const handleInicio =  async valores => {
        const { lote } = valores;
        try {
            const { data } = await nuevoRegistroPP({
                variables: {
                    input: {
                        operario: nombre,
                        lote: lote,
                        producto: registro.producto,
                        lPlaca: registro.lPlaca,
                        lTapon: registro.lTapon,
                        lPcm: registro.lPcm
                    }
                }                
            });
            setSesionActiva(data.nuevoRegistroPP)
            setRegistro({...registro, 
                lote: lote, 
            })
            setSession(true);
        } catch (error) {
            console.log(error)
        }

    };
    const terminarProduccion = valores => {
        const {observaciones, cantDescarte, cantProducida} = valores;

        Swal.fire({
            title: 'Verifique los datos antes de confirmar',
            html:   "Lote: " + registro.lote + "</br>" + 
                    "Producto: " + registro.producto + "</br>" +
                    "Operario: " + nombre + "</br>" +
                    "Lote de Placa: " + registro.lPlaca + "</br>" +
                    "Lote de Tapón: " + registro.lTapon + "</br>" +
                    "Lote de Pcm: " + registro.lPcm + "</br>" +
                    "Cantidad producida: " + cantProducida + "</br>" +
                    "Cantidad de descarte: " + cantDescarte + "</br>" +
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
                    const { data } = await nuevoRegistroPP({
                        variables: {
                            id: sesionActiva.id,
                            input: {
                                operario: nombre,
                                lote: registro.lote,
                                producto: registro.producto,
                                productoID: registro.productoID,
                                lTaponID: registro.lTaponID,
                                lPlacaID: registro.lPlacaID,
                                lPcmID: registro.lPcmID,
                                cantProducida: cantProducida,
                                cantDescarte: cantDescarte,
                                observaciones: observaciones
                            }   
                        }                
                    });
                    Swal.fire(
                        'Se guardo el registro y se actualizo el stock de productos',
                        data.nuevoRegistroPP,
                        'success'
                    )
                    router.push('/registros/produccionplacas');
                } catch (error) {
                    console.log(error)
                }
            }
          })        
    };
    const handleCierre = () => {
        // Volver a iniciar por si hubo algun error
        setRegistro({...registro})
        setSession(false);        
    }

    // Manejo de los campos select del formulario (On Change)
    const seleccionarProducto = producto => {
        setRegistro({...registro, producto: producto.nombre, productoID: producto.id})
    };
    const seleccionarLPlacas = lote => {
        setRegistro({...registro, 
            lPlaca: lote.lote, 
            lPlacaID: lote.id, 
            placaDisp: lote.cantidad
        })
    };
    const seleccionarLTapon = lote => {
        setRegistro({...registro, 
            lTapon: lote.lote, 
            lTaponID: lote.id, 
            taponDisp: lote.cantidad
        })
    };
    const seleccionarlPcm = lote => {
        setRegistro({...registro, 
            lPcm: lote.lote, 
            lPcmID: lote.id
        })
    };

    return (
        <Layout>
            <h1 className=' text-2xl text-gray-800 font-light '>Iniciar Producción</h1>

            <div>
               {!session ? (
                    <div className="flex justify-center mt-5">
                        <div className="w-full max-w-lg">
                            <form
                                className="bg-white shadow-md px-8 pt-6 pb-8 mb-4"
                                onSubmit={formikInicio.handleSubmit}
                            >
                                <div className="mb-4">
                                    <label className="block text-gray-700 font-bold mb-2" htmlFor="lote">
                                        Lote
                                    </label>
    
                                    <input
                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                        id="lote"
                                        type="text"
                                        placeholder="Ingrese el lote..."
                                        onChange={formikInicio.handleChange}
                                        onBlur={formikInicio.handleBlur}
                                        value={formikInicio.values.lote}
                                    />
                                </div>
    
                                { formikInicio.touched.lote && formikInicio.errors.lote ? (
                                    <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4" >
                                        <p className="font-bold">Error</p>
                                        <p>{formikInicio.errors.lote}</p>
                                    </div>
                                ) : null  }

                                <p className="block text-gray-700 font-bold mb-2">Seleccione el producto</p>
                                <Select
                                    className="mt-3 mb-4"
                                    options={productos}
                                    onChange={opcion => seleccionarProducto(opcion) }
                                    getOptionValue={ opciones => opciones.id }
                                    getOptionLabel={ opciones => opciones.nombre}
                                    placeholder="Producto..."
                                    noOptionsMessage={() => "No hay resultados"}
                                    onBlur={formikInicio.handleBlur}
                                    isMulti={false}
                                />

                                <p className="block text-gray-700 font-bold mb-2">Lote de Placas</p>
                                <Select
                                    className="mt-3 mb-4"
                                    options={listaPlacas}
                                    onChange={opcion => seleccionarLPlacas(opcion) }
                                    getOptionValue={ opciones => opciones.id }
                                    getOptionLabel={ opciones => `${opciones.lote} ${opciones.insumo} Disp: ${opciones.cantidad}`}
                                    placeholder="Lote..."
                                    noOptionsMessage={() => "No hay resultados"}
                                    onBlur={formikInicio.handleBlur}
                                    isMulti={false}
                                />

                                <p className="block text-gray-700 font-bold mb-2">Lote de Tapón</p>
                                <Select
                                    className="mt-3 mb-4"
                                    options={listaTapon}
                                    onChange={opcion => seleccionarLTapon(opcion) }
                                    getOptionValue={ opciones => opciones.id }
                                    getOptionLabel={ opciones => `${opciones.lote} ${opciones.insumo} Disp: ${opciones.cantidad}`}
                                    placeholder="Lote..."
                                    noOptionsMessage={() => "No hay resultados"}
                                    onBlur={formikInicio.handleBlur}
                                    isMulti={false}
                                />

                                <p className="block text-gray-700 font-bold mb-2">Lote de PCM</p>
                                <Select
                                    className="mt-3 mb-4"
                                    options={listaQuimico}
                                    onChange={opcion => seleccionarlPcm(opcion) }
                                    getOptionValue={ opciones => opciones.id }
                                    getOptionLabel={ opciones => `${opciones.lote} ${opciones.insumo} Disp: ${opciones.cantidad}`}
                                    placeholder="Lote..."
                                    noOptionsMessage={() => "No hay resultados"}
                                    onBlur={formikInicio.handleBlur}
                                    isMulti={false}
                                />
    
                                <input
                                    type="submit"
                                    className="bg-gray-800 w-full mt-5 p-2 text-white uppercase font-bold hover:bg-gray-900"
                                    value="Iniciar Producción"
                                />
                            </form>
                        </div>
                    </div>
            
                ) : (
                    <div className="flex justify-center mt-5">
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
                                    <p className="text-gray-700 text-mm font-bold mr-1">Lote de PCM: </p>
                                    <p className="text-gray-700 font-light">{registro.lPcm}</p>
                                </div>
                                <div className="flex justify-between">
                                    <div className="flex">
                                        <p className="text-gray-700 text-mm font-bold mr-1">Lote de Placa: </p>
                                        <p className="text-gray-700 font-light ">{registro.lPlaca}</p>
                                    </div>
                                    <div className="flex">
                                        <p className="text-gray-700 text-mm font-bold mr-1">Disponibles: </p>
                                        <p className="text-gray-700 font-light">{registro.placaDisp}</p>
                                    </div>
                                </div>
                                <div className="flex justify-between pb-2">
                                    <div className="flex">
                                        <p className="text-gray-700 text-mm font-bold mr-1">Lote de Tapón: </p>
                                        <p className="text-gray-700 font-light ">{registro.lTapon}</p>
                                    </div>
                                    <div className="flex">
                                        <p className="text-gray-700 text-mm font-bold mr-1">Disponibles: </p>
                                        <p className="text-gray-700 font-light">{registro.taponDisp}</p>
                                    </div>
                                </div>
                            </div>

                            <form
                                className="bg-white shadow-md px-8 pt-2 pb-8 mb-2"
                                onSubmit={formikCierre.handleSubmit}
                            >
                                <div className="mb-4">
                                    <label className="block text-gray-700 font-bold mb-2" htmlFor="cantProducida">
                                        Cantidad Producida
                                    </label>

                                    <input
                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                        id="cantProducida"
                                        type="number"
                                        placeholder="Ingrese la cantidad de cantProducida..."
                                        onChange={formikCierre.handleChange}
                                        onBlur={formikCierre.handleBlur}
                                        value={formikCierre.values.cantProducida}
                                    />
                                </div>

                                { formikCierre.touched.cantProducida && formikCierre.errors.cantProducida ? (
                                    <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4" >
                                        <p className="font-bold">Error</p>
                                        <p>{formikCierre.errors.cantProducida}</p>
                                    </div>
                                ) : null  }
                                
                                <div className="mb-4">
                                    <label className="block text-gray-700 font-bold mb-2" htmlFor="cantDescarte">
                                        Descarte
                                    </label>

                                    <input
                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
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
                                    value="Finalizar Producción"
                                />
                                <button className="bg-gray-800 w-full mt-2 p-2 text-white uppercase font-bold hover:bg-gray-900" onClick={() => handleCierre()}>Volver</button>
                            </form>
                        </div>
                    </div> 
                )}
            </div>   
        </Layout>
    );
}

export default NuevoRegistro;

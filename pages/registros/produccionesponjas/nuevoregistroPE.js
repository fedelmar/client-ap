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
import ManejoDeStock from '../../../components/registros/produccionesponjas/ManejoDeStock';

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

const NUEVO_REGISTRO = gql`
    mutation nuevoRegistroCE($id: ID, $input: CPEInput){
        nuevoRegistroCE(id: $id, input: $input){
            id
            creado
            modificado
            operario
            lote
            producto
            lBolsa
            lEsponja
            cantProducida
            cantDescarte
            observaciones
            estado
        }
    }
`;

const ACTUALIZAR_REGISTRO = gql`
    mutation actualizarRegistroCE($id: ID!, $input: CPEInput){
            actualizarRegistroCE(id: $id, input: $input){
            cantProducida            
        }
    }
`;

const IniciarProduccion = () => {

    const router = useRouter();
    const { data: dataEsponjas, loading: loadingEsponjas } = useQuery(LISTA_STOCK_CATEGORIA, {
        variables: {
            input: "Esponjas"
        }
    });
    const { data: dataBolsas, loading: loadingBolsas } = useQuery(LISTA_STOCK_CATEGORIA, {
        variables: {
            input: "Polietileno"
        }
    })
    const [ actualizarRegistroCE ] = useMutation(ACTUALIZAR_REGISTRO);
    const [ nuevoRegistroCE ] = useMutation(NUEVO_REGISTRO);
    const usuarioContext = useContext(UsuarioContext);
    const { productos } = usuarioContext;
    const { nombre } = usuarioContext.usuario;
    const [mensaje, guardarMensaje] = useState(null);
    const [session, setSession] = useState(false);
    const [sesionActiva, setSesionActiva] = useState();
    const [registro, setRegistro] = useState({
        operario: nombre,
        lote: '',
        producto: '',
        productoID: '',
        lBolsa: '',
        lBolsaID: '',
        bolsaDisp: 0,
        lEsponja: '',
        lEsponjaID: '',
        esponjaDisp: 0,
        cantProducida: 0,
        cantDescarte: 0
    });
    // Formato del formulario de inicio se sesion
    const formikInicio = useFormik({
        initialValues: {
            lote: '',
            producto: '',
            lBolsa: '',
            lEsponja: ''
        },
        validationSchema: Yup.object({
            lote: Yup.string().required('Ingrese un numero'),
            producto: Yup.string(),
            lBolsa: Yup.string(),
            lEsponja: Yup.string()                        
        }),
        onSubmit: valores => {        
            handleInicio(valores);            
        }
    })
    // Formato del formulario de cierre de sesion
    const formikCierre = useFormik({
        initialValues: {
            cantDescarte: 0,
            observaciones: ''
        },
        validationSchema: Yup.object({
            cantDescarte: Yup.number()
                            .max(registro.cantProducida, `Debe ser menor a la cantidad producida`)
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
    },[nombre])

    if(loadingEsponjas || loadingBolsas) return (
        <Layout>
          <p className="text-2xl text-gray-800 font-light" >Cargando...</p>
        </Layout>
    );

    const handleInicio = async valores => {
        const { lote } = valores;
        const date = Date.now();
        try {
            const { data } = await nuevoRegistroCE({
                variables: {
                    input: {
                        operario: nombre,
                        lote: `L${lote}-${format(new Date(date), 'ddMMyy')}`,
                        producto: registro.producto,
                        lBolsa: registro.lBolsa,
                        lEsponja: registro.lEsponja,
                        cantProducida: 0
                    }
                }                
            });
            setSesionActiva(data.nuevoRegistroCE);
            setRegistro({...registro, lote: `L${lote}-${format(new Date(data.nuevoRegistroCE.creado), 'ddMMyy')}`});   
        } catch (error) {
            guardarMensaje(error.message.replace('GraphQL error: ', ''));
        }
        setSession(true);
    }

    const handleCierre = () => {
        // Volver a iniciar por si hubo algun error
        setRegistro({...registro})
        setSession(false);        
    }

    const terminarProduccion = async valores => {
        // Finaliza la produccion, se guarda registro en la DB y se modifican los datos de productos e insumos

        //Volver a planillas de produccion y modificar base de datos
        const {observaciones, cantDescarte} = valores;
    
        setRegistro({...registro, cantDescarte, observaciones})

        Swal.fire({
            title: 'Verifique los datos antes de confirmar',
            html:   "Lote: " + registro.lote + "</br>" + 
                    "Producto: " + registro.producto + "</br>" +
                    "Operario: " + nombre + "</br>" +
                    "Lote de Esponja: " + registro.lEsponja + "</br>" +
                    "Lote de Bolsa: " + registro.lBolsa + "</br>" +
                    "Cantidad producida: " + registro.cantProducida + "</br>" +
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
                    const { data } = await nuevoRegistroCE({
                        variables: {
                            id: sesionActiva.id,
                            input: {
                                operario: nombre,
                                lote: registro.lote,
                                producto: registro.producto,
                                cantProducida: registro.cantProducida,
                                cantDescarte: cantDescarte,
                                observaciones: observaciones
                            }
                        }                
                    });
                    Swal.fire(
                        'Se guardo el registro y se actualizo el stock de productos',
                        data.nuevoRegistroCE,
                        'success'
                    )
                    router.push('/registros/produccionesponjas');
                } catch (error) {
                    guardarMensaje(error.message.replace('GraphQL error: ', ''));
                }
            }
          })        
    }

    // Manejo de los campos select del formulario (On Change)
    const seleccionarProducto = producto => {
        setRegistro({...registro, producto: producto.nombre, productoID: producto.id})
    }
    const seleccionarLEsponja = lote => {
        setRegistro({...registro, 
            lEsponja: lote.lote, 
            lEsponjaID: lote.id, 
            esponjaDisp: lote.cantidad
        })
    }
    const seleccionarLBolsa = lote => {
        setRegistro({...registro, 
            lBolsa: lote.lote, 
            lBolsaID: lote.id, 
            bolsaDisp: lote.cantidad
        })
    }

    // Mostrar mensaje de base de datos si hubo un error
    const mostrarMensaje = () => {
        return(
            <div className="bg-white py-2 px-3 w-full my-3 max-w-sm text-center mx-auto">
                <p>No existe el lote en el Stock</p>
            </div>
        )
    }

    // Definir lotes de esponjas y bolsas, segun el stock de insumos y la info en context de insumos
    const listaEsponjas = dataEsponjas.obtneterStockInsumosPorCategoria;
    const listaBolsas = dataBolsas.obtneterStockInsumosPorCategoria;

    // Funcion para exportar en complemento ManejoDeStock
    const cantidades = async valores => {
        const {esponjas} = valores;
        setRegistro({...registro, 
            cantProducida: registro.cantProducida + esponjas, 
            esponjaDisp: registro.esponjaDisp - esponjas, 
            bolsaDisp: registro.bolsaDisp - esponjas
        });
        try {
            const { data } = await actualizarRegistroCE({
                variables: {
                    id: sesionActiva.id,
                    input: {
                        cantProducida: registro.cantProducida + esponjas
                    }
                }
            });
            let timerInterval
            Swal.fire({
                html: `Se sumaron ${esponjas} esponjas`,
                timer: 1000,
                position: 'top',
                showConfirmButton: false,
                width: 300,
                padding: 10,
                willOpen: () => {
                    Swal.showLoading()
                    timerInterval = setInterval(() => {
                        const content = Swal.getContent()
                            if (content) {
                                const b = content.querySelector('b')
                                if (b) {
                                b.textContent = Swal.getTimerLeft()
                                }
                            }
                        }, 100)
                    },
            });
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <Layout>
            <h1 className=' text-2xl text-gray-800 font-light '>Iniciar Producción</h1>

            {mensaje && mostrarMensaje()}

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
                                        type="number"
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

                                <p className="block text-gray-700 font-bold mb-2">Lote de Esponja</p>
                                <Select
                                    className="mt-3 mb-4"
                                    options={listaEsponjas}
                                    onChange={opcion => seleccionarLEsponja(opcion) }
                                    getOptionValue={ opciones => opciones.id }
                                    getOptionLabel={ opciones => `${opciones.lote} ${opciones.insumo} Disp: ${opciones.cantidad}`}
                                    placeholder="Lote..."
                                    noOptionsMessage={() => "No hay resultados"}
                                    onBlur={formikInicio.handleBlur}
                                    isMulti={false}
                                />

                                <p className="block text-gray-700 font-bold mb-2">Lote de Bolsa</p>
                                <Select
                                    className="mt-3 mb-4"
                                    options={listaBolsas}
                                    onChange={opcion => seleccionarLBolsa(opcion) }
                                    getOptionValue={ opciones => opciones.id }
                                    getOptionLabel={ opciones => `${opciones.lote} ${opciones.insumo} Disp: ${opciones.cantidad}`}
                                    placeholder="Lote..."
                                    noOptionsMessage={() => "No hay resultados"}
                                    onBlur={formikInicio.handleBlur}
                                    isMulti={false}
                                />                          

    
                                { formikInicio.touched.lBolsa && formikInicio.errors.lBolsa ? (
                                    <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4" >
                                        <p className="font-bold">Error</p>
                                        <p>{formikInicio.errors.lBolsa}</p>
                                    </div>
                                ) : null  }
    
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
                                <div className="flex justify-between">
                                    <div className="flex">
                                        <p className="text-gray-700 text-mm font-bold mr-1">Lote de Esponja: </p>
                                        <p className="text-gray-700 font-light ">{registro.lEsponja}</p>
                                    </div>
                                    <div className="flex">
                                        <p className="text-gray-700 text-mm font-bold mr-1">Disponibles: </p>
                                        <p className="text-gray-700 font-light">{registro.esponjaDisp}</p>
                                    </div>
                                </div>
                                <div className="flex justify-between pb-2">
                                    <div className="flex">
                                        <p className="text-gray-700 text-mm font-bold mr-1">Lote de Bolsa: </p>
                                        <p className="text-gray-700 font-light ">{registro.lBolsa}</p>
                                    </div>
                                    <div className="flex">
                                        <p className="text-gray-700 text-mm font-bold mr-1">Disponibles: </p>
                                        <p className="text-gray-700 font-light">{registro.bolsaDisp}</p>
                                    </div>
                                </div>
                              
                                <div className="flex py-2">
                                    <p className="text-gray-700 text-lg font-bold mr-1">Cantidad Producida: </p>
                                    <p className="text-gray-700 text-lg font-light ">{registro.cantProducida}</p>
                                </div>
                            </div>

                            <ManejoDeStock registro={registro} cantidades={cantidades}/>

                            <form
                                className="bg-white shadow-md px-8 pt-2 pb-8 mb-2"
                                onSubmit={formikCierre.handleSubmit}
                            >
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
export default IniciarProduccion;

import React, {useState, useContext} from 'react';
import Layout from '../../components/Layout';
import { format } from 'date-fns'
import UsuarioContext from '../../context/usuarios/UsuarioContext';
import { useFormik } from 'formik'
import * as Yup from 'yup'
import Select from 'react-select';
import { useRouter } from 'next/router';
import { gql, useQuery, useMutation } from '@apollo/client';
import Swal from 'sweetalert2';

const LISTA_STOCK = gql `
    query obtenerStockInsumos{
        obtenerStockInsumos{
            id
            insumo
            lote
            cantidad
        }
    }
`;

const NUEVO_REGISTRO = gql`
    mutation nuevoRegistroCE($input: CPEInput){
        nuevoRegistroCE(input: $input){
        id
        fecha
        operario
        lote
        horaInicio
        horaCierre
        producto
        lBolsa
        lEsponja
        cantProducida
        cantDescarte
        observaciones
        }
    }
`;

const LISTA_REGISTROS = gql `
    query obtenerRegistrosCE {
        obtenerRegistrosCE{
            id
            fecha
            operario
            lote
            horaInicio
            horaCierre
            producto
            lBolsa
            lEsponja
            cantProducida
            cantDescarte
            observaciones
        }
    }
`;

const IniciarProduccion = () => {

    const router = useRouter();
    const { data, loading } = useQuery(LISTA_STOCK);
    const [ nuevoRegistroCE ] = useMutation(NUEVO_REGISTRO, {
        update(cache, {data: { nuevoRegistroCE }}) {
            const { obtenerRegistrosCE } = cache.readQuery({ query: LISTA_REGISTROS });

            cache.writeQuery({
                query: LISTA_REGISTROS,
                data: {
                    obtenerRegistrosCE: [...obtenerRegistrosCE, nuevoRegistroCE ]
                }
            })
        }
    });

    const pedidoContext = useContext(UsuarioContext);
    const { productos, insumos } = pedidoContext;
    const { nombre } = pedidoContext.usuario;
 
    const [registro, setRegistro] = useState({
        dia: '',
        fecha: '',
        operario: nombre,
        lote: '',
        horaInicio: '',
        producto: '',
        lBolsa: '',
        lEsponja: ''
    });
    const [session, setSession] = useState(false);

    const formikInicio = useFormik({
        initialValues: {
            lote: '',
            producto: '',
            lBolsa: '',
            lEsponja: ''
        },
        validationSchema: Yup.object({
            lote: Yup.string().required('Campo obligatorio'),
            producto: Yup.string(),
            lBolsa: Yup.string().required('Campo obligatorio'),
            lEsponja: Yup.string().required('Campo obligatorio'),                        
        }),
        onSubmit: valores => {           
            handleInicio(valores);
            
        }
    })

    const formikCierre = useFormik({
        initialValues: {
            cantProducida: '',
            cantDescarte: '0',
            observaciones: ''
        },
        validationSchema: Yup.object({
            cantProducida: Yup.number().required('Ingrese la cantidad producida'),
            cantDescarte: Yup.number().required('Ingrese el descarte generado'),
            observaciones: Yup.string()               
        }),
        onSubmit: valores => {       
            terminarProduccion(valores);            
        }
    })    

    //console.log(registro)

    if(loading) return (
        <Layout>
          <p className="text-2xl text-gray-800 font-light" >Cargando...</p>
        </Layout>
    );

    const {obtenerStockInsumos} = data;
    /*console.log('stock', obtenerStockInsumos)
    console.log("insumos", insumos)*/

    const handleInicio = valores => {
        // Inicia la prodccion, registrando fecha, hora, lote, producto, lBolsa, lEsponja
    
        const { lote, lBolsa, lEsponja} = valores

        const start = Date.now();

        const dia = format(new Date(start), 'dd/MM/yy')
        const hora = format(new Date(start), 'HH:mm')

        setRegistro({...registro, horaInicio: hora, fecha: start, dia, lote, lBolsa, lEsponja})
        setSession(true);
    }

    const handleCierre = () => {
        // Volver a iniciar por si hubo algun error
        setSession(false);        
    }


    const terminarProduccion = async valores => {
        // Finaliza la produccion, se guarda registro en la DB y se modifican los datos de productos e insumos

        // Se registran los ultimos datos
        const fin = Date.now();
        const hora = format(new Date(fin), 'HH:mm')
        console.log('hora cierre: ',hora)
        //Volver a planillas de produccion y modificar base de datos
        const {cantDescarte, cantProducida, observaciones} = valores;
        setRegistro({...registro, cantDescarte, cantProducida, observaciones, horaCierre: hora})
        
        const str = "Lote: " + registro.lote + "Producto: " + registro.producto + "\nLote de Esponja: " + registro.lEsponja;
        Swal.fire({
            title: 'Verifique los datos antes de confirmar',
            html:   "Lote: " + registro.lote + "</br>" + 
                    "Producto: " + registro.producto + "</br>" +
                    "Operario: " + registro.operario + "</br>" +
                    "Lote de Esponja: " + registro.lEsponja + "</br>" +
                    "Lote de Bolsa: " + registro.lBolsa + "</br>" +
                    "Dia: " + registro.dia + "</br>" +
                    "Hora de Inicio: " + registro.horaInicio + "</br>" +
                    "Hora de cierre: " + hora + "</br>" +
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
                    console.log("registro: ", registro)  
                    const { data } = await nuevoRegistroCE({
                        variables: {
                            input: {
                                fecha: registro.fecha,
                                operario: registro.operario,
                                lote: registro.lote,
                                horaInicio: registro.horaInicio,
                                horaCierre: hora,
                                producto: registro.producto,
                                lBolsa: registro.lBolsa,
                                lEsponja: registro.lEsponja,
                                cantProducida: cantProducida,
                                cantDescarte: cantDescarte,
                                observaciones: observaciones
                            }
                        }                
                    });
                    Swal.fire(
                        'Guardado!',
                        data.nuevoRegistroCE,
                        'success'
                    )
                    router.push('/registros/produccionesponjas');
                } catch (error) {
                    console.log(error)
                }
            }
          })        
    }

    const seleccionarProducto = producto => {
        setRegistro({...registro, producto: producto.nombre})
    }

    //console.log('session iniciada: ', session)

    return (
        <Layout>
            <h1 className=' text-2xl text-gray-800 font-light '>Iniciar Producción</h1>

            <div>
               { !session ? (
                    <div className="flex justify-center mt-5">
                        <div className="w-full max-w-lg">
                            <form
                                className="bg-white shadow-md px-8 pt-6 pb-8 mb-4"
                                onSubmit={formikInicio.handleSubmit}
                            >
                                <div className="mb-4">
                                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="lote">
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

                                <p className="block text-gray-700 text-sm font-bold mb-2">Seleccione el producto</p>
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

                                {/*<p className="block text-gray-700 text-sm font-bold mb-2">Seleccione el Lote de bolsa</p>
                                <Select
                                    className="mt-3 mb-4"
                                    options={insumos}
                                    onChange={opcion => seleccionarInsumo(opcion) }
                                    getOptionValue={ opciones => opciones.id }
                                    getOptionLabel={ opciones => opciones.nombre}
                                    placeholder="Insumo..."
                                    noOptionsMessage={() => "No hay resultados"}
                                    onBlur={formikInicio.handleBlur}
                                    isMulti={false}
                                />*/}

                                <div className="mb-4">
                                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="lEsponja">
                                        Lote de Esponja
                                    </label>
    
                                    <input
                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                        id="lEsponja"
                                        type="text"
                                        placeholder="Ingrese el Lote de Esponja..."
                                        onChange={formikInicio.handleChange}
                                        onBlur={formikInicio.handleBlur}
                                        value={formikInicio.values.lEsponja}
                                    />
                                </div>
    
                                { formikInicio.touched.lEsponja && formikInicio.errors.lEsponja ? (
                                    <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4" >
                                        <p className="font-bold">Error</p>
                                        <p>{formikInicio.errors.lEsponja}</p>
                                    </div>
                                ) : null  }

                                <div className="mb-4">
                                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="lEsponja">
                                        Lote de Bolsa
                                    </label>
    
                                    <input
                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                        id="lBolsa"
                                        type="text"
                                        placeholder="Ingrese el Lote de Bolsa..."
                                        onChange={formikInicio.handleChange}
                                        onBlur={formikInicio.handleBlur}
                                        value={formikInicio.values.lBolsa}
                                    />
                                </div>
    
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
                    <>  
                        <p className="text-gray-800 font-light">Dia: {registro.dia}   Hora de inicio: {registro.horaInicio}</p>
                        <p className="text-gray-800 font-light">Lote: {registro.lote}</p>                        
                        <p className="text-gray-800 font-light">Producto: {registro.producto}</p>                        
                        <p className="text-gray-800 font-light">Lote de Esponja: {registro.lEsponja}</p>
                        <p className="text-gray-800 font-light">Lote de Bolsa: {registro.lBolsa}</p>
                        
                        <div className="flex justify-center mt-5">
                            <div className="w-full max-w-lg">
                                <form
                                    className="bg-white shadow-md px-8 pt-6 pb-8 mb-4"
                                    onSubmit={formikCierre.handleSubmit}
                                >
                                    <div className="mb-4">
                                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="cantProducida">
                                            Cantidad producida
                                        </label>
        
                                        <input
                                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                            id="cantProducida"
                                            type="number"
                                            placeholder="Ingrese la cantidad producida..."
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
                                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="cantDescarte">
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
                                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="observaciones">
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
                    </>
                )}
            </div>            
        </Layout>
    );
}

export default IniciarProduccion

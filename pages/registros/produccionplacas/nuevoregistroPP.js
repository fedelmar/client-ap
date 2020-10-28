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
    const [registro, setRegistro] = useState();
    // Formato del formulario de inicio se sesion
    const formikInicio = useFormik({
        initialValues: {
            lote: '',
            lPcm: ''
        },
        validationSchema: Yup.object({
            lote: Yup.string().required('Ingrese un numero'),
            lPcm: Yup.string().required('Ingrese el lote de PCM')                         
        }),
        onSubmit: valores => {     
            handleInicio(valores);            
        }
    });
    useEffect (() => {
        if (nombre) {
            setRegistro({...registro, operario: nombre})
        }
    },[nombre]);

    if(loadingPlacas || loading) return (
        <Layout>
          <p className="text-2xl text-gray-800 font-light" >Cargando...</p>
        </Layout>
    );

    // Definir lotes segun el stock de insumos
    const listaPlacas = dataPlacas.obtneterStockInsumosPorCategoria;
    const listaTapon = data.obtneterStockInsumosPorCategoria;

    const handleInicio =  async valores => {
        const { lote, lPcm } = valores;
        const date = Date.now();
        try {
            const { data } = await nuevoRegistroPP({
                variables: {
                    input: {
                        operario: nombre,
                        lote: `L${lote}-${format(new Date(date), 'ddMMyy')}`,
                        producto: registro.producto,
                        lPlaca: registro.lPlaca,
                        lTapon: registro.lTapon,
                        lPcm: lPcm
                    }
                }                
            });
            console.log(data)
        } catch (error) {
            console.log(error)
        }
        setRegistro({...registro, 
                lote: `L${lote}-${format(new Date(date), 'ddMMyy')}`, 
                lPcm: lPcm
        })
    };

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

    console.log(registro)

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

                                <div className="mb-4">
                                    <label className="block text-gray-700 font-bold mb-2" htmlFor="lPcm">
                                        Lote de PCM
                                    </label>
    
                                    <input
                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                        id="lPcm"
                                        type="text"
                                        placeholder="Ingrese el lote de PCM..."
                                        onChange={formikInicio.handleChange}
                                        onBlur={formikInicio.handleBlur}
                                        value={formikInicio.values.lPcm}
                                    />
                                </div>
    
                                { formikInicio.touched.lPcm && formikInicio.errors.lPcm ? (
                                    <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4" >
                                        <p className="font-bold">Error</p>
                                        <p>{formikInicio.errors.lPcm}</p>
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
               
                        <h1>session</h1>
                    </div> 
                )}
            </div>   
        </Layout>
    );
}

export default NuevoRegistro;

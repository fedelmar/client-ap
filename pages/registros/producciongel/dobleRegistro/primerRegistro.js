import React, { useContext, useState } from 'react';
import Select from 'react-select';
import { useQuery, useMutation } from '@apollo/client';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import Layout from '../../../../components/Layout';
import UsuarioContext from '../../../../context/usuarios/UsuarioContext';
import SelectInsumo from '../../../../components/registros/SelectInsumos';
import { NUEVO_DOBLE_REGISTRO, ELIMINAR_REGISTRO } from '../../../../servicios/produccionDeGel';
import { PRODUCTOS } from '../../../../servicios/productos';
import FormLlenado from './FormLlenado';

const NuevoRegistroPG = () => {
    const usuarioContext = useContext(UsuarioContext);
    const { nombre: operario } = usuarioContext.usuario;
    const [ nuevoDobleRegistroCPG ] = useMutation(NUEVO_DOBLE_REGISTRO);
    const [ eliminarRegistroCPG ] = useMutation(ELIMINAR_REGISTRO);
    const { data, loading } = useQuery(PRODUCTOS, {
        variables: {
            input: "Geles"
        }
    });
    const [session, setSession] = useState(false);
    const [sesionActiva, setSesionActiva] = useState();
    const [registro, setRegistro] = useState({
        producto: '',
        productoID: '',
        loteBolsa: '',
        loteBolsaID: '',
        loteGel: '',
        manta: false,
        operario,
    });
    // Definicion de formulario de inicio de registro
    const formikInicio = useFormik({
        initialValues: {
            lote: '',
            cliente: '',
            loteGel: '',
            manta: false
        },
        validationSchema: Yup.object({
            lote: Yup.string().required('Ingrese el Lote'),
            cliente: Yup.string().required('Ingrese el Cliente'),
            loteGel: Yup.string().required('Ingrese el lote de gel')
        }),
        onSubmit: valores => {     
            iniciarRegistro(valores);        
        }
    });

    if(loading) return (
        <Layout>
          <p className="text-2xl text-gray-800 font-light" >Cargando...</p>
        </Layout>
    );
    const listaProductos = data.obtenerProductosPorCategoria;

    // Iniciar el registro cargando los primeros datos en la BD
    const iniciarRegistro = async valores => {
        const { lote, cliente, loteGel, manta } = valores
        try {
            const { data } = await nuevoDobleRegistroCPG({
                variables: {
                    input: {
                        lote,
                        cliente,
                        loteGel,
                        operario,
                        manta,
                        producto: registro.producto,
                        productoID: registro.productoID,
                        loteBolsa: registro.loteBolsa,
                        loteBolsaID: registro.loteBolsaID,
                        dobleBolsa: true,
                    }
                }
            })
            setSesionActiva(data.nuevoDobleRegistroCPG);
            setRegistro({...registro, 
                lote: lote,
                cliente, 
                loteGel,
                dobleBolsa: true,
                manta})
            setSession(true);
        } catch (error) {
            console.log(error)
        }
    };

    // Funcion para volver a iniciar en caso de algun Error
    const volver = async () => {
        setRegistro({...registro});
        setSession(false);
        await eliminarRegistroCPG({
            variables: {
                id: sesionActiva.id
            }
        });        
    };

    // Funciones de seleccion de Lote de bolsa y Producto
    const seleccionarProducto = lote => {
        setRegistro({...registro, producto: lote.nombre, productoID: lote.id})
    };
    const seleccionarInsumo = lote => {
        setRegistro({...registro, loteBolsa: lote.lote, loteBolsaID: lote.id, bolsasDisponibles: lote.cantidad })
    };

    return (
        <Layout>
            <h1 className='text-2xl text-gray-800 font-light'>Nuevo Registro de Producción de Gel (Doble bolsa)</h1>

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

                                <div className="mb-4">
                                    <label className="block text-gray-700 font-bold mb-2" htmlFor="cliente">
                                        Cliente
                                    </label>
    
                                    <input
                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                        id="cliente"
                                        type="text"
                                        placeholder="Ingrese el cliente..."
                                        onChange={formikInicio.handleChange}
                                        onBlur={formikInicio.handleBlur}
                                        value={formikInicio.values.cliente}
                                    />
                                </div>
    
                                { formikInicio.touched.cliente && formikInicio.errors.cliente ? (
                                    <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4" >
                                        <p className="font-bold">Error</p>
                                        <p>{formikInicio.errors.cliente}</p>
                                    </div>
                                ) : null  }

                                <p className="block text-gray-700 font-bold mb-2">Seleccione el producto</p>
                                <Select
                                    className="mt-3 mb-4"
                                    options={listaProductos}
                                    onChange={opcion => seleccionarProducto(opcion) }
                                    getOptionValue={ opciones => opciones.id }
                                    getOptionLabel={ opciones => opciones.nombre}
                                    placeholder="Producto..."
                                    noOptionsMessage={() => "No hay resultados"}
                                    onBlur={formikInicio.handleBlur}
                                    isMulti={false}
                                />

                                {registro.productoID ? 
                                    <>
                                        <p className="block text-gray-700 font-bold mb-2">Lote de Bolsa</p>
                                        <SelectInsumo productoID={registro.productoID } funcion={seleccionarInsumo} categoria={"Polietileno"} />
                                    </>
                                : null}

                                <div className="mb-4">
                                    <label className="block text-gray-700 font-bold mb-2" htmlFor="loteGel">
                                        Lote de Gel
                                    </label>
    
                                    <input
                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                        id="loteGel"
                                        type="text"
                                        placeholder="Ingrese el lote de gel..."
                                        onChange={formikInicio.handleChange}
                                        onBlur={formikInicio.handleBlur}
                                        value={formikInicio.values.loteGel}
                                    />
                                </div>
    
                                { formikInicio.touched.loteGel && formikInicio.errors.loteGel ? (
                                    <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4" >
                                        <p className="font-bold">Error</p>
                                        <p>{formikInicio.errors.loteGel}</p>
                                    </div>
                                ) : null  }

                                <div className="flex mb-3">
                                    <label className="block text-gray-700 font-bold " htmlFor="manta">
                                        Manta:
                                    </label>

                                    <input
                                        className="mt-1 ml-2 form-checkbox h-5 w-5 text-gray-600"
                                        id="manta"
                                        type="checkbox"
                                        onChange={formikInicio.handleChange}
                                        onBlur={formikInicio.handleBlur}
                                        value={formikInicio.values.manta}
                                    />
                                </div>  

                                <input
                                    type="submit"
                                    className="bg-gray-800 w-full mt-5 p-2 text-white uppercase font-bold hover:bg-gray-900"
                                    value="Iniciar Producción"
                                />

                            </form>
                        </div>
                    </div>
                ) : 
                    <FormLlenado registro={registro} sesionActiva={sesionActiva} volver={volver} />
                }
            </div>
        </Layout>
    );
}

export default NuevoRegistroPG;
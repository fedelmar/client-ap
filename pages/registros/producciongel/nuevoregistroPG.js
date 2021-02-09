import React, {useContext, useState} from 'react';
import Select from 'react-select';
import { format } from 'date-fns';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { gql, useQuery, useMutation } from '@apollo/client';
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
    mutation nuevoRegistroCPG($id: ID, $input: CPGInput){
        nuevoRegistroCPG(id:$id, input: $input){
            id
            creado
            modificado
            operario
            lote
            cliente
            loteBolsa
            loteBolsaID
            loteGel
            dobleBolsa
            manta
            cantDescarte
            cantProducida
            observaciones
            estado
        }
    }
`;

const ELIMINAR_REGISTRO = gql `
    mutation eliminarRegistroCPG($id: ID!){
        eliminarRegistroCPG(id: $id)
    }
`

const NuevoRegistroPG = () => {

    const usuarioContext = useContext(UsuarioContext);
    const productos = usuarioContext.productos;
    const { nombre: operario } = usuarioContext.usuario;
    const [ nuevoRegistroCPG ] = useMutation(NUEVO_REGISTRO);
    const [ eliminarRegistroCPG ] = useMutation(ELIMINAR_REGISTRO);
    const {data, loading} = useQuery(LISTA_STOCK_CATEGORIA, {
        variables: {
            input: "Polietileno"
        }
    });
    const {data: dataQuimico, loading: loadingQuimico} = useQuery(LISTA_STOCK_CATEGORIA, {
        variables: {
            input: "Quimico"
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
        dobleBolsa: false,
        manta: false
    });
    const formikInicio = useFormik({
        initialValues: {
            lote: '',
            cliente: '',
            loteGel: '',
            dobleBolsa: false,
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

    if(loading || loadingQuimico) return (
        <Layout>
          <p className="text-2xl text-gray-800 font-light" >Cargando...</p>
        </Layout>
    );
    
    const polietileno = data.obtneterStockInsumosPorCategoria;
    const quimico = dataQuimico.obtneterStockInsumosPorCategoria;

    const seleccionarProducto = value => {
        setRegistro({...registro, producto: value.nombre, productoID: value.id})
    };

    const seleccionarLoteBolsa = value => {
        setRegistro({...registro, loteBolsa: value.lote, loteBolsaID: value.id})
    }

    const iniciarRegistro = async valores => {
        const { lote, cliente, loteGel, dobleBolsa, manta } = valores
        try {
            const { data } = await nuevoRegistroCPG({
                variables: {
                    input: {
                        lote,
                        cliente,
                        loteGel,
                        operario,
                        dobleBolsa,
                        manta,
                        producto: registro.producto,
                        productoID: registro.productoID,
                        loteBolsa: registro.loteBolsa,
                        loteBolsaID: registro.loteBolsaID
                    }
                }
            })
            setRegistro({...registro, lote, cliente, loteGel, dobleBolsa, manta})
            setSesionActiva(data.nuevoRegistroCPG);
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
    
    return (
        <Layout>
            <h1 className='text-2xl text-gray-800 font-light'>Nuevo Registro de Producción de Gel</h1>

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
                                    options={productos}
                                    onChange={opcion => seleccionarProducto(opcion) }
                                    getOptionValue={ opciones => opciones.id }
                                    getOptionLabel={ opciones => opciones.nombre}
                                    placeholder="Producto..."
                                    noOptionsMessage={() => "No hay resultados"}
                                    onBlur={formikInicio.handleBlur}
                                    isMulti={false}
                                />

                                <p className="block text-gray-700 font-bold mb-2">Seleccione el Lote de Bolsa</p>
                                <Select
                                    className="mt-3 mb-4"
                                    options={polietileno}
                                    onChange={opcion => seleccionarLoteBolsa(opcion) }
                                    getOptionValue={ opciones => opciones.id }
                                    getOptionLabel={ opciones => 'Lote: ' + opciones.lote + ' - Insumo: ' + opciones.insumo}
                                    placeholder="Lote Bolsa..."
                                    noOptionsMessage={() => "No hay resultados"}
                                    onBlur={formikInicio.handleBlur}
                                    isMulti={false}
                                />

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
                                    <label className="block text-gray-700 font-bold " htmlFor="dobleBolsa">
                                        Doble Bolsa:
                                    </label>

                                    <input
                                        className="mt-1 ml-2 form-checkbox h-5 w-5 text-gray-600"
                                        id="dobleBolsa"
                                        type="checkbox"
                                        onChange={formikInicio.handleChange}
                                        onBlur={formikInicio.handleBlur}
                                        value={formikInicio.values.dobleBolsa}
                                    />
                                </div>

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
                                <p className="text-gray-700 text-mm font-bold mr-1">Cliente: </p>
                                <p className="text-gray-700 font-light">{registro.cliente}</p>
                            </div>
                            <div className="flex">
                                <p className="text-gray-700 text-mm font-bold mr-1">Lote de Bolsa: </p>
                                <p className="text-gray-700 font-light">{registro.loteBolsa}</p>
                            </div>
                            <div className="flex">
                                <p className="text-gray-700 text-mm font-bold mr-1">Lote de Gel: </p>
                                <p className="text-gray-700 font-light">{registro.loteGel}</p>
                            </div>
                            <div className="flex">
                                <p className="text-gray-700 text-mm font-bold mr-1">Doble Bolsa: </p>
                                <p>{registro.dobleBolsa ? '✔' : '✘'}</p>
                            </div>
                            <div className="flex mb-2">
                                <p className="text-gray-700 text-mm font-bold mr-1">Manta: </p>
                                <p>{registro.manta ? '✔' : '✘'}</p>
                            </div>
                        </div>
                        <button
                            className="bg-gray-800 w-full mt-2 p-2 text-white uppercase font-bold hover:bg-gray-900" 
                            onClick={() => volver()}
                        >
                            Volver
                        </button>
                    </div>
                </div>
                }
            </div>
        </Layout>
    );
}

export default NuevoRegistroPG;
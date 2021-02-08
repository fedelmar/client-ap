import React, {useContext, useState} from 'react';
import Select from 'react-select';
import Layout from '../../../components/Layout';
import UsuarioContext from '../../../context/usuarios/UsuarioContext';
import { gql, useQuery, useMutation } from '@apollo/client';
import { useFormik } from 'formik';
import * as Yup from 'yup';

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

const NuevoRegistroPG = () => {

    const usuarioContext = useContext(UsuarioContext);
    const productos = usuarioContext.productos;
    const { nombre: operario } = usuarioContext.usuario;
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
    const [registro, setRegistro] = useState({
        producto: '',
        productoID: '',
        loteBolsa: '',
        loteBolsaID: '',
        loteGel: '',
        loteGelID: '',
        dobleBolsa: false,
        manta: false
    });
    const formikInicio = useFormik({
        initialValues: {
            lote: '',
            cliente: ''
        },
        validationSchema: Yup.object({
            lote: Yup.string().required('Ingrese el Lote'),
            cliente: Yup.string().required('Ingrese el Cliente')                     
        }),
        onSubmit: valores => {     
            console.log(valores);         
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

    console.log(registro)
    
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

                                <input
                                    type="submit"
                                    className="bg-gray-800 w-full mt-5 p-2 text-white uppercase font-bold hover:bg-gray-900"
                                    value="Iniciar Producción"
                                />

                            </form>
                        </div>
                    </div>
                ) : null}
            </div>
        </Layout>
    );
}

export default NuevoRegistroPG;
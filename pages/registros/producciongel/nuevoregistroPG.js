import React, {useContext, useState} from 'react';
import Select from 'react-select';
import { format } from 'date-fns';
import { useRouter } from 'next/router';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import Swal from 'sweetalert2';
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

const PRODUCTOS = gql`
    query obtenerProductosPorCategoria($input: String!) {
        obtenerProductosPorCategoria(input: $input){
            id
            nombre
            categoria
            caja
            cantCaja
            insumos
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
            puesto1
            puesto2
        }
    }
`;

const ELIMINAR_REGISTRO = gql `
    mutation eliminarRegistroCPG($id: ID!){
        eliminarRegistroCPG(id: $id)
    }
`

const NuevoRegistroPG = () => {

    const router = useRouter();
    const usuarioContext = useContext(UsuarioContext);
    const { nombre: operario } = usuarioContext.usuario;
    const [ nuevoRegistroCPG ] = useMutation(NUEVO_REGISTRO);
    const [ eliminarRegistroCPG ] = useMutation(ELIMINAR_REGISTRO);
    const {data, loading} = useQuery(LISTA_STOCK_CATEGORIA, {
        variables: {
            input: "Polietileno"
        }
    });
    const { data: dataProductos, loading: loadingProductos } = useQuery(PRODUCTOS, {
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
        dobleBolsa: false,
        manta: false
    });
    // Definicion de formulario de inicio de registro
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
    // Definicion de formulario de finalizacion de registro
    const formikCierre = useFormik({
        initialValues: {
            cantProducida: 0,
            cantDescarte: 0,
            puesto1: '',
            puesto2: '',
            observaciones: ''
        },
        validationSchema: Yup.object({
            cantProducida: Yup.number()
                                    .max(registro.bolsasDisponibles, `Debe ser menor o igual a ${registro.bolsasDisponibles}`)
                                    .required('Ingrese la cantidad producida'),
            cantDescarte: Yup.number()
                                    .required('Ingrese el descarte')
                                    .test('disponibilidad', 'No hay disponibilidad',
                                    function(cantDescarte) {
                                        return cantDescarte <= registro.bolsasDisponibles - cantProducida.value
                                    }),
            puesto1: Yup.string().required('Ingrese los operarios en el Puesto 1'),
            puesto2: Yup.string().required('Ingrese los operarios en el Puesto 2'),
            observaciones: Yup.string(),
        }), 
        onSubmit: valores => {
            finalizarRegistro(valores);
        }
    });

    if(loading || loadingProductos) return (
        <Layout>
          <p className="text-2xl text-gray-800 font-light" >Cargando...</p>
        </Layout>
    );
    const polietileno = data.obtneterStockInsumosPorCategoria;

    // Funciones de seleccion de Lote de bolsa y Producto
    const seleccionarProducto = value => {
        setRegistro({...registro, producto: value.nombre, productoID: value.id})
    };
    const seleccionarLoteBolsa = value => {
        setRegistro({...registro, loteBolsa: value.lote, loteBolsaID: value.id, bolsasDisponibles: value.cantidad })
    };

    // Iniciar el registro cargando los primeros datos en la BD
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

    // Finalizar el registro actualizando los datos en la BD
    const finalizarRegistro = async valores => {
        const { cantProducida, cantDescarte, puesto1, puesto2, observaciones } = valores;
        let msjDobleBolsa;
        let msjManta;
        registro.dobleBolsa ? msjDobleBolsa = "Si" : msjDobleBolsa = "No";
        registro.manta ? msjManta = "Si" : msjManta = "No";

        Swal.fire({
            title: 'Verifique los datos antes de confirmar',
            html:   "Lote: " + registro.lote + "</br>" + 
                    "Producto: " + registro.producto + "</br>" +
                    "Operario: " + operario + "</br>" +
                    "Cliente: " + registro.cliente + "</br>" +
                    "Lote de Bolsa: " + registro.loteBolsa + "</br>" +
                    "Lote de Gel: " + registro.loteGel + "</br>" +
                    "Doble Bolsa: " + msjDobleBolsa + "</br>" +
                    "Manta: " + msjManta + "</br>" +
                    "Cantidad producida: " + cantProducida + "</br>" +
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
                    const { data } = await nuevoRegistroCPG({
                        variables: {
                            id: sesionActiva.id,
                            input: {      
                                operario,     
                                cantProducida,
                                cantDescarte,
                                puesto1,
                                puesto2,
                                observaciones,
                                lote: registro.lote, 
                                producto: registro.producto,
                                productoID: registro.productoID,
                                loteBolsa: registro.loteBolsa,
                                loteBolsaID: registro.loteBolsaID
                            }   
                        }                
                    });
                    Swal.fire(
                        'Se guardo el registro y se actualizo el stock de productos',
                        data.nuevoRegistroCPG.cantProducida - data.nuevoRegistroCPG.cantDescarte + ' bolsas de gel producidas',
                        'success'
                    )
                    router.push('/registros/producciongel');
                } catch (error) {
                    console.log(error)
                }
            }
          })
   
    }

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
    
    const listaProductos = dataProductos.obtenerProductosPorCategoria;

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
                                    options={listaProductos}
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
                                        <p className="text-gray-700 font-light">{registro.bolsasDisponibles}</p>
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
                }
            </div>
        </Layout>
    );
}

export default NuevoRegistroPG;
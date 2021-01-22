import React, { useState, useContext } from 'react';
import { gql, useMutation, useQuery } from '@apollo/client';
import Select from 'react-select';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useRouter } from 'next/router';
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

const NUEVO_REGISTRO = gql`
    mutation nuevoRegistroPG($input: PGInput){
        nuevoRegistroPG(input: $input){
            id
            creado
            modificado
            operario
            lote
            llenado
            cantidad
            loteInsumo
            loteInsumoID
            tanque
            observaciones
        }
    }
`;

const LISTA_REGISTROS = gql `
    query obtenerRegistrosPG{
        obtenerRegistrosPG{
            id
            creado
            lote
            llenado
            cantidad
            loteInsumo
            tanque
            operario
            observaciones    
        }
    }
`;

const NuevoRegistro = () => {

    const router = useRouter();
    const usuarioContext = useContext(UsuarioContext);
    const { nombre } = usuarioContext.usuario;
    const [mensaje, guardarMensaje] = useState(null);
    const [insumo, setInsumo] = useState({
        loteInsumo: '',
        loteInsumoID: '',
        cantidad: 0
    });
    const { data: dataQuimico, loading: loadingQuimico } = useQuery(LISTA_STOCK_CATEGORIA, {
        pollInterval: 500,
        variables: {
            input: "Quimico"
        }
    });
    const [ nuevoRegistroPG ] = useMutation(NUEVO_REGISTRO, {
        update(cache, {data: { nuevoRegistroPG }}) {
            
            const { obtenerRegistrosPG } = cache.readQuery({ query: LISTA_REGISTROS });

            cache.writeQuery({
                query: LISTA_REGISTROS,
                data: {
                    obtenerRegistrosPG: [...obtenerRegistrosPG, nuevoRegistroPG ]
                }
            })
        }
    })
    const formik = useFormik({
        initialValues: {
            lote: '',
            llenado: false,
            cantidad: 0,
            tanque: 0,
            observaciones: ''
        },
        validationSchema: Yup.object({
            lote: Yup.string().required('Ingrese el Lote'),
            cantidad: Yup.number().max(insumo.cantidad, `Debe ser menor a la cantidad disponible`),
            tanque: Yup.number(),
            observaciones: Yup.string()                    
        }),
        onSubmit: async valores => {
            const { lote, llenado, cantidad, tanque, observaciones } = valores;

            Swal.fire({
                title: 'Verifique los datos antes de confirmar',
                html:   "Lote: " + lote + "</br>" + 
                        "Lote de insumo: " + insumo.loteInsumo + "</br>" +
                        "Cantidad: " + cantidad + "</br>" +
                        "Tanque Nº" + tanque + "</br>" +
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
                        const { data } = await nuevoRegistroPG({
                            variables: {
                                input: {
                                    lote,
                                    llenado,
                                    cantidad,
                                    tanque: parseInt(tanque),
                                    observaciones,
                                    loteInsumo: insumo.loteInsumo,
                                    loteInsumoID: insumo.loteInsumoID,
                                    operario: nombre
                                }
                            }
                        });
                        //console.log(data.nuevoRegistroPG);                    
                        Swal.fire(
                        'Se guardo el registro', 
                        'Se actualizo el stock de insumo',
                        'success'
                        )
                        router.push('/registros/preparaciongel');
                        
                    } catch (error) {
                        guardarMensaje(error.message.replace('GraphQL error: ', ''));
                    }
                }
            })
        }
    })

    if(loadingQuimico) return (
        <Layout>
          <p className="text-2xl text-gray-800 font-light" >Cargando...</p>
        </Layout>
    );

    const seleccionarInsumo = value => {
        setInsumo({...insumo, loteInsumoID: value.id, loteInsumo: value.lote, cantidad: value.cantidad})
    }

    const mostrarMensaje = () => {
        return(
            <div className="bg-white py-2 px-3 w-full my-3 max-w-sm text-center mx-auto">
                <p>{mensaje}</p>
            </div>
        )
    }

    return (
        <Layout>
            <h1 className='text-2xl text-gray-800 font-light'>Nuevo registro de Preparación de Gel</h1>
            
            {mensaje && mostrarMensaje()}

            <div className="flex justify-center mt-5">
                <div className="w-full max-w-lg">
                    <form
                        className="bg-white shadow-md px-8 pt-6 pb-8 mb-4"
                        onSubmit={formik.handleSubmit}
                    >
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="lote">
                                    Lote
                                </label>

                                <input
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    id="lote"
                                    type="text"
                                    placeholder="Lote"
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.lote}
                                />
                            </div>

                            { formik.touched.lote && formik.errors.lote ? (
                                <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4" >
                                    <p className="font-bold">Error</p>
                                    <p>{formik.errors.lote}</p>
                                </div>
                            ) : null  }

                            <p className="block text-gray-700 text-sm font-bold mb-1">Seleccione o busque el insumo</p>
                            <Select
                                className="mt-3 mb-4"
                                options={dataQuimico.obtneterStockInsumosPorCategoria}
                                onChange={opcion => seleccionarInsumo(opcion) }
                                getOptionValue={ opciones => opciones.id }
                                getOptionLabel={ opciones => opciones.insumo +  ' Lote: ' + opciones.lote}
                                placeholder="Insumo..."
                                noOptionsMessage={() => "No hay resultados"}
                                onBlur={formik.handleBlur}
                                isMulti={false}
                            />
                            {insumo.cantidad > 0 ?
                                <div className="flex mb-2">
                                    <p className="text-gray-700 text-mm font-bold mr-1">Disponibles: </p>
                                    <p className="text-gray-700 font-light">{insumo.cantidad}</p>
                                </div> 
                            : null}

                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="cantidad">
                                    Cantidad
                                </label>

                                <input
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    id="cantidad"
                                    type="number"
                                    placeholder="Cantidad"
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.cantidad}
                                />
                            </div>

                            { formik.touched.cantidad && formik.errors.cantidad ? (
                                <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4" >
                                    <p className="font-bold">Error</p>
                                    <p>{formik.errors.cantidad}</p>
                                </div>
                            ) : null  }

                            <div className="flex mb-3">
                                <label className="block text-gray-700 font-bold " htmlFor="llenado">
                                    Verificacion de llenado:
                                </label>

                                <input
                                    className="mt-1 ml-2 form-checkbox h-5 w-5 text-gray-600"
                                    id="llenado"
                                    type="checkbox"
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.llenado}
                                />
                            </div>

                            <div className="mb-4">
                                <p className="block text-gray-700 text-sm font-bold mb-1">Tanque Nº</p>
                                <select
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    name="tanque"
                                    id="tanque"
                                    type="number"
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                >
                                    <option value="" label="Seleccione el tanque..." />
                                    <option value={1} label="1" />
                                    <option value={2} label="2" />
                                </select>
                            </div>

                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="observaciones">
                                    Observaciones
                                </label>

                                <input
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    id="observaciones"
                                    type="text"
                                    placeholder="Observaciones"
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.observaciones}
                                />
                            </div>

                            { formik.touched.observaciones && formik.errors.observaciones ? (
                                <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4" >
                                    <p className="font-bold">Error</p>
                                    <p>{formik.errors.observaciones}</p>
                                </div>
                            ) : null  }                               

                            <input
                                type="submit"
                                className="bg-gray-800 w-full mt-5 p-2 text-white uppercase font-bold hover:bg-gray-900"
                                value="Finalizar Registro"
                            />
                    </form>
                </div>
            </div>
        </Layout>
    );
};

export default NuevoRegistro;
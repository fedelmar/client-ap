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

const LOTES_PLACAS = gql `
    query obtenerStockPlacas{
        obtenerStockPlacas{
            lote
            loteID
            estado
            caja
            producto
            cantCaja
            cantidad
        }
    }
`;

const LISTA_REGISTROS = gql `
    query obtnerRegistrosGP{
        obtenerRegistrosGP{
            id
            creado
            modificado
            operario
            lote
            producto
            loteID
            guardado
            descarte
            pallet
            auxiliar
            observaciones
            estado
        }
    }
`;

const NUEVO_REGISTRO = gql `
    mutation nuevoRegistroGP($id: ID, $input: CGPInput){
        nuevoRegistroGP(id: $id, input: $input){
            id
            creado
            modificado
            operario
            lote
            producto
            loteID
            guardado
            descarte
            pallet
            auxiliar
            observaciones
            estado
        }
    }
`;

const NuevoRegistroGP = () => {

    const router = useRouter();
    const usuarioContext = useContext(UsuarioContext);
    const { nombre } = usuarioContext.usuario;
    const [mensaje, guardarMensaje] = useState(null);
    const [session, setSession] = useState(false);
    const [registro, setRegistro] = useState({
        lote: '',
        creado: '',
        id: '',
        operario: nombre,
        cantidad: ''
    });
    const { data, loading } = useQuery(LOTES_PLACAS, {
        pollInterval: 500,
    });
    const [ nuevoRegistroGP ] = useMutation(NUEVO_REGISTRO, {
        update(cache, {data: { nuevoRegistroGP }}) {
            const { obtnerRegistrosGP } = cache.readQuery({ query: LISTA_REGISTROS });

            cache.writeQuery({
                query: LISTA_REGISTROS,
                data: {
                    obtnerRegistrosGP: [...obtnerRegistrosGP, nuevoRegistroGP ]
                }
            })
        }
    });
    useEffect(() => {
        if (data) {
            data.obtenerStockPlacas.map(i => 
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
    const {obtenerStockPlacas} = data;

    const handleInicio = async () => {   
        try {
            const { data } = await nuevoRegistroGP({
                variables: {
                    input: {
                        operario: registro.operario,
                        lote: registro.lote,
                        loteID: registro.loteID,
                        producto: registro.producto
                    }
                }                
            });
            
            setRegistro({...registro, creado: data.nuevoRegistroGP.creado, id: data.nuevoRegistroGP.id})
            setSession(true);
        } catch (error) {
            console.log(error)
        }
    }

    const seleccionarLPlaca = opcion => {
        const {lote, loteID, producto, caja, cantCaja, estado, cantidad} = opcion;
        setRegistro({...registro, lote, loteID, producto, caja, cantCaja, estado, cantidad})
    }

    console.log(registro)

    return (
        <Layout>
            <h1 className="text-2xl text-gray-800 font-light" >Nuevo Registro de Guardado de Placas</h1>
            <div>
                {!session ? (
                    <div className="flex justify-center mt-5">
                        <div className="w-full max-w-lg">
                            <div className="bg-white shadow-md px-8 pt-6 pb-8 mb-4">
                                <p className="block text-gray-700 font-bold mb-2">Lote de Placa</p>
                                <Select
                                    className="mt-3 mb-4"
                                    options={obtenerStockPlacas}
                                    onChange={opcion => seleccionarLPlaca(opcion)}
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
                ) : <h1>session Iniciada</h1>}
            </div>
        </Layout>
    );
}

export default NuevoRegistroGP;
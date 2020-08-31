import React, { useContext } from 'react'
import UsuarioContext from '../../context/usuarios/UsuarioContext';
import Layout from '../../components/Layout';
import {gql, useQuery} from '@apollo/client';
import RegistroGE from '../../components/RegistroGE'
import Link from 'next/link'

const LISTA_REGISTROS = gql `
    query obtenerRegistrosGE{
        obtenerRegistrosGE{
                id
                fecha
                operario
                lote
                horaInicio
                horaCierre
                caja
                descCajas
                guardado
                descarte
                observaciones
                producto
            }
        }
`;

const GuardadoEsponjas = () => {

    const usuarioContext = useContext(UsuarioContext);
    const { rol } = usuarioContext.usuario;

    const { data, loading } = useQuery(LISTA_REGISTROS);

    if(loading) return (
        <Layout>
          <p className="text-2xl text-gray-800 font-light" >Cargando...</p>
        </Layout>
    );

    return (
        <Layout>
            <h1 className="text-2xl text-gray-800 font-light">Guardado de Esponjas</h1>

            <Link href="/registros/nuevoregistroGE">
                <a className="bg-blue-800 py-2 px-5 mt-3 inline-block text-white rounded text-sm hover:bg-gray-800 mb-3 uppercase font-bold w-full lg:w-auto text-center">Iniciar Registro</a>
            </Link>

            <div className="overflow-x-scroll">
            <table className="table-auto shadow-md mt-2 w-full w-lg">
                <thead className="bg-gray-800">
                    <tr className="text-white">
                        <th className="w-1/12 py-2">Fecha</th>
                        <th className="w-2/12 py-2">Horario</th>
                        <th className="w-1/12 py-2">Producto</th>
                        <th className="w-1/12 py-2">Lote</th>
                        <th className="w-1/12 py-2">Tipo de Caja</th>
                        <th className="w-1/12 py-2">Descarte de caja</th>
                        <th className="w-1/12 py-2">Esponjas</th>
                        <th className="w-1/12 py-2">Descarte</th>
                        <th className="w-1/12 py-2">Operario</th>
                        <th className="w-1/12 py-2">Observaciones</th>
                        {rol === "Admin" ? (
                        <>
                            {/* De momento la edicion no va a estar disponible

                            <th className="w-1/12 py-2">Editar</th> */}
                            <th className="w-1/12 py-2">Eliminar</th>
                        </>                  
                        ) : null}   
                    </tr>
                </thead>
                <tbody className="bg-white">
                {data.obtenerRegistrosGE.map(registro => (
                    <RegistroGE
                        key={registro.id}
                        registro={registro}
                        rol={rol}
                    />
                ))}  
                </tbody>  
            </table>
        </div>
        </Layout>
    );
}

export default GuardadoEsponjas;
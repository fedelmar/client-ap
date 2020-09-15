import React, { useContext, useState } from 'react';
import Layout from '../../components/Layout';
import Link from 'next/link';
import UsuarioContext from '../../context/usuarios/UsuarioContext';
import {gql, useQuery} from '@apollo/client';
import RegistroSalidas from '../../components/RegistroSalidas';

const LISTA_REGISTROS = gql `
    query obtenerRegistrosSalidas{
        obtenerRegistrosSalidas{
            id
            fecha
            cliente
            remito
            lotes {
                producto
                lote
                cantidad
            }
        }
    }
`;

const Salidas = () => {

    const { data, loading } = useQuery(LISTA_REGISTROS);
    const [ pdfOpen, setPdfOpen ] = useState(false);
    const usuarioContext = useContext(UsuarioContext);
    const { rol } = usuarioContext.usuario;

    if(loading) return (
        <Layout>
          <p className="text-2xl text-gray-800 font-light" >Cargando...</p>
        </Layout>
    );

    const handleOpenClose = () => {
        setPdfOpen(!pdfOpen);
    }

    //console.log(data.obtenerRegistrosSalidas)
    return (
        <Layout>
            <h1 className="text-2xl text-gray-800 font-light" >Registros de Salidas</h1>

            <div className="flex justify-between">
                <Link href="/registros/nuevasalida">
                    <a className="bg-blue-800 py-2 px-5 mt-3 inline-block text-white rounded text-sm hover:bg-gray-800 mb-3 uppercase font-bold w-full lg:w-auto text-center">Nueva Salida</a>
                </Link>
                <button onClick={() => handleOpenClose()}>
                    <a className="bg-blue-800 py-2 px-5 mt-3 inline-block text-white rounded text-sm hover:bg-gray-800 mb-3 uppercase font-bold w-full lg:w-auto text-center">Exportar en pdf</a>
                </button>
            </div>

            <div className="overflow-x-scroll">
                <table className="table-auto shadow-md mt-2 w-full w-lg">
                    <thead className="bg-gray-800">
                    <tr className="text-white">
                        <th className="w-1/8 py-2">Fecha</th>
                        <th className="w-1/8 py-2">Cliente</th>
                        <th className="w-1/8 py-2">Remito</th>
                        <th className="w-1/8 px-10 py-2">Lotes</th>
                        {rol === "Admin" ? (
                                <th className="w-1/8 py-2">Eliminar</th>              
                        ) : null}   
                    </tr>
                    </thead>
                    <tbody className="bg-white">
                        {data.obtenerRegistrosSalidas.map( registro => (
                            <RegistroSalidas
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

export default Salidas;
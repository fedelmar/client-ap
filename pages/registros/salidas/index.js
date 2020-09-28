import React, { useContext, useState } from 'react';
import Layout from '../../../components/Layout';
import Link from 'next/link';
import UsuarioContext from '../../../context/usuarios/UsuarioContext';
import {gql, useQuery} from '@apollo/client';

import ExportarRegistro from '../../../components/registros/salidas/ExportarRegistroS';
import Table from '../../../components/registros/salidas/Table';


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
    const [startDate, setStartDate] = useState();
    const [endDate, setEndDate] = useState();

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

    let registros = data.obtenerRegistrosSalidas.map(i => i)
    registros.reverse();

    return (
        <Layout>
            <h1 className="text-2xl text-gray-800 font-light" >Registros de Salidas</h1>

            <div className="flex justify-between">
                <Link href="/registros/salidas/nuevasalida">
                    <a className="bg-blue-800 py-2 px-5 mt-3 inline-block text-white rounded text-sm hover:bg-gray-800 mb-3 uppercase font-bold w-full lg:w-auto text-center">Nueva Salida</a>
                </Link>
                <button onClick={() => handleOpenClose()}>
                    <a className="bg-blue-800 py-2 px-5 mt-3 inline-block text-white rounded text-sm hover:bg-gray-800 mb-3 uppercase font-bold w-full lg:w-auto text-center">Exportar en pdf</a>
                </button>
            </div>

            {pdfOpen ? 
                <ExportarRegistro 
                    registros={registros}
                />
            : null}
            
            <Table 
                registros={registros}
                rol={rol}
            />
        </Layout>
    );
}

export default Salidas;
import React, { useContext, useState } from 'react';
import Link from 'next/link';
import { useQuery } from '@apollo/client';

import Layout from '../../../components/Layout';
import UsuarioContext from '../../../context/usuarios/UsuarioContext';
import ExportarRegistro from '../../../components/registros/salidas/ExportarRegistroS';
import Table from '../../../components/registros/salidas/Table';
import { LISTA_REGISTROS } from '../../../servicios/salidas';

const Salidas = () => {

    const { data, loading } = useQuery(LISTA_REGISTROS, {
        pollInterval: 500,
    });

    const [ pdfOpen, setPdfOpen ] = useState(false);
    const [ filtros, setFiltros ] = useState(false);
    const usuarioContext = useContext(UsuarioContext);
    const { rol } = usuarioContext.usuario;

    if(loading) return (
        <Layout>
          <p className="text-2xl text-gray-800 font-light">Cargando...</p>
        </Layout>
    );

    const handleOpenClosePDF = () => {
        setPdfOpen(!pdfOpen);
    }

    const handleOpenCloseFiltros = () => {
        setFiltros(!filtros);
    }

    let registros = data.obtenerRegistrosSalidas.map(i => i);

    return (
        <Layout>
            <h1 className="text-2xl text-gray-800 font-light" >Registros de Salidas</h1>

            <div className="flex justify-between">
                <Link href="/registros/salidas/nuevasalida">
                    <a className="bg-blue-800 py-2 px-5 mt-1 inline-block text-white rounded text-sm hover:bg-gray-800 mb-3 uppercase font-bold w-full lg:w-auto text-center">Nueva Salida</a>
                </Link>
                <div>
                    <button onClick={() => handleOpenCloseFiltros()}>
                        <a className="bg-blue-800 py-2 px-5 mt-1 mr-1 inline-block text-white rounded text-sm hover:bg-gray-800 mb-3 uppercase font-bold w-full lg:w-auto text-center">Buscar</a>
                    </button>
                    <button onClick={() => handleOpenClosePDF()}>
                        <a className="bg-blue-800 py-2 px-5 mt-1 inline-block text-white rounded text-sm hover:bg-gray-800 mb-3 uppercase font-bold w-full lg:w-auto text-center">Exportar en pdf</a>
                    </button>
                </div>   
            </div>

            {pdfOpen ? 
                <ExportarRegistro 
                    registros={registros}
                />
            : null}
            
            <Table 
                registros={registros}
                rol={rol}
                filtros={filtros}
            />
        </Layout>
    );
}

export default Salidas;
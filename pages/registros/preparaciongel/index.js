import React, { useState, useContext } from 'react'
import UsuarioContext from '../../../context/usuarios/UsuarioContext';
import { gql, useQuery } from '@apollo/client';
import Layout from '../../../components/Layout';
import Table from '../../../components/registros/preparaciongel/Table';
import ExportarRegistro from '../../../components/registros/preparaciongel/ExportarRegistro';
import Link from 'next/link';

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

const PreparacionGel = () => {

    const usuarioContext = useContext(UsuarioContext);
    const { rol } = usuarioContext.usuario;
    const { data, loading } = useQuery(LISTA_REGISTROS, {
      pollInterval: 500,
    });
    const [ pdfOpen, setPdfOpen ] = useState(false);
    const [ filtros, setFiltros ] = useState(false);

    if(loading) return (
        <Layout>
          <p className="text-2xl text-gray-800 font-light" >Cargando...</p>
        </Layout>
    );

    const handleOpenClosePDF = () => {
        setPdfOpen(!pdfOpen);
    }

    const handleOpenCloseFiltros = () => {
        setFiltros(!filtros);
    }

    let registros = data.obtenerRegistrosPG.map(i => i);

    return (
        <Layout>
            <h1 className="text-2xl text-gray-800 font-light">Preparacion de Gel Regrigerante</h1>

            <div className="flex justify-between">
                <Link href="/registros/produccionesponjas/nuevoregistroPE">
                    <a className="bg-blue-800 py-2 px-5 mt-1 inline-block text-white rounded text-sm hover:bg-gray-800 mb-3 uppercase font-bold w-full lg:w-auto text-center">Iniciar producción</a>
                </Link>   
                <div>
                    <button onClick={() => handleOpenCloseFiltros()}>
                        <a className="bg-blue-800 py-2 px-5 mt-1 mr-1 inline-block text-white rounded text-sm hover:bg-gray-800 mb-3 uppercase font-bold w-full lg:w-auto text-center">Buscar</a>
                    </button>
                    {rol === "Admin" ? 
                        <button onClick={() => handleOpenClosePDF()}>
                            <a className="bg-blue-800 py-2 px-5 mt-1 inline-block text-white rounded text-sm hover:bg-gray-800 mb-3 uppercase font-bold w-full lg:w-auto text-center">Exportar en pdf</a>
                        </button>
                    : null}
                </div>
            </div>
            
            {pdfOpen ?
                <ExportarRegistro 
                    registros={registros}
                />
            : null }

            {registros.length > 0 ? 
                <Table 
                    registros={registros}
                    filtros={filtros}
                    rol={rol}
                />
            : 
                <div className="bg-white border rounded shadow py-2 px-3 w-full my-3 max-w-sm text-center mx-auto">  
                    <p className="text-xl text-center">No hay registros activos para mostrar</p>
                </div>}

        </Layout>
    );
}

export default PreparacionGel;
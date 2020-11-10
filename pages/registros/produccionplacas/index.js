import React, { useState, useContext } from 'react';
import { gql, useQuery } from '@apollo/client';
import Link from 'next/link';
import Layout from '../../../components/Layout';
import UsuarioContext from '../../../context/usuarios/UsuarioContext';
import Table from '../../../components/registros/produccionplacas/Table';
import ExportarRegistro from '../../../components/registros/produccionplacas/ExportarRegistroPP';

const LISTA_REGISTROS = gql `
    query obtenerRegistrosPP{
        obtenerRegistrosPP{
            id
            creado
            modificado
            producto
            operario
            lote
            lTapon
            lPcm
            lPlaca
            cantDescarte
            cantProducida
            observaciones
            estado
        }
    }
`;

const ProduccionPlacas = () => {

    const usuarioContext = useContext(UsuarioContext);
    const { rol } = usuarioContext.usuario;
    const { data, loading } = useQuery(LISTA_REGISTROS, {
      pollInterval: 500,
    });
    const [ pdfOpen, setPdfOpen ] = useState(false);
    const [ filtros, setFiltros ] = useState(false);
    const [ activos, setActivos ] = useState(false);

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
    
    const handleOpenCloseActivos = () => {
      setActivos(!activos);
    }

    let registrosCerrados = data.obtenerRegistrosPP.filter(i => i.estado === false);
    let registrosAbiertos = data.obtenerRegistrosPP.filter(i => i.estado === true);
    registrosAbiertos.reverse();
    registrosCerrados.reverse();

    return (
        <Layout>
            <h1 className="text-2xl text-gray-800 font-light">Registros de produccion de Placas</h1>

            <div className="flex justify-between">
                <div>
                    <Link href="/registros/produccionplacas/nuevoregistroPP">
                    <a className="bg-blue-800 py-2 px-5 mt-3 inline-block text-white rounded text-sm hover:bg-gray-800 mb-3 uppercase font-bold w-full lg:w-auto text-center">Iniciar producción</a>
                    </Link>
                    <button onClick={() => handleOpenCloseActivos()}>
                        <a className="bg-blue-800 py-2 px-5 mt-3 ml-1 inline-block text-white rounded text-sm hover:bg-gray-800 mb-3 uppercase font-bold w-full lg:w-auto text-center">Registros Activos</a>
                    </button>
                </div>
                <div>
                    <button onClick={() => handleOpenCloseFiltros()}>
                        <a className="bg-blue-800 py-2 px-5 mt-3 mr-1 inline-block text-white rounded text-sm hover:bg-gray-800 mb-3 uppercase font-bold w-full lg:w-auto text-center">Buscar</a>
                    </button>
                    {rol === "Admin" ? 
                        <button onClick={() => handleOpenClosePDF()}>
                            <a className="bg-blue-800 py-2 px-5 mt-3 inline-block text-white rounded text-sm hover:bg-gray-800 mb-3 uppercase font-bold w-full lg:w-auto text-center">Exportar en pdf</a>
                        </button>
                    : null}
                </div>
            </div>

            {pdfOpen ?
                <ExportarRegistro 
                    registros={registrosCerrados}
                />
            : null }

            {activos && registrosAbiertos.length > 0 ? 
                <Table 
                    registros={registrosAbiertos}
                    filtros={filtros}
                    rol={rol}
                />
                : activos ?
                    <div className="bg-white border rounded shadow py-2 px-3 w-full my-3 max-w-sm text-center mx-auto">  
                        <p className="text-xl text-center">No hay registros activos para mostrar</p>
                    </div>
            : null}

            {registrosCerrados.length > 0 ?
            <Table
                registros={registrosCerrados}
                filtros={filtros}
                rol={rol}
            />
            :           
            <div className="bg-white border rounded shadow py-2 px-3 w-full my-3 max-w-sm text-center mx-auto">  
                <p className="text-xl text-center">No hay registros para mostrar</p>
            </div>}
        
        </Layout>
    );
}

export default ProduccionPlacas;
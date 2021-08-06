import React, {useContext, useState} from 'react';
import { useQuery } from '@apollo/client';
import Link from 'next/link';

import Layout from '../../../components/Layout';
import UsuarioContext from '../../../context/usuarios/UsuarioContext';
import Table from '../../../components/registros/producciongel/Table';
import ExportarRegistro from '../../../components/registros/producciongel/ExportarRegistro';
import { OBTENER_REGISTROS } from '../../../servicios/produccionDeGel';

const index = () => {
    const usuarioContext = useContext(UsuarioContext);
    const { rol } = usuarioContext.usuario;
    const { data, loading } = useQuery(OBTENER_REGISTROS, {
        pollInterval: 500,
    });
    const [ activos, setActivos ] = useState(false);
    const [ filtros, setFiltros ] = useState(false);
    const [ pdfOpen, setPdfOpen ] = useState(false);

    if(loading) return (
        <Layout>
          <p className="text-2xl text-gray-800 font-light" >Cargando...</p>
        </Layout>
    );

    let registrosCerrados = data.obtenerRegistrosCPG.filter(i => i.estado === false);
    let registrosAbiertos = data.obtenerRegistrosCPG.filter(i => i.estado === true);

    const handleOpenCloseActivos = () => {
        setActivos(!activos);
    };

    const handleOpenCloseFiltros = () => {
        setFiltros(!filtros);
    };

    const handleOpenClosePDF = () => {
        setPdfOpen(!pdfOpen);
    };
  
    return (
        <Layout>
            <h1 className="text-2xl text-gray-800 font-light">Produccion de Gel</h1>

            <div className="flex justify-between">
                <div>
                    <Link href="/registros/producciongel/seleccionarRegistro">
                    <a className="bg-blue-800 py-2 px-5 mt-1 inline-block text-white rounded text-sm hover:bg-gray-800 mb-3 uppercase font-bold w-full lg:w-auto text-center">Iniciar producción</a>
                    </Link>
                    <button onClick={() => handleOpenCloseActivos()}>
                        <a className="bg-blue-800 py-2 px-5 mt-1 ml-1 inline-block text-white rounded text-sm hover:bg-gray-800 mb-3 uppercase font-bold w-full lg:w-auto text-center">Registros Activos</a>
                    </button>
                </div>
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
                    registros={registrosCerrados}
                />
            : null }

            {activos && registrosAbiertos.length > 0 ? 
                <Table 
                    registros={registrosAbiertos}
                    rol={rol}
                    filtros={filtros}
                />
            :   activos ?
                    <div className="bg-white border rounded shadow py-2 px-3 w-full my-3 max-w-sm text-center mx-auto">  
                        <p className="text-xl text-center">No hay registros activos para mostrar</p>
                    </div>
                : null}

            {registrosCerrados.length > 0 ?
                <Table 
                    registros={registrosCerrados}
                    rol={rol}
                    filtros={filtros}
                />
            :           
                <div className="bg-white border rounded shadow py-2 px-3 w-full my-3 max-w-sm text-center mx-auto">  
                    <p className="text-xl text-center">No hay registros para mostrar</p>
                </div>}

        </Layout>
    );
};

export default index;
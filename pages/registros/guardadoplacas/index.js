import React, { useContext, useState } from 'react'
import UsuarioContext from '../../../context/usuarios/UsuarioContext';
import Layout from '../../../components/Layout';
import {gql, useQuery} from '@apollo/client';
import Link from 'next/link';

const GuardadoPlacas = () => {

    const usuarioContext = useContext(UsuarioContext);
    const { rol } = usuarioContext.usuario;
    const [ pdfOpen, setPdfOpen ] = useState(false);
    const [ filtros, setFiltros ] = useState(false);
    const [ activos, setActivos ] = useState(false);

    const handleOpenClosePDF = () => {
        setPdfOpen(!pdfOpen);
    }
    const handleOpenCloseFiltros = () => {
        setFiltros(!filtros);
    }    
    const handleOpenCloseActivos = () => {
      setActivos(!activos);
    }

    return (
        <Layout>
            <h1 className="text-2xl text-gray-800 font-light" >Guardado de Placas</h1>

            <div className="flex justify-between">
                <div>
                    <Link href="/registros/guardadoesponjas/nuevoregistroGE">
                        <a className="bg-blue-800 py-2 px-5 mt-1 inline-block text-white rounded text-sm hover:bg-gray-800 mb-3 uppercase font-bold w-full lg:w-auto text-center">Iniciar Registro</a>
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

        </Layout>
    )
}

export default GuardadoPlacas;
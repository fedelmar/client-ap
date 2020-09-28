import React, { useState, useContext } from 'react'
import UsuarioContext from '../../../context/usuarios/UsuarioContext';
import { gql, useQuery } from '@apollo/client';
import Layout from '../../../components/Layout';
import Link from 'next/link';
import ExportarRegistro from '../../../components/registros/produccionesponjas/ExportarRegistroPE';
import Table from '../../../components/registros/produccionesponjas/Table';


const LISTA_REGISTROS = gql `
    query obtenerRegistrosCE {
        obtenerRegistrosCE{
            id
            fecha
            operario
            lote
            horaInicio
            horaCierre
            producto
            lBolsa
            lEsponja
            cantProducida
            cantDescarte
            observaciones
        }
    }
`;

const ProduccionEsponjas = () => {

    const usuarioContext = useContext(UsuarioContext);
    const { rol } = usuarioContext.usuario;
    const { data, loading } = useQuery(LISTA_REGISTROS);
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

    let registros = data.obtenerRegistrosCE.map(i => i);
    registros.reverse();
    
    return (
    <Layout>
      <h1 className="text-2xl text-gray-800 font-light" >Registros de produccion de Esponjas</h1>

      <div className="flex justify-between">
        <Link href="/registros/produccionesponjas/nuevoregistroPE">
          <a className="bg-blue-800 py-2 px-5 mt-3 inline-block text-white rounded text-sm hover:bg-gray-800 mb-3 uppercase font-bold w-full lg:w-auto text-center">Iniciar producción</a>
        </Link>
        <div>
          <button onClick={() => handleOpenCloseFiltros()}>
            <a className="bg-blue-800 py-2 px-5 mt-3 mr-1 inline-block text-white rounded text-sm hover:bg-gray-800 mb-3 uppercase font-bold w-full lg:w-auto text-center">Buscar</a>
          </button>
          <button onClick={() => handleOpenClosePDF()}>
            <a className="bg-blue-800 py-2 px-5 mt-3 inline-block text-white rounded text-sm hover:bg-gray-800 mb-3 uppercase font-bold w-full lg:w-auto text-center">Exportar en pdf</a>
          </button>
        </div>
      </div>

      {pdfOpen ? (
        <ExportarRegistro 
          registros={registros}
        />
      ) : null }

      <Table 
        registros={registros}
        filtros={filtros}
        rol={rol}
      />
       
    </Layout>  
    
    );
}

export default ProduccionEsponjas
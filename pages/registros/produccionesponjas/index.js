import React, { useContext, useState } from 'react'
import { gql, useQuery } from '@apollo/client';
import UsuarioContext from '../../../context/usuarios/UsuarioContext';
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

    const registros = data.obtenerRegistrosCE;

    //console.log(data.obtenerRegistrosCE)
    return (
    <Layout>
      <h1 className="text-2xl text-gray-800 font-light" >Registros de produccion de Esponjas</h1>

      <div className="flex justify-between">
        <Link href="/registros/produccionesponjas/nuevoregistroPE">
          <a className="bg-blue-800 py-2 px-5 mt-3 inline-block text-white rounded text-sm hover:bg-gray-800 mb-3 uppercase font-bold w-full lg:w-auto text-center">Iniciar producción</a>
        </Link>
        <button onClick={() => handleOpenClose()}>
          <a className="bg-blue-800 py-2 px-5 mt-3 inline-block text-white rounded text-sm hover:bg-gray-800 mb-3 uppercase font-bold w-full lg:w-auto text-center">Exportar en pdf</a>
        </button>
      </div>

      {pdfOpen ? (
        <ExportarRegistro 
          registros={registros}
        />
      ) : null }

      <Table props={registros} />
       
    </Layout>  
    
    );
}

export default ProduccionEsponjas
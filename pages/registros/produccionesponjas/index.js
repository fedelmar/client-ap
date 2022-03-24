import React, { useState, useContext, useEffect } from 'react'
import UsuarioContext from '../../../context/usuarios/UsuarioContext';
import { useQuery } from '@apollo/client';
import Layout from '../../../components/Layout';
import Link from 'next/link';
import ExportarRegistro from '../../../components/registros/produccionesponjas/ExportarRegistroPE';
import Table from '../../../components/registros/produccionesponjas/Table';
import { LISTA_REGISTROS, LISTA_REGISTROS_ABIERTOS } from '../../../servicios/produccionDeEsponjas';

const ProduccionEsponjas = () => {
    const usuarioContext = useContext(UsuarioContext);
    const { rol } = usuarioContext.usuario;

    const [pages, setPages] = useState(1);
    const [pdfOpen, setPdfOpen] = useState(false);
    const [filtros, setFiltros] = useState(false);
    const [activos, setActivos] = useState(false);
    const [registros, setRegistros] = useState([]);

    const { data: regAbiertos, loading: loadAbiertos } = useQuery(LISTA_REGISTROS_ABIERTOS);
    const { data, loading } = useQuery(LISTA_REGISTROS,{
      pollInterval: 500,
      variables: {
        page: pages,
      }
    })

    useEffect(() => {
      if (data) setRegistros([...registros, ...data.obtenerRegistrosPE]);
    },[data, pages])

    if(loading || loadAbiertos) return (
        <Layout>
          <p className="text-2xl text-gray-800 font-light" >Cargando...</p>
        </Layout>
    );

    const handleOpenClose = (funct, state) => {
      funct(!state);
    };

    return (
      <Layout>
        <h1 className="text-2xl text-gray-800 font-light">Registros de produccion de Esponjas</h1>

        <div className="flex justify-between">
          <div>
            <Link href="/registros/produccionesponjas/nuevoregistroPE">
              <a className="bg-blue-800 py-2 px-5 mt-1 inline-block text-white rounded text-sm hover:bg-gray-800 mb-3 uppercase font-bold w-full lg:w-auto text-center">Iniciar producción</a>
            </Link>
            <button onClick={() => handleOpenClose(setActivos, activos)}>
                <a className="bg-blue-800 py-2 px-5 mt-1 ml-1 inline-block text-white rounded text-sm hover:bg-gray-800 mb-3 uppercase font-bold w-full lg:w-auto text-center">Registros Activos</a>
            </button>
          </div>
          <div>
            <button onClick={() => handleOpenClose(setFiltros, filtros)}>
              <a className="bg-blue-800 py-2 px-5 mt-1 mr-1 inline-block text-white rounded text-sm hover:bg-gray-800 mb-3 uppercase font-bold w-full lg:w-auto text-center">Buscar</a>
            </button>
            {rol === "Admin" ? 
              <button onClick={() => handleOpenClose(setPdfOpen, pdfOpen)}>
                <a className="bg-blue-800 py-2 px-5 mt-1 inline-block text-white rounded text-sm hover:bg-gray-800 mb-3 uppercase font-bold w-full lg:w-auto text-center">Exportar en pdf</a>
              </button>
            : null}
          </div>
        </div>

        {pdfOpen ?
          <ExportarRegistro 
            registros={data.obtenerRegistrosPE}
          />
        : null }

        {activos && regAbiertos.obtenerRegistrosAbiertosPE.length > 0 ? 
          <Table 
            registros={regAbiertos.obtenerRegistrosAbiertosPE}
            filtros={filtros}
            rol={rol}
          />
        : activos ?
          <div className="bg-white border rounded shadow py-2 px-3 w-full my-3 max-w-sm text-center mx-auto">  
            <p className="text-xl text-center">No hay registros activos para mostrar</p>
          </div>
        : null}

        {registros.length > 0 ?
          <>
            <Table 
              registros={registros}
              filtros={filtros}
              rol={rol}
            />
            <div className="flex justify-center mt-2">
              <button onClick={() => setPages(pages + 1)}>
                <a className="bg-blue-800 py-2 px-5 mt-1 inline-block text-white rounded text-sm hover:bg-gray-800 mb-3 uppercase font-bold w-full lg:w-auto text-center">Más registros...</a>
              </button>
            </div>
          </>
        :           
          <div className="bg-white border rounded shadow py-2 px-3 w-full my-3 max-w-sm text-center mx-auto">  
            <p className="text-xl text-center">No hay registros para mostrar</p>
          </div>}
        
      </Layout>    
    );
}

export default ProduccionEsponjas;
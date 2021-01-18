import React, { useState, useContext } from 'react'
import UsuarioContext from '../../../context/usuarios/UsuarioContext';
import { gql, useQuery } from '@apollo/client';
import Layout from '../../../components/Layout';
import Table from '../../../components/registros/preparaciongel/Table';

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
            
            {pdfOpen ?
                <ExportarRegistro 
                    registros={registrosCerrados}
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
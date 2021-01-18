import React, { useState, useContext } from 'react'
import UsuarioContext from '../../../context/usuarios/UsuarioContext';
import { gql, useQuery } from '@apollo/client';
import Layout from '../../../components/Layout';

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

    console.log(registros)

    return (
        <Layout>
            <h1 className="text-2xl text-gray-800 font-light">Preparacion de Gel Regrigerante</h1>
        </Layout>
    );
}

export default PreparacionGel;
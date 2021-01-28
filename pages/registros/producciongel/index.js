import React from 'react';
import { gql, useQuery } from '@apollo/client';
import Layout from '../../../components/Layout';

const REGISTROS = gql`
    query obtenerRegistrosCPG{
        obtenerRegistrosCPG{
            id
            creado
            modificado
            operario
            lote
            cliente
            loteBolsa
            loteBolsaID
            loteGel
            dobleBolsa
            manta
            cantDescarte
            cantProducida
            puesto1
            puesto2
            observaciones
            estado
        }
    }
`

const index = () => {

    const { data, loading } = useQuery(REGISTROS);

    if(loading) return (
        <Layout>
          <p className="text-2xl text-gray-800 font-light" >Cargando...</p>
        </Layout>
    );

    console.log(data.obtenerRegistrosCPG)

    return (
        <Layout>
            <h1 className="text-2xl text-gray-800 font-light">Produccion de Gel</h1>
        </Layout>
    );
};

export default index;
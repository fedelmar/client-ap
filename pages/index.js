import React from 'react';
import { useQuery, gql } from '@apollo/client';
import Layout from '../components/Layout';
import Table from '../components/pages/index/Table';

const ULTIMOS_LOTES = gql `
  query obtenerUltimosModificados {
    obtenerUltimosModificados {
      lote
      producto
      id
      cantidad
      creado
      modificado
      responsable
    }
  }
`;


const Index = () => {
  
  const {data, loading} = useQuery(ULTIMOS_LOTES, {
    pollInterval: 500,
  });

  if(loading) return (
    <Layout>
      <p className="text-2xl text-gray-800 font-light" >Cargando...</p>
    </Layout>
  );

  return (
    <Layout>
      <div className="flex justify-center mt-3" >
        <img src='/imagenAP.png' />    
      </div>
      
      {data.obtenerUltimosModificados.length > 0 ?
        <>
          <h1 className="text-2xl pl-2 text-gray-800 font-light">Ultimos lotes cargados</h1>
          <Table 
              registros={data.obtenerUltimosModificados}
          />
        </>
      :  null}
    </Layout>
  )
  
}

export default Index;
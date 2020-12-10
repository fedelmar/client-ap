import React from 'react';
import { useQuery, gql } from '@apollo/client';
import Layout from '../components/Layout';
import Table from '../components/index/Table';

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

      <div className="flex justify-center" >
        <img src='/imagenAP.png' />    
      </div>
      
      <h1 className="text-2xl pl-2 text-gray-800 font-light">Ultimos lotes cargados</h1>
    
      <Table 
        registros={data.obtenerUltimosModificados}
      />


  

    </Layout>
  )
  
}

export default Index;
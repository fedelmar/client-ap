import Head from 'next/head'
import Layout from '../components/Layout';
import { gql, useQuery } from '@apollo/client'

const OBTENER_CLIENTES   = gql `
query obtenerClientesVendedor {
    obtenerClientesVendedor{
        nombre
        apellido
        empresa
        email
      }
    }
`;

export default function Index() {

  // Consulta de apollo
  const { data, loading, error} = useQuery(OBTENER_CLIENTES);

  console.log(data);
  console.log(loading);
  console.log(error);

  if(loading) return (
    <Layout>
      <p className="text-2xl text-gray-800 font-light" >Cargando...</p>
    </Layout>);

  return (
    <div>
      <Layout>
        <h1 className="text-2xl text-gray-800 font-light">Inicio</h1>
      </Layout>
    </div>
  )
}

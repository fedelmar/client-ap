
import React, { useContext } from 'react'
import Layout from '../components/Layout';
import Insumo from '../components/Insumo';
import { gql, useQuery } from '@apollo/client';
import { useRouter } from 'next/router';
import Link from 'next/link';
import UsuarioContext from '../context/usuarios/UsuarioContext';

const OBTENER_INSUMOS = gql`
  query obtenerInsumos {
    obtenerInsumos{
      id
      nombre
      categoria
    }
  }
`;

export default function Pedidos() {

  const router = useRouter();
  
  const { data, loading } = useQuery(OBTENER_INSUMOS);

  const pedidoContext = useContext(UsuarioContext);
  const { rol } = pedidoContext.usuario;

  if(loading) return (
    <Layout>
      <p className="text-2xl text-gray-800 font-light" >Cargando...</p>
    </Layout>
  );

  if(!data) {
    return router.push('/login');
  }

  return (
    <div>
      <Layout>
        <h1 className="text-2xl text-gray-800 font-light">Insumos</h1>

        <Link href="/nuevoinsumo">
          <a className="bg-blue-800 py-2 px-5 mt-3 inline-block text-white rounded text-sm hover:bg-gray-800 mb-3 uppercase font-bold w-full lg:w-auto text-center">Nuevo Insumo</a>
        </Link>
        <div className="overflow-x-scroll">
          <table className="table-auto shadow-md mt-2 w-full w-lg">
            <thead className="bg-gray-800">
              <tr className="text-white">
                <th className="w-1/5 py-2">Nombre</th>
                <th className="w-1/5 py-2">Categoria</th>
                {rol === "Admin" ? (
                  <>
                    <th className="w-1/5 py-2">Editar</th>
                    <th className="w-1/5 py-2">Eliminar</th>
                  </>  
                ) : null}   
              </tr>
            </thead>
            <tbody className="bg-white">
              {data.obtenerInsumos.map( insumo => (
                  <Insumo
                    key={insumo.id}
                    insumo={insumo}
                    rol={rol}
                  />
              ))}
            </tbody>  
          </table>
        </div>
      </Layout>
    </div>
  )
}
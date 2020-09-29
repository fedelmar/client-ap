import React, { useContext } from 'react'
import Layout from '../../../components/Layout';
import Producto from '../../../components/listados/Producto';
import { gql, useQuery } from '@apollo/client';
import Link from 'next/link';
import UsuarioContext from '../../../context/usuarios/UsuarioContext';
import Table from '../../../components/listados/productos/Table';

const OBTENER_PRODUCTOS = gql`
  query obtenerProductos {
    obtenerProductos{
      id
      nombre
      categoria
      caja
      cantCaja
      insumos
    }
  }
`;


const Productos = () => {

  const { data, loading } = useQuery(OBTENER_PRODUCTOS);

  const pedidoContext = useContext(UsuarioContext);
  const { rol } = pedidoContext.usuario;

  if(loading) return (
    <Layout>
      <p className="text-2xl text-gray-800 font-light" >Cargando...</p>
    </Layout>
  );

  //console.log(data.obtenerProductos)
  let registros = data.obtenerProductos.map(i => i)
  registros.reverse();

  return (
    <div>
      <Layout>
        <h1 className="text-2xl text-gray-800 font-light">Productos</h1>
        
        <Link href="/listados/productos/nuevoproducto">
          <a className="bg-blue-800 py-2 px-5 mt-3 inline-block text-white rounded text-sm hover:bg-gray-800 mb-3 uppercase font-bold w-full lg:w-auto text-center">Nuevo Producto</a>
        </Link>
        <Table
          registros={registros} 
          rol={rol}
        />
      </Layout>
    </div>
  )
}

export default Productos;
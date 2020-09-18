import React, { useContext } from 'react'
import Layout from '../components/Layout';
import Producto from '../components/Producto';
import { gql, useQuery } from '@apollo/client';
import Link from 'next/link';
import UsuarioContext from '../context/usuarios/UsuarioContext';

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

  return (
    <div>
      <Layout>
        <h1 className="text-2xl text-gray-800 font-light">Productos</h1>
        
        <Link href="/nuevoproducto">
          <a className="bg-blue-800 py-2 px-5 mt-3 inline-block text-white rounded text-sm hover:bg-gray-800 mb-3 uppercase font-bold w-full lg:w-auto text-center">Nuevo Producto</a>
        </Link>

        <div className="overflow-x-scroll">
          <table className="table-auto shadow-md mt-2 w-full w-lg">
            <thead className="bg-gray-800">
              <tr className="text-white">
                <th className="w-1/5 py-2">Nombre</th>
                <th className="w-1/5 py-2">Categoria</th>
                <th className="w-1/5 py-2">Caja</th>
                <th className="w-1/5 py-2">Cant x Caja</th>
                <th className="w-1/5 py-2">Insumos</th>
                {rol === "Admin" ? (
                  <>
                    <th className="w-1/5 py-2">Editar</th>
                    <th className="w-1/5 py-2">Eliminar</th>
                  </>                  
                ) : null}   
              </tr>
            </thead>
            <tbody className="bg-white">
              {data.obtenerProductos.map( producto => (
                  <Producto
                    key={producto.id}
                    producto={producto}
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

export default Productos;
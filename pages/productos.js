import Layout from '../components/Layout';
import Producto from '../components/Producto';
import { gql, useQuery } from '@apollo/client';
import { useRouter } from 'next/router';
import Link from 'next/link';

const OBTENER_PRODUCTOS = gql`
  query obtenerProductos {
    obtenerProductos{
      id
      nombre
      categoria
      cantidad
    }
  }
`;


const Productos = () => {

  const router = useRouter();

  const { data, loading, error} = useQuery(OBTENER_PRODUCTOS);

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
        <h1 className="text-2xl text-gray-800 font-light">Productos</h1>
        
        <Link href="/nuevoproducto">
          <a className="bg-blue-800 py-2 px-5 mt-3 inline-block text-white rounded text-sm hover:bg-gray-800 mb-3 uppercase font-bold w-full lg:w-auto text-center">Nuevo Producto</a>
        </Link>

        <table className="table-auto shadow-md mt-10 w-full w-lg">
          <thead className="bg-gray-800">
            <tr className="text-white">
              <th className="w-1/5 py-2">Nombre</th>
              <th className="w-1/5 py-2">Categoria</th>
              <th className="w-1/5 py-2">Cantidad</th>
              <th className="w-1/5 py-2">Eliminar</th>
              <th className="w-1/5 py-2">Editar</th>   
            </tr>
          </thead>
          <tbody className="bg-white">
            {data.obtenerProductos.map( producto => (
                <Producto
                  key={producto.id}
                  producto={producto}
                />
            ))}  
          </tbody>  
        </table>
      </Layout>
    </div>
  )
}

export default Productos;
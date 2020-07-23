import Layout from '../components/Layout';
import Cliente from '../components/Cliente';
import { gql, useQuery } from '@apollo/client';
import { useRouter } from 'next/router';

const OBTENER_CLIENTES   = gql `
query obtenerClientesVendedor {
    obtenerClientesVendedor{
        id
        nombre
        apellido
        empresa
        email
      }
    }
`;

export default function Index() {

  const router = useRouter();

  // Consulta de apollo
  const { data, loading, error} = useQuery(OBTENER_CLIENTES);

  //console.log(data.obtenerClientesVendedor);
  //console.log(loading);
  //console.log(error);

  if(loading) return (
    <Layout>
      <p className="text-2xl text-gray-800 font-light" >Cargando...</p>
    </Layout>
  );

  const vistaProtegida = () => {
    router.push('/login');
  }

  return (
    <>
    { data.obtenerClientesVendedor ? (
      <div>
        <Layout>
          <h1 className="text-2xl text-gray-800 font-light">Inicio</h1>
          <table className="table-auto shadow-md mt-10 w-full w-lg">
            <thead className="bg-gray-800">
              <tr className="text-white">
                <th className="w-1/5 py-2">Nombre</th>
                <th className="w-1/5 py-2">Empresa</th>
                <th className="w-1/5 py-2">Email</th>
                <th className="w-1/5 py-2">Eliminar</th>  
              </tr>
            </thead>

            <tbody className="bg-white">
              {data.obtenerClientesVendedor.map( cliente => (
                <Cliente
                  key={cliente.id}
                  cliente={cliente}
                />
              ))}
            </tbody>
          </table>
        
        </Layout>
      </div>
    ) : vistaProtegida() }
  </>
  )
}

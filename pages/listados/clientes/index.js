import React from 'react'
import Layout from '../../../components/Layout'
import Cliente from '../../../components/listados/Cliente'
import { gql, useQuery } from '@apollo/client'
import { useRouter } from 'next/router'
import Link from 'next/link'

const OBTENER_CLIENTES = gql`
  query obtenerClientes {
    obtenerClientes {
      id
      nombre
      apellido
      empresa
      email
    }
  }
`

const Clientes = () => {
  const router = useRouter()

  // Consulta de apollo
  const { data, loading } = useQuery(OBTENER_CLIENTES)

  if (loading)
    return (
      <Layout>
        <p className="text-2xl text-gray-800 font-light">Cargando...</p>
      </Layout>
    )

  if (!data.obtenerClientes) {
    return router.push('/login')
  }

  return (
    <div>
      <Layout>
        <h1 className="text-2xl text-gray-800 font-light">Clientes</h1>

        <Link
          className="bg-blue-800 py-2 px-5 mt-3 inline-block text-white rounded text-sm hover:bg-gray-800 mb-3 uppercase font-bold w-full lg:w-auto text-center"
          href="/listados/clientes/nuevocliente"
        >
          Nuevo Cliente
        </Link>

        <div className="overflow-x-scroll">
          <table className="table-auto shadow-md mt-2 w-full w-lg">
            <thead className="bg-gray-800">
              <tr className="text-white">
                <th className="w-1/5 py-2">Empresa</th>
                <th className="w-1/5 py-2">Email</th>
                <th className="w-1/5 py-2">Editar</th>
                <th className="w-1/5 py-2">Eliminar</th>
              </tr>
            </thead>

            <tbody className="bg-white">
              {data.obtenerClientes.map((cliente) => (
                <Cliente key={cliente.id} cliente={cliente} />
              ))}
            </tbody>
          </table>
        </div>
      </Layout>
    </div>
  )
}

export default Clientes

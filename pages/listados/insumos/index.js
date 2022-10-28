import React, { useContext, useState } from 'react'
import Layout from '../../../components/Layout'
import { gql, useQuery } from '@apollo/client'
import { useRouter } from 'next/router'
import Link from 'next/link'
import UsuarioContext from '../../../context/usuarios/UsuarioContext'
import Table from '../../../components/listados/insumos/Table'

const OBTENER_INSUMOS = gql`
  query obtenerInsumos {
    obtenerInsumos {
      id
      nombre
      categoria
    }
  }
`

export default function Pedidos() {
  const router = useRouter()

  const { data, loading } = useQuery(OBTENER_INSUMOS)
  const [filtros, setFiltros] = useState(false)
  const pedidoContext = useContext(UsuarioContext)
  const { rol } = pedidoContext.usuario

  if (loading)
    return (
      <Layout>
        <p className="text-2xl text-gray-800 font-light">Cargando...</p>
      </Layout>
    )

  if (!data) {
    return router.push('/login')
  }

  let registros = data.obtenerInsumos.map((i) => i)

  const handleOpenClose = () => {
    setFiltros(!filtros)
  }

  return (
    <div>
      <Layout>
        <h1 className="text-2xl text-gray-800 font-light">Insumos</h1>

        <div className="flex justify-between">
          <Link
            className="bg-blue-800 py-2 px-5 mt-3 inline-block text-white rounded text-sm hover:bg-gray-800 mb-3 uppercase font-bold w-full lg:w-auto text-center"
            href="/listados/insumos/nuevoinsumo"
          >
            Nuevo Insumo
          </Link>
          <button onClick={() => handleOpenClose()}>
            <a className="bg-blue-800 py-2 px-5  inline-block text-white rounded text-sm hover:bg-gray-800 uppercase font-bold w-full lg:w-auto text-center">
              Buscar
            </a>
          </button>
        </div>

        <Table registros={registros} rol={rol} filtros={filtros} />
      </Layout>
    </div>
  )
}

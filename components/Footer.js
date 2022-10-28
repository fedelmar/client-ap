import React, { useContext, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import UsuarioContext from '../context/usuarios/UsuarioContext'

const Footer = () => {
  const router = useRouter()
  const [listados, setListados] = useState(false)
  const [registros, setRegistros] = useState(false)
  const usuarioContext = useContext(UsuarioContext)
  const { rol } = usuarioContext.usuario

  const handleOpenCloseListados = () => {
    setListados(!listados)
    setRegistros(false)
  }

  const handleOpenCloseRegistros = () => {
    setListados(false)
    setRegistros(!registros)
  }

  const handleClose = () => {
    setListados(false)
    setRegistros(false)
  }

  return (
    <footer className="fixed bottom-0 bg-gray-900 w-full">
      <div>
        {registros ? (
          <div className="relative z-10">
            <li
              className={
                router.pathname === '/registros/produccionesponjas'
                  ? 'bg-blue-800 p-2 px-5 list-none'
                  : 'p-2 px-5 list-none'
              }
            >
              <Link
                className="text-white block"
                href="/registros/produccionesponjas"
              >
                Producción de Esponjas
              </Link>
            </li>
            <li
              className={
                router.pathname === '/registros/guardadoesponjas'
                  ? 'bg-blue-800 p-2 px-5 list-none'
                  : 'p-2 px-5 list-none'
              }
            >
              <Link
                className="text-white block"
                href="/registros/guardadoesponjas"
              >
                Guardado de Esponjas
              </Link>
            </li>
            <li
              className={
                router.pathname === '/registros/produccionplacas'
                  ? 'bg-blue-800 p-2 px-5 list-none'
                  : 'p-2 px-5 list-none'
              }
            >
              <Link
                className="text-white block"
                href="/registros/produccionplacas"
              >
                Producción de Placas
              </Link>
            </li>
            <li
              className={
                router.pathname === '/registros/selladoplacas'
                  ? 'bg-blue-800 p-2 px-5 list-none'
                  : 'p-2 px-5 list-none'
              }
            >
              <Link
                className="text-white block"
                href="/registros/selladoplacas"
              >
                Sellado de Placas
              </Link>
            </li>
            <li
              className={
                router.pathname === '/registros/guardadoplacas'
                  ? 'bg-blue-800 p-2 px-5 list-none'
                  : 'p-2 px-5 list-none'
              }
            >
              <Link
                className="text-white block"
                href="/registros/guardadoplacas"
              >
                Guardado de Placas
              </Link>
            </li>
            <li
              className={
                router.pathname === '/registros/producciongel'
                  ? 'bg-blue-800 p-2 px-5 list-none'
                  : 'p-2 px-5 list-none'
              }
            >
              <Link
                className="text-white block"
                href="/registros/producciongel"
              >
                Producción de Gel
              </Link>
            </li>
            <li
              className={
                router.pathname === '/registros/preparaciongel'
                  ? 'bg-blue-800 p-2 px-5 list-none'
                  : 'p-2 px-5 list-none'
              }
            >
              <Link
                className="text-white block"
                href="/registros/preparaciongel"
              >
                Preparación de Gel
              </Link>
            </li>
            {rol === 'Admin' ? (
              <>
                <li
                  className={
                    router.pathname === '/registros/ingresos'
                      ? 'bg-blue-800 p-2 px-5 list-none'
                      : 'p-2 px-5 list-none'
                  }
                >
                  <Link className="text-white block" href="/registros/ingresos">
                    Ingresos
                  </Link>
                </li>
                <li
                  className={
                    router.pathname === '/registros/salidas'
                      ? 'bg-blue-800 p-2 px-5 list-none'
                      : 'p-2 px-5 list-none'
                  }
                >
                  <Link className="text-white block" href="/registros/salidas">
                    Salidas
                  </Link>
                </li>
              </>
            ) : null}
          </div>
        ) : null}
        {listados ? (
          <div className="relative z-10">
            <li
              className={
                router.pathname === '/listados/productos'
                  ? 'bg-blue-800 p-2 px-5 list-none'
                  : 'p-2 px-5 list-none'
              }
            >
              <Link className="text-white block" href="/listados/productos">
                Productos
              </Link>
            </li>
            <li
              className={
                router.pathname === '/listados/insumos'
                  ? 'bg-blue-800 p-2 px-5 list-none'
                  : 'p-2 px-5 list-none'
              }
            >
              <Link className="text-white block" href="/listados/insumos">
                Insumos
              </Link>
            </li>
            <li
              className={
                router.pathname === '/listados/stockproductos'
                  ? 'bg-blue-800 p-2 px-5 list-none'
                  : 'p-2 px-5 list-none'
              }
            >
              <Link
                className="text-white block"
                href="/listados/stockproductos"
              >
                Stock de Productos
              </Link>
            </li>
            <li
              className={
                router.pathname === '/listados/stockinsumos'
                  ? 'bg-blue-800 p-2 px-5 list-none'
                  : 'p-2 px-5 list-none'
              }
            >
              <Link className="text-white block" href="/listados/stockinsumos">
                Stock de Insumos
              </Link>
            </li>
          </div>
        ) : null}
      </div>
      <nav className="sm:flex mx-3 list-none justify-center">
        <button
          onClick={() => handleClose()}
          tabIndex="-1"
          className={
            (listados || registros ? 'block ' : 'hidden ') +
            'fixed inset-0 h-full w-full cursor-default'
          }
        />
        <button
          onClick={() => handleOpenCloseListados()}
          className={
            listados
              ? 'text-white p-2 px-5 bg-blue-800 relative z-10 focus:outline-none'
              : 'text-white p-2 px-5 relative z-10 focus:outline-none'
          }
        >
          Listados
        </button>
        <button
          onClick={() => handleOpenCloseRegistros()}
          className={
            registros
              ? 'text-white p-2 px-5 bg-blue-800 relative z-10 focus:outline-none'
              : 'text-white p-2 px-5 relative z-10 focus:outline-none'
          }
        >
          Registros
        </button>
      </nav>
      <p className="absolute bottom-0 right-0 p-2 text-white">Hecho con ❤</p>
    </footer>
  )
}

export default Footer

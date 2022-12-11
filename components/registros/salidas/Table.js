import React, { useEffect, useMemo, useState, Fragment } from 'react'
import { useTable, useFilters, useSortBy } from 'react-table'
import { format } from 'date-fns'
import EliminarRegistro from './EliminarRegistro'
import { SALIDAS } from '../../../constants/Salidas'
import Router from 'next/router'

const { columnas } = SALIDAS

const Table = ({ registros, filtros, rol }) => {
  const [filtroCliente, setFiltroCliente] = useState('')
  const [filtroRemito, setFiltroRemito] = useState('')
  const columns = useMemo(() => columnas, [])
  const tableInstance = useTable(
    { columns, data: registros },
    useFilters,
    useSortBy
  )

  useEffect(() => {
    if (rol && rol !== 'Admin') toggleHideColumn('eliminar')
  }, [rol])

  const {
    getTableBodyProps,
    headers,
    rows,
    prepareRow,
    setFilter,
    toggleHideColumn
  } = tableInstance

  const handleFilterChangeCliente = (e) => {
    const value = e.target.value || undefined
    setFilter('cliente', value)
    setFiltroCliente(value)
  }

  const handleFilterChangeRemito = (e) => {
    const value = e.target.value || undefined
    setFilter('remito', value)
    setFiltroRemito(value)
  }

  const editarRegistro = (id) => {
    Router.push({
      pathname: `/registros/salidas/editarRegistro/${id}`
    })
  }

  return (
    <div className="overflow-x-scroll">
      {filtros ? (
        <div className="flex justify-between">
          <input
            className="p-1 border rounded border-gray-800"
            value={filtroCliente}
            onChange={handleFilterChangeCliente}
            placeholder={'Buscar Cliente'}
            autoFocus
          />
          <input
            className="p-1 border rounded border-gray-800"
            value={filtroRemito}
            onChange={handleFilterChangeRemito}
            placeholder={'Buscar Remito'}
          />
        </div>
      ) : null}

      <table className="table-auto shadow-md w-full w-lg">
        <thead className="bg-gray-800">
          <tr className="text-white">
            {headers.map((column) =>
              column.id === 'lotes' || column.id === 'eliminar' ? (
                rol !== 'Admin' && column.id === 'eliminar' ? null : (
                  <th
                    key={column.id}
                    className={
                      column.id === 'lotes' ? 'w-2/12 py-2' : 'w-1/12 py-2'
                    }
                    {...column.getHeaderProps()}
                  >
                    {column.render('Header')}
                  </th>
                )
              ) : (
                <th
                  key={column.id}
                  className={
                    column.id === 'lotes' ? 'w-2/12 py-2' : 'w-1/12 py-2'
                  }
                  {...column.getHeaderProps(column.getSortByToggleProps())}
                >
                  {column.render('Header')}
                  <span>
                    {column.isSorted ? (column.isSortedDesc ? ' ▽' : ' △') : ''}
                  </span>
                </th>
              )
            )}
          </tr>
        </thead>
        <tbody className="bg-white" {...getTableBodyProps()}>
          {rows.map((row) => {
            prepareRow(row)
            return (
              <tr key={row.id} {...row.getRowProps()}>
                {row.cells.map((cell) => {
                  return (
                    <Fragment
                      key={cell.row.original.id.concat(cell.column.Header)}
                    >
                      {cell.column.id === 'eliminar' ? (
                        <EliminarRegistro props={cell.row.original.id} />
                      ) : cell.column.id === 'fecha' ? (
                        <th
                          className="border px-4 py-2"
                          {...cell.getCellProps()}
                        >
                          {format(
                            new Date(cell.row.original.fecha),
                            'dd/MM/yy'
                          )}
                        </th>
                      ) : cell.column.id === 'editar' ? (
                        <th className="border px-5" {...cell.getCellProps()}>
                          <button
                            type="button"
                            className="flex justify-center items-center bg-green-600  py-2 px-1 w-full text-white rounded text-xs uppercase font-bold"
                            onClick={() => editarRegistro(cell.row.original.id)}
                          >
                            <svg
                              fill="none"
                              stroke="currentColor"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              viewBox="0 0 24 24"
                              className="w-4 h-4"
                            >
                              <path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                            </svg>
                          </button>
                        </th>
                      ) : cell.column.id === 'lotes' ? (
                        cell.row.original.lotes.map((i) => (
                          <th key={i.id} className="flex border">
                            <p className=" px-4 py-2 w-full h-full text-center font-bold">
                              {i.lote}
                            </p>
                            <p className=" px-4 py-2 w-full h-full text-center font-bold">
                              {i.producto}
                            </p>
                            <p className=" px-4 py-2 w-full h-full text-center font-bold">
                              {i.cantidad}
                            </p>
                          </th>
                        ))
                      ) : (
                        <th
                          className="border px-4 py-2"
                          {...cell.getCellProps()}
                        >
                          {cell.render('Cell')}
                        </th>
                      )}
                    </Fragment>
                  )
                })}
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

export default Table

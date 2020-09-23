import React, { useMemo, useState } from 'react';
import { useTable, useFilters, useSortBy } from "react-table";
import { format } from 'date-fns';
import MostrarObser from '../MostrarObser';
import EliminarRegistro from './EliminarRegistro';

const Table = ({registros}) => {

    const columns = useMemo(
        () => [
          {
            Header: 'Fecha',
            accessor: 'fecha',
          },
          {
            Header: 'Horario',
            accessor: 'horario',
          },
          {
            Header: 'Producto',
            accessor: 'producto',
          },
          {
            Header: 'Lote',
            accessor: 'lote',
          },
          {
            Header: 'Tipo de Caja',
            accessor: 'caja',
          },
          {
            Header: 'Descarte de caja',
            accessor: 'descCajas',
          },
          {
            Header: 'Esponjas',
            accessor: 'guardado',
          },
          {
            Header: 'Descarte',
            accessor: 'descarte',
          },
          {
            Header: 'Operario',
            accessor: 'operario',
          },
          {
            Header: 'Observaciones',
            accessor: 'observaciones',
          },
          {
            Header: 'Eliminar',
            accessor: 'eliminar',
          },
        ],
        []
    )

    const tableInstance = useTable(
        { columns, data: registros }, 
        useFilters, 
        useSortBy
    )

    const {
        getTableProps,
        getTableBodyProps,
        headers,
        rows,
        prepareRow,
        setFilter
    } = tableInstance;



    return (
        <div className="overflow-x-scroll">
            <table className="table-auto shadow-md mt-2 w-full w-lg">
                <thead className="bg-gray-800">
                    <tr className="text-white">
                        {headers.map(column => (
                            <th 
                                className={column.id === 'horario' ? "w-2/12 py-2" : "w-1/12 py-2"} 
                                {...column.getHeaderProps()}
                            >                              
                                {column.render('Header')}
                                        
                            </th> 
                        ))}
                    </tr>
                </thead>
                <tbody 
                    className="bg-white"
                    {...getTableBodyProps()}
                >
                    {rows.map(row => {
                        prepareRow(row)
                        console.log(row)
                        return (
                            <tr {...row.getRowProps()}>
                                {row.cells.map(cell => {
                                    return (
                                        <>
                                            {cell.column.id === 'eliminar' ?
                                                <EliminarRegistro props={cell.row.original.id} />
                                            : 
                                                cell.column.id === 'observaciones' ? 
                                                    <MostrarObser observaciones={cell.row.original.observaciones} />
                                            :
                                                cell.column.id === 'fecha' ?
                                                    <th 
                                                        className="border px-4 py-2"
                                                        {...cell.getCellProps()}
                                                    >
                                                        {format(new Date(cell.row.original.fecha), 'dd/MM/yy')}
                                                    </th>
                                            :
                                                cell.column.id === 'horario' ?
                                                    <th 
                                                        className="border px-4 py-2"
                                                        {...cell.getCellProps()}
                                                    >
                                                        De {format(new Date(cell.row.original.fecha), 'HH:mm')} a {cell.row.original.horaCierre}
                                                    </th>
                                            :
                                                <th 
                                                    className="border px-4 py-2"
                                                    {...cell.getCellProps()}
                                                >
                                                    {cell.render('Cell')}
                                                </th>}
                                        </>                                        
                                    )
                                })}
                            </tr>
                        )
                    })}
                </tbody>
            </table>
        </div>
    );
}

export default Table;
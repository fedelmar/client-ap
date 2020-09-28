import React, { useEffect, useMemo, useState } from 'react';
import { useTable, useFilters, useSortBy } from "react-table";
import Router from 'next/router';

import columnas from './columns';
import EliminarLote from './EliminarLote';
import Producto from './Producto';

const Table = ({registros, rol}) => {

    const columns = useMemo(
        () => columnas,
        []
    );    
    const tableInstance = useTable(
        { columns, data: registros }, 
        useFilters, 
        useSortBy
    );

    useEffect(() => {
        if (rol && rol !== 'Admin') {
            toggleHideColumn('eliminar');
            toggleHideColumn('editar');
        }            
    },[])

    const {
        getTableProps,
        getTableBodyProps,
        headers,
        rows,
        prepareRow,
        setFilter,
        toggleHideColumn
    } = tableInstance;

    const editarLote = (id) => {
        Router.push({
            pathname: "/listados/stockproductos/editarLProducto/[id]",
            query: { id }
        })
    }

    return (
        <div className="overflow-x-scroll">
            <table className="table-auto shadow-md mt-2 w-full w-lg">
                <thead className="bg-gray-800">
                    <tr className="text-white">
                        {headers.map(column => (
                            column.id === 'editar' || column.id === 'eliminar' 
                            ?
                                rol !== 'Admin' ?
                                    null
                                :  
                                    <th 
                                        className={column.id === 'horario' ? "w-2/12 py-2" : "w-1/12 py-2"} 
                                        {...column.getHeaderProps()}
                                    >                              
                                        {column.render('Header')}
                                                
                                    </th>                                    
                        
                            :
                                <th 
                                    className={column.id === 'horario' ? "w-2/12 py-2" : "w-1/12 py-2"} 
                                    {...column.getHeaderProps(column.getSortByToggleProps())}
                                >                              
                                    {column.render('Header')}
                                    <span>
                                        {column.isSorted
                                        ? column.isSortedDesc
                                            ? ' ▽'
                                            : ' △'
                                        : ''}
                                    </span>                        
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
                         return (
                            <tr {...row.getRowProps()}>
                                {row.cells.map(cell => {
                                    return (
                                        <>
                                            {cell.column.id === 'eliminar' ?
                                                <EliminarLote props={cell.row.original.id} />
                                            : cell.column.id === 'editar' ?
                                                <td className="border px-4 py-2">
                                                    <button
                                                        type="button"
                                                        className="flex justify-center items-center bg-green-600 py-2 px-4 w-full text-white rounded text-xs uppercase font-bold"
                                                        onClick={() => editarLote(cell.row.original.id)}
                                                    >
                                                        <svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" className="w-4 h-4"><path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
                                                    </button>
                                                </td>
                                            : cell.column.id === 'producto' ?
                                                <Producto id={cell.value} />
                                            :
                                                <th 
                                                    className="border px-4 py-2"
                                                    {...cell.getCellProps()}
                                                >
                                                    {cell.render('Cell')}
                                                </th>
                                            }
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

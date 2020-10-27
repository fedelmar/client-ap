import React, { useEffect, useMemo, useState } from 'react';
import { useTable, useFilters, useSortBy } from "react-table";
import { format } from 'date-fns';
import Router from 'next/router';
import MostrarObser from '../MostrarObser';
import EliminarRegistro from './EliminarRegistro';
import columnas from './columns';

const Table = ({registros, filtros, rol}) => {

    const columns = useMemo(
        () => columnas,
        []
    );    
    const tableInstance = useTable(
        { columns, data: registros }, 
        useFilters, 
        useSortBy
    );

    const {
        getTableProps,
        getTableBodyProps,
        headers,
        rows,
        prepareRow,
        setFilter,
        toggleHideColumn
    } = tableInstance;

    return (
        <div className="overflow-x-scroll">
            <table className="table-auto shadow-md mt-2 w-full w-lg">
                <thead className="bg-gray-800">
                <tr className="text-white">
                        {headers.map(column => (
                            column.id === 'horario' ||
                            column.id === 'observaciones' ||
                            column.id === 'eliminar'
                            ?
                                rol !== 'Admin' && column.id === 'eliminar' ?
                                    null
                                :  
                                    <th 
                                        className={column.id === 'horario' ? "w-2/12 py-2" : "w-1/12 py-2"} 
                                        {...column.getHeaderProps()}
                                    >                              
                                        {column.render('Header')}
                                                
                                    </th>                                    
                        
                            :
                                column.id === 'cantDescarte' ?
                                    registros.every(i => i.estado === true) ? 
                                        null
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
                                                <EliminarRegistro props={cell.row.original.id} />
                                            : 
                                                cell.column.id === 'observaciones' ?
                                                    cell.row.original.estado === false ?
                                                        <MostrarObser observaciones={cell.row.original.observaciones} />
                                                    :   <th 
                                                            className="border px-4 py-2"
                                                            {...cell.getCellProps()}
                                                        >
                                                            <button
                                                                    type="button"
                                                                    className="flex justify-center items-center bg-green-600 py-2 px-4 w-full text-white rounded text-xs uppercase font-bold"
                                                                    onClick={() => retomarRegistro(cell.row.original.id)}
                                                            >
                                                                Continuar
                                                            </button>  
                                                        </th>
                                            :
                                                cell.column.id === 'creado' ?
                                                    <th 
                                                        className="border px-4 py-2"
                                                        {...cell.getCellProps()}
                                                    >
                                                        {format(new Date(cell.row.original.creado), 'dd/MM/yy')}
                                                    </th>
                                            :
                                                cell.column.id === 'horario' ?
                                                    <th 
                                                        className="border px-4 py-2"
                                                        {...cell.getCellProps()}
                                                    >
                                                        De {format(new Date(cell.row.original.creado), 'HH:mm')} a 
                                                        {cell.row.original.modificado ?
                                                            format(new Date(cell.row.original.modificado), ' HH:mm')
                                                        : ' finalizar'}
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
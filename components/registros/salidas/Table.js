import React, { useEffect, useMemo, useState }  from 'react';
import { useTable, useFilters, useSortBy } from "react-table";
import { format } from 'date-fns';
import EliminarRegistro from './EliminarRegistro';
import columnas from './columns';

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
                            column.id === 'lotes' || column.id === 'eliminar'
                            ?
                                rol !== 'Admin' && column.id === 'eliminar' ?
                                    null
                                :  
                                    <th 
                                        className={column.id === 'lotes' ? "w-2/12 py-2" : "w-1/12 py-2"} 
                                        {...column.getHeaderProps()}
                                    >                              
                                        {column.render('Header')}
                                                
                                    </th>
                            :
                                <th 
                                    className={column.id === 'lotes' ? "w-2/12 py-2" : "w-1/12 py-2"} 
                                    {...column.getHeaderProps()}
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
                        prepareRow(row);
                        return (
                            <tr {...row.getRowProps()}>
                                {row.cells.map(cell => {
                                    return (
                                        <>
                                            {cell.column.id === 'eliminar' ?
                                                <EliminarRegistro props={cell.row.original.id} />
                                            :
                                                cell.column.id === 'fecha' ?
                                                    <th 
                                                        className="border px-4 py-2"
                                                        {...cell.getCellProps()}
                                                    >
                                                        {format(new Date(cell.row.original.fecha), 'dd/MM/yy')}
                                                    </th>
                                            :
                                                cell.column.id === 'lotes' ?
                                                    (cell.row.original.lotes.map(i =>
                                                        <th key={i.id} className="flex border">
                                                            <p className=" px-4 py-2 w-full h-full text-center font-bold" >{i.lote}</p>
                                                            <p className=" px-4 py-2 w-full h-full text-center font-bold" >{i.producto}</p>
                                                            <p className=" px-4 py-2 w-full h-full text-center font-bold" >{i.cantidad}</p>
                                                        </th>
                                                    ))
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
import React, { useEffect, useMemo, useState }  from 'react';
import { useTable, useFilters, useSortBy } from "react-table";
import { format } from 'date-fns';
import columnas from './columns';
import EliminarRegistro from './EliminarRegistro';

const Table = ({registros, filtros}) => {

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
        getTableBodyProps,
        headers,
        rows,
        prepareRow,
        setFilter,
        toggleHideColumn
    } = tableInstance;


    return (
        <div className="overflow-x-scroll">

            <table className="table-auto shadow-md w-full w-lg">
                <thead className="bg-gray-800">
                    <tr className="text-white">
                        {headers.map(column => (
                            column.id === 'eliminar'
                            ?
                                <th 
                                    className={"w-1/8 py-2"} 
                                    {...column.getHeaderProps()}
                                >                              
                                    {column.render('Header')}
                                            
                                </th>
                            :
                                <th 
                                    className={"w-1/8 py-2"} 
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
                                                        {format(new Date(cell.row.original.creado), 'dd/MM/yy')}
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
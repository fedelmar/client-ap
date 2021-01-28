import React, {useMemo} from 'react';
import { useTable, useFilters, useSortBy } from "react-table";
import { format } from 'date-fns';
import Router from 'next/router';
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
                            column.id === 'horario' ||
                            column.id === 'observaciones' ||
                            column.id === 'eliminar' ||
                            column.id === 'editar'
                            ?
                                rol !== 'Admin' && (column.id === 'eliminar' || column.id === 'editar') ?
                                    null
                                :  
                                    <th 
                                        key={column.id}
                                        className={column.id === 'horario' ? "w-2/15 py-2" : "w-1/15 py-2"} 
                                        {...column.getHeaderProps()}
                                    >                              
                                        {column.render('Header')}
                                                
                                    </th>                             
                        
                            :
                                column.id === 'cantDescarte' || column.id === 'cantProducida' ?
                                    registros.every(i => i.estado === true) ? 
                                        null
                                    :    
                                        <th
                                            key={column.id} 
                                            className={column.id === 'horario' ? "w-2/15 py-2" : "w-1/15 py-2"} 
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
                                        key={column.id}
                                        className={column.id === 'horario'  ? "w-2/15 py-2" : "w-1/15 py-2"} 
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
            </table>
        </div>
    );
}

export default Table;
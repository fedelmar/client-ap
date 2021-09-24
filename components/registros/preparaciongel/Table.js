import React, { useMemo, useState, Fragment }  from 'react';
import { useTable, useFilters, useSortBy } from "react-table";
import { format } from 'date-fns';
import columnas from './columns';
import EliminarRegistro from './EliminarRegistro';
import MostrarObser from '../MostrarObser';

const Table = ({registros, filtros, rol}) => {

    const [filtroLote, setFiltroLote] = useState("");
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

    const handleFilterChangeLote = e => {
        const value = e.target.value || undefined;
        setFilter("lote", value);
        setFiltroLote(value);
    };

    return (
        <div className="overflow-x-scroll">

            {filtros ? 
                <div className="flex justify-between">
                    <input
                        className="p-1 border rounded border-gray-800"
                        value={filtroLote}
                        onChange={handleFilterChangeLote}
                        placeholder={"Buscar Lote"}
                        autoFocus
                    />
                </div>
            : null}

            <table className="table-auto shadow-md w-full w-lg">
                <thead className="bg-gray-800">
                    <tr className="text-white">
                        {headers.map(column => (
                            column.id === 'eliminar'
                            ?
                                <th 
                                    key={column.id}
                                    className={"w-1/9 py-2"} 
                                    {...column.getHeaderProps()}
                                >                              
                                    {column.render('Header')}
                                            
                                </th>
                            :
                                <th 
                                    key={column.id}
                                    className={"w-1/9 py-2"} 
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
                            <tr key={row.id} {...row.getRowProps()}>
                                {row.cells.map(cell => {
                                    return (
                                        <Fragment key={cell.row.original.id + cell.column.Header}>
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
                                                cell.column.id === 'hora' ?
                                                    <th 
                                                        className="border px-4 py-2"
                                                        {...cell.getCellProps()}
                                                    >
                                                        {format(new Date(cell.row.original.creado), 'HH:mm')}
                                                    </th>
                                            :
                                                cell.column.id === 'llenado' ?
                                                    <th 
                                                        className="border px-4 py-2"
                                                        {...cell.getCellProps()}
                                                    >
                                                        {cell.row.original.llenado ? '✔' : '✘'}
                                                    </th>            
                                            :                                                
                                                cell.column.id === 'observaciones' ?
                                                    <MostrarObser observaciones={cell.row.original.observaciones} />
                                            :
                                                <th 
                                                    className="border px-4 py-2"
                                                    {...cell.getCellProps()}
                                                >
                                                    {cell.render('Cell')}
                                                </th>}   
                                        </Fragment>
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
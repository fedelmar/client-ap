import React, { useMemo, useState, Fragment }  from 'react';
import { useTable, useFilters, useSortBy } from "react-table";
import { format } from 'date-fns';
import columnas from './columns';
import EliminarRegistro from './EliminarRegistro';

const Table = ({registros, filtros}) => {

    const [filtroProveedor, setFiltroProveedor] = useState("");
    const [filtroRemito, setFiltroRemito] = useState("");
    const [filtroLote, setFiltroLote] = useState("");
    const [filtroInsumo, setFiltroInsumo] = useState("");
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

    const handleFilterChangeProveedor = e => {
        const value = e.target.value || undefined;
        setFilter("proveedor", value);
        setFiltroProveedor(value);
    };

    const handleFilterChangeLote = e => {
        const value = e.target.value || undefined;
        setFilter("lote", value);
        setFiltroLote(value);
    };

    const handleFilterChangeInsumo = e => {
        const value = e.target.value || undefined;
        setFilter("insumo", value);
        setFiltroInsumo(value);
    };

    const handleFilterChangeRemito = e => {
        const value = e.target.value || undefined;
        setFilter("remito", value);
        setFiltroRemito(value);
    };

    return (
        <div className="overflow-x-scroll">

            {filtros ? 
                <div className="flex justify-between">
                    <input
                        className="p-1 border rounded border-gray-800"
                        value={filtroInsumo}
                        onChange={handleFilterChangeInsumo}
                        placeholder={"Buscar Insumo"}
                    />
                    <input
                        className="p-1 border rounded border-gray-800"
                        value={filtroLote}
                        onChange={handleFilterChangeLote}
                        placeholder={"Buscar Lote"}
                    />
                    <input
                        className="p-1 border rounded border-gray-800"
                        value={filtroProveedor}
                        onChange={handleFilterChangeProveedor}
                        placeholder={"Buscar Proveedor"}
                    />
                    <input
                        className="p-1 border rounded border-gray-800"
                        value={filtroRemito}
                        onChange={handleFilterChangeRemito}
                        placeholder={"Buscar Remito"}
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
                                    className={"w-1/8 py-2"} 
                                    {...column.getHeaderProps()}
                                >                              
                                    {column.render('Header')}
                                            
                                </th>
                            :
                                <th 
                                    key={column.id}
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
                            <tr key={row.id} {...row.getRowProps()}>
                                {row.cells.map(cell => {
                                    return (
                                        <Fragment key={cell.row.original.id.concat(cell.column.Header)}>
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
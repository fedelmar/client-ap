import React, { useEffect, useMemo, useState }  from 'react';
import { useTable, useFilters, useSortBy } from "react-table";
import { format } from 'date-fns';
import EliminarRegistro from './EliminarRegistro';
import columnas from './columns';

const Table = ({registros, filtros, rol}) => {

    const [filtroCliente, setFiltroCliente] = useState("");
    const [filtroRemito, setFiltroRemito] = useState("");
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
        if (rol && rol !== 'Admin') toggleHideColumn('eliminar')            
    },[rol])

    const {
        getTableProps,
        getTableBodyProps,
        headers,
        rows,
        prepareRow,
        setFilter,
        toggleHideColumn
    } = tableInstance;

    const handleFilterChangeCliente = e => {
        const value = e.target.value || undefined;
        setFilter("cliente", value);
        setFiltroCliente(value);
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
                        value={filtroCliente}
                        onChange={handleFilterChangeCliente}
                        placeholder={"Buscar Cliente"}
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
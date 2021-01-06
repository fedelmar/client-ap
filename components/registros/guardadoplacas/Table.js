import React, { useEffect, useMemo, useState } from 'react';
import { useTable, useFilters, useSortBy } from "react-table";
import { format } from 'date-fns';
import Router from 'next/router';
import MostrarObser from '../MostrarObser';
import EliminarRegistro from './EliminarRegistro';
import columnas from './columns';

const Table = ({registros, filtros, rol}) => {

    const [filtroLote, setFiltroLote] = useState("");
    const [filtroOperario, setFiltroOperario] = useState("");
    const [filtroProducto, setFiltroProducto] = useState("");
    const columns = useMemo(
        () => columnas, 
        []
    );
    const tableInstance = useTable(
        { columns, data: registros }, 
        useFilters, 
        useSortBy
    )
    useEffect(() => {
        if (rol && rol !== 'Admin') {
            toggleHideColumn('eliminar');
            toggleHideColumn('editar');
        };
        if (registros.every(i => i.estado === true)) {
            toggleHideColumn('descarte');
            toggleHideColumn('guardado');
            toggleHideColumn('pallet');
        }                 
    },[rol])

    
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
    
    const handleFilterChangeProducto = e => {
        const value = e.target.value || undefined;
        setFilter("producto", value);
        setFiltroProducto(value);
    };
    
    const handleFilterChangeOperario = e => {
        const value = e.target.value || undefined;
        setFilter("operario", value);
        setFiltroOperario(value);
    };

    const retomarRegistro = id => {
        Router.push({
            pathname: "/registros/guardadoplacas/finalizarRegistro/[id]",
            query: { id }
        })
    }
    
    const editarRegistro = id => {
        Router.push({
            pathname: "/registros/guardadoplacas/editarRegistro/[id]",
            query: { id }
        })
    }

    return (
        <div className="overflow-x-scroll">
            {filtros ? 
                <div className="flex justify-between">
                    <input
                        className="p-1 border rounded border-gray-800"
                        value={filtroLote}
                        onChange={handleFilterChangeLote}
                        placeholder={"Buscar Lote"}
                    />
                    <input
                        className="p-1 border rounded border-gray-800"
                        value={filtroProducto}
                        onChange={handleFilterChangeProducto}
                        placeholder={"Buscar Producto"}
                    />
                    <input
                        className="p-1 border rounded border-gray-800"
                        value={filtroOperario}
                        onChange={handleFilterChangeOperario}
                        placeholder={"Buscar Operario"}
                    />
                </div>
            : null}

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
                                        className={column.id === 'horario' ? "w-2/12 py-2" : "w-1/12 py-2"} 
                                        {...column.getHeaderProps()}
                                    >                              
                                        {column.render('Header')}
                                                
                                    </th>                             
                        
                            :
                                column.id === 'guardado' ||
                                column.id === 'pallet' ||
                                column.id === 'descarte'
                                ?
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
                            <tr  {...row.getRowProps()}>
                                {row.cells.map(cell => { 
                                    return (
                                        <>
                                            {cell.column.id === 'eliminar' && rol === "Admin" ?
                                                <EliminarRegistro props={cell.row.original.id} />
                                            : 
                                                cell.column.id === 'observaciones' ?
                                                    cell.row.original.estado === false ?
                                                        cell.row.original.auxiliar ?              
                                                            <MostrarObser observaciones={cell.row.original.observaciones + " | Auxiliares: " + cell.row.original.auxiliar} />
                                                        :
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
                                                cell.column.id === 'fecha' ?
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
                                                cell.column.id === 'editar' ?
                                                    <th 
                                                        className="border px-5"
                                                        {...cell.getCellProps()}
                                                    >
                                                        <button
                                                            type="button"
                                                            className="flex justify-center items-center bg-green-600  py-2 px-1 w-full text-white rounded text-xs uppercase font-bold"
                                                            onClick={() => editarRegistro(cell.row.original.id)}
                                                        >
                                                            <svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" className="w-4 h-4"><path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
                                                        </button>                                                 
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
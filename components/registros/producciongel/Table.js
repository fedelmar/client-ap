import React, {Fragment, useMemo, useEffect, useState} from 'react';
import { useTable, useFilters, useSortBy } from "react-table";
import { format } from 'date-fns';
import Router from 'next/router';
import EliminarRegistro from './EliminarRegistro';
import MostrarObser from '../MostrarObser';
import { PRODUCCION_GEL } from '../../../constants/ProduccionGel';

const { columnas } = PRODUCCION_GEL;

const Table = ({registros, rol, filtros }) => {

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
    );

    useEffect(() => {
        if (rol && rol !== 'Admin') {
            toggleHideColumn('eliminar')
            toggleHideColumn('editar')
        };
        if (registros.every(i => i.estado === true)) {
            toggleHideColumn('cantDescarte');
            toggleHideColumn('cantProducida');
        };           
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

    const editarRegistro = id => {
        Router.push({
            pathname: `/registros/producciongel/editarRegistro/${id}`,
        })
    };

    const retomarRegistro = registro => {
        const { dobleBolsa, loteBolsaCristal, id } = registro;
        if (loteBolsaCristal !== null) {
            Router.push({
                pathname: `/registros/producciongel/dobleRegistro/finalizar/${id}`,
            })
        } else if (dobleBolsa) {
            Router.push({
                pathname: `/registros/producciongel/dobleRegistro/finalizar/${id}`,
            })
        } else {
            Router.push({
                pathname: `/registros/producciongel/finalizarRegistro/${id}`,
            })
        }
    };

    return (
        <div className="overflow-x-scroll">
            {filtros ? 
                <div className="flex justify-between mt-1">
                    <input
                        className="p-1 border rounded border-gray-800"
                        value={filtroLote}
                        onChange={handleFilterChangeLote}
                        placeholder={"Buscar Lote"}
                        autoFocus
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

                <tbody 
                    className="bg-white"
                    {...getTableBodyProps()}
                >
                    {rows.map(row => {
                        prepareRow(row)
                        return (
                            <tr key={row.id} {...row.getRowProps()}>
                                {row.cells.map(cell => {
                                    return(
                                        <Fragment key={cell.row.original.id + cell.column.Header}>
                                            {cell.column.id === 'eliminar' ?
                                                <EliminarRegistro props={cell.row.original.id} />
                                            : cell.column.id === 'creado' ?
                                                <th 
                                                    className="border px-4 py-2"
                                                    {...cell.getCellProps()}
                                                >
                                                    {format(new Date(cell.row.original.creado), 'dd/MM/yy')}
                                                </th>
                                            : cell.column.id === 'horario' ?
                                                <th 
                                                    className="border px-4 py-2"
                                                    {...cell.getCellProps()}
                                                >
                                                    De {format(new Date(cell.row.original.creado), 'HH:mm')} a 
                                                    {cell.row.original.modificado ?
                                                        format(new Date(cell.row.original.modificado), ' HH:mm')
                                                    : ' finalizar'}
                                                </th>
                                            : cell.column.id === 'dobleBolsa' || cell.column.id === 'manta' ?
                                                    <th 
                                                        className="border px-4 py-2"
                                                        {...cell.getCellProps()}
                                                    >
                                                        {cell.column.id === 'dobleBolsa' ?
                                                            cell.row.original.dobleBolsa ? '✔' : '✘'
                                                        : cell.row.original.manta ? '✔' : '✘'}
                                                    </th>  
                                            : cell.column.id === 'observaciones' ?
                                                cell.row.original.estado === false ?
                                                    <MostrarObser 
                                                        observaciones={cell.row.original.observaciones +
                                                            " | Puesto 1: " + cell.row.original.puesto1 + 
                                                            " | Puesto 2: " + cell.row.original.puesto2} 
                                                    />
                                                :   <th 
                                                        className="border px-4 py-2"
                                                        {...cell.getCellProps()}
                                                    >
                                                        <button
                                                                type="button"
                                                                className="flex justify-center items-center bg-green-600 py-2 px-4 w-full text-white rounded text-xs uppercase font-bold"
                                                                onClick={() => retomarRegistro(cell.row.original)}
                                                        >
                                                            Continuar
                                                        </button>  
                                                    </th> 
                                            :
                                            cell.column.id === 'cantDescarte' ?
                                            <th 
                                                className="border px-4 py-2"
                                                {...cell.getCellProps()}
                                            >
                                                {`Simple: ${cell.row.original.cantDescarte}`}
                                                {cell.row.original.cantDescarteBolsaCristal ?
                                                 ` - Cristal: ${cell.row.original.cantDescarteBolsaCristal}`: null}
                                            </th>
                                        :
                                            cell.column.id === 'loteBolsa' ?
                                                <th 
                                                    className="border px-4 py-2"
                                                    {...cell.getCellProps()}
                                                >
                                                    {`Simple: ${cell.row.original.loteBolsa}`}
                                                    {cell.row.original.loteBolsaCristal ?
                                                     ` - Cristal: ${cell.row.original.loteBolsaCristal}`: null}
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
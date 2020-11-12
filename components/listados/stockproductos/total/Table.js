import React, { useEffect, useMemo, useState } from 'react';
import { useTable, useFilters, useSortBy } from "react-table";
import columnas from './columns';

const Table = ({registros, filtros}) => {

    //const [filtroLote, setFiltroLote] = useState("");
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
    } = tableInstance;

    /* const handleFilterChangeLote = e => {
        const value = e.target.value || undefined;
        setFilter("lote", value);
        setFiltroLote(value);
    };*/

    return (
        <div className="overflow-x-scroll">
            {/*filtros ? 
                <input
                    className="p-1 border rounded border-gray-800"
                    value={filtroLote}
                    onChange={handleFilterChangeLote}
                    placeholder={"Buscar Lote"}
                />
            : null*/}

            <table className="table-auto shadow-md mt-2 w-full w-lg">
                <thead className="bg-gray-800">
                    <tr className="text-white">
                        {headers.map(column => (
                            <th 
                                className={column.id === 'horario' ? "w-2/12 py-2" : "w-1/12 py-2"} 
                                {...column.getHeaderProps()}
                            >                              
                                {column.render('Header')}
                                        
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
                                        <th 
                                            className="border px-4 py-2"
                                            {...cell.getCellProps()}
                                        >
                                            {cell.render('Cell')}
                                        </th>
                                       
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

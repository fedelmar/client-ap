import React, { useMemo, Fragment } from 'react';
import { useTable, useSortBy } from "react-table";
import columnas from './columns';
import Producto from '../../listados/stockproductos/Producto';

const Table = ({registros}) => {

    const columns = useMemo(
        () => columnas,
        []
    );    
    const tableInstance = useTable(
        { columns, data: registros }, 
        useSortBy
    );

    const {
        getTableBodyProps,
        headers,
        rows,
        prepareRow,
    } = tableInstance;

    return (
        <div className="overflow-x-scroll">
            <table className="table-auto shadow-md mt-2 w-full w-lg">
                <thead className="bg-gray-800">
                    <tr className="text-white">
                        {headers.map(column => (
                            <th 
                                key={column.id}
                                className="w-1/3 py-2" 
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
                            <tr key={row.id}{...row.getRowProps()}>
                                {row.cells.map(cell => {
                                    return (
                                        <Fragment key={cell.row.original.id.concat(cell.column.Header)}>
                                            {cell.column.id === 'producto' ?
                                                <Producto id={cell.value} />
                                            :
                                                <th 
                                                    className="border px-4 py-2"
                                                    {...cell.getCellProps()}
                                                >
                                                    {cell.render('Cell')}
                                                </th>
                                            }
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

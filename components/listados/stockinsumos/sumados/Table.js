import React, { useMemo, useState } from "react";
import { useTable, useFilters, useSortBy } from "react-table";
import { Fragment } from "react/cjs/react.production.min";

import columnas from "./columns";

const Table = ({ registros, filtros }) => {
  const [filtroInsumo, setFiltroInsumo] = useState("");
  const columns = useMemo(() => columnas, []);
  const tableInstance = useTable(
    { columns, data: registros },
    useFilters,
    useSortBy
  );

  const { getTableBodyProps, headers, rows, prepareRow, setFilter } =
    tableInstance;

  const handleFilterChangeInsumo = (e) => {
    const value = e.target.value || undefined;
    setFilter("insumo", value);
    setFiltroInsumo(value);
  };

  return (
    <div className="overflow-x-scroll">
      {filtros ? (
        <input
          className="p-1 border rounded border-gray-800"
          value={filtroInsumo}
          onChange={handleFilterChangeInsumo}
          placeholder={"Buscar insumo"}
        />
      ) : null}

      <table className="table-auto shadow-md mt-2 w-full w-lg">
        <thead className="bg-gray-800">
          <tr className="text-white">
            {headers.map((column) => (
              <th
                className="w-1/12 py-2"
                {...column.getHeaderProps(column.getSortByToggleProps())}
              >
                {column.render("Header")}
                <span>
                  {column.isSorted ? (column.isSortedDesc ? " ▽" : " △") : ""}
                </span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white" {...getTableBodyProps()}>
          {rows.map((row) => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map((cell) => {
                  console.log(cell.row.original);
                  return (
                    <Fragment key={cell.row.original.id}>
                      {cell.column.id === "cantidad" &&
                      (cell.row.original.categoria === "Esponjas" ||
                        cell.row.original.categoria === "Polietileno") &&
                      cell.row.original.cantidad < 1000 ? (
                        <th
                          className="border px-4 py-2 text-red-600"
                          {...cell.getCellProps()}
                        >
                          {cell.render("Cell")}
                        </th>
                      ) : (
                        <th
                          className="border px-4 py-2"
                          {...cell.getCellProps()}
                        >
                          {cell.render("Cell")}
                        </th>
                      )}
                    </Fragment>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default Table;

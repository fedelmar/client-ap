import React, { useMemo, useState, Fragment } from "react";
import { useTable, useFilters, useSortBy } from "react-table";
import { format } from "date-fns";
import EliminarRegistro from "./EliminarRegistro";
import MostrarObser from "../MostrarObser";
import { PREPARACION_GEL } from "../../../constants/PreparacionGel";
import Router from "next/router";

const { columnas } = PREPARACION_GEL;

const Table = ({ registros, filtros, rol }) => {
  const [filtroLote, setFiltroLote] = useState("");
  const columns = useMemo(() => columnas, []);
  const tableInstance = useTable(
    { columns, data: registros },
    useFilters,
    useSortBy
  );

  const { getTableBodyProps, headers, rows, prepareRow, setFilter } =
    tableInstance;

  const handleFilterChangeLote = (e) => {
    const value = e.target.value || undefined;
    setFilter("lote", value);
    setFiltroLote(value);
  };

  const editarRegistro = id => {
    Router.push({
        pathname: `/registros/preparaciongel/editarRegistro/${id}`,
    })
};

  return (
    <div className="overflow-x-scroll">
      {filtros ? (
        <div className="flex justify-between">
          <input
            className="p-1 border rounded border-gray-800"
            value={filtroLote}
            onChange={handleFilterChangeLote}
            placeholder={"Buscar Lote"}
            autoFocus
          />
        </div>
      ) : null}

      <table className="table-auto shadow-md w-full w-lg">
        <thead className="bg-gray-800">
          <tr className="text-white">
            {headers.map((column) =>
              column.id === "eliminar" ? (
                <th
                  key={column.id}
                  className={"w-1/9 py-2"}
                  {...column.getHeaderProps()}
                >
                  {column.render("Header")}
                </th>
              ) : (
                <th
                  key={column.id}
                  className={"w-1/9 py-2"}
                  {...column.getHeaderProps(column.getSortByToggleProps())}
                >
                  {column.render("Header")}
                  <span>
                    {column.isSorted ? (column.isSortedDesc ? " ▽" : " △") : ""}
                  </span>
                </th>
              )
            )}
          </tr>
        </thead>
        <tbody className="bg-white" {...getTableBodyProps()}>
          {rows.map((row) => {
            prepareRow(row);
            return (
              <tr key={row.id} {...row.getRowProps()}>
                {row.cells.map((cell) => {
                  return (
                    <Fragment key={cell.row.original.id + cell.column.Header}>
                      {cell.column.id === "eliminar" ? (
                        <EliminarRegistro props={cell.row.original.id} />
                      ) : cell.column.id === "fecha" ? (
                        <th
                          className="border px-4 py-2"
                          {...cell.getCellProps()}
                        >
                          {format(
                            new Date(cell.row.original.creado),
                            "dd/MM/yy"
                          )}
                        </th>
                      ) : cell.column.id === "hora" ? (
                        <th
                          className="border px-4 py-2"
                          {...cell.getCellProps()}
                        >
                          {format(new Date(cell.row.original.creado), "HH:mm")}
                        </th>
                      ) : cell.column.id === "llenado" ? (
                        <th
                          className="border px-4 py-2"
                          {...cell.getCellProps()}
                        >
                          {cell.row.original.llenado ? "✔" : "✘"}
                        </th>
                      ) : cell.column.id === "observaciones" ? (
                        <MostrarObser
                          observaciones={cell.row.original.observaciones}
                        />
                      ) : cell.column.id === "editar" ? (
                        <th className="border px-5" {...cell.getCellProps()}>
                          <button
                            type="button"
                            className="flex justify-center items-center bg-green-600  py-2 px-1 w-full text-white rounded text-xs uppercase font-bold"
                            onClick={() => editarRegistro(cell.row.original.id)}
                          >
                            <svg
                              fill="none"
                              stroke="currentColor"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              viewBox="0 0 24 24"
                              className="w-4 h-4"
                            >
                              <path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                            </svg>
                          </button>
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

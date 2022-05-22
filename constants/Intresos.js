import { format } from "date-fns";

const INGRESOS = {
  export: {
    head: [["Fecha", "Insumo", "Cantidad", "Remito", "Proveedor", "Lote"]],
    regFormat: (registro) => [
      format(new Date(registro.creado), "dd/MM/yy"),
      registro.insumo,
      registro.cantidad,
      registro.remito,
      registro.proveedor,
      registro.lote,
    ],
    title: "REGISTRO DE INGREO DE INSUMOS",
    fileName: "Ingresos.pdf",
  },
  columnas: [
    {
      Header: "Fecha",
      accessor: "fecha",
    },
    {
      Header: "Insumo",
      accessor: "insumo",
    },
    {
      Header: "Cantidad",
      accessor: "cantidad",
    },
    {
      Header: "Remito",
      accessor: "remito",
    },
    {
      Header: "Proveedor",
      accessor: "proveedor",
    },
    {
      Header: "Lote",
      accessor: "lote",
    },
    {
      Header: "Editar",
      accessor: "editar",
    },
    {
      Header: "Eliminar",
      accessor: "eliminar",
    },
  ],
};

export { INGRESOS };

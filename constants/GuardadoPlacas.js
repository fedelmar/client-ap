import { format } from "date-fns";

const GUARDADO_PLACAS = {
  export: {
    head: [
      [
        "Fecha",
        "Operario",
        "Lote",
        "Inicio",
        "Cierre",
        "Producto",
        "Pallet",
        "Placas",
        "Descarte",
        "Observaciones",
      ],
    ],
    regFormat: (registro) => [
      format(new Date(registro.creado), "dd/MM/yy"),
      registro.operario,
      registro.lote,
      format(new Date(registro.creado), "HH:mm"),
      format(new Date(registro.modificado), "HH:mm"),
      registro.producto,
      registro.pallet,
      registro.guardado,
      registro.descarte,
      registro.observaciones,
    ],
    title: "REGISTRO DE GUARDADO DE PLACAS",
    fileName: "Guardado Placas.pdf",
  },
  columnas: [
    {
      Header: "Fecha",
      accessor: "fecha",
    },
    {
      Header: "Horario",
      accessor: "horario",
    },
    {
      Header: "Producto",
      accessor: "producto",
    },
    {
      Header: "Lote",
      accessor: "lote",
    },
    {
      Header: "Pallet",
      accessor: "pallet",
    },
    {
      Header: "Placas",
      accessor: "guardado",
    },
    {
      Header: "Descarte",
      accessor: "descarte",
    },
    {
      Header: "Operario",
      accessor: "operario",
    },
    {
      Header: "Observaciones",
      accessor: "observaciones",
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

export { GUARDADO_PLACAS };

import { format } from "date-fns";

const SALIDAS = {
  export: {
    head: [["Fecha", "Remito", "Cliente", "Lote", "Producto", "Cantidad"]],
    regFormat: (registro) => [
      format(new Date(registro.fecha), 'dd/MM/yy'),
      registro.remito,
      registro.cliente,
      registro.lotes.map(a => 
          `${a.lote}\n`
      ),
      registro.lotes.map(a => 
          `${a.producto}\n`
      ),
      registro.lotes.map(a => 
          `${a.cantidad} \n`
      )
    ],
    title: "REGISTRO DE SALIDA DE PRODUCTOS",
    fileName: "Salidas.pdf",
  },
  columnas: [
    {
      Header: 'Fecha',
      accessor: 'fecha',
    },
    {
      Header: 'Cliente',
      accessor: 'cliente',
    },
    {
      Header: 'Remito',
      accessor: 'remito',
    },
    {
      Header: 'Lotes',
      accessor: 'lotes',
    },
    {
      Header: 'Eliminar',
      accessor: 'eliminar',
    },
  ],
};

export { SALIDAS };

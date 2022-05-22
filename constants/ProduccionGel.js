import { format } from 'date-fns';

const PRODUCCION_GEL = {
  export: {
    head: [
      ['Fecha',
      'Lote',
      "Inicio",
      "Cierre",
      "Operario",
      "Producto",
      "Cliente",
      "Bolsa",
      "Gel",
      "DB",
      "M",
      "Prod.",
      "Descarte",
      "P1",
      "P2",
      "Observaciones"]
    ],
    regFormat: (registro) => [
      format(new Date(registro.creado), 'dd/MM/yy'),
      registro.lote,
      format(new Date(registro.creado), 'HH:mm'),
      format(new Date(registro.modificado), 'HH:mm'),
      registro.operario,
      registro.producto,
      registro.cliente,
      registro.loteBolsa,
      registro.loteGel,
      registro.dobleBolsa === true ? "SI" : "NO",
      registro.manta === true ? "SI" : "NO",
      registro.cantProducida,
      registro.cantDescarte,
      registro.puesto1,
      registro.puesto2,
      registro.observaciones
  ],
    title: 'REGISTRO DE PRODUCCION DE BOLSAS DE GEL',
    fileName: 'Produccion Gel.pdf',
  },
  columnas: [
    {
      Header: 'Fecha',
      accessor: 'creado',
    },
    {
      Header: 'Operario',
      accessor: 'operario',
    },
    {
      Header: 'Lote',
      accessor: 'lote',
    },
    {
        Header: 'Cliente',
        accessor: 'cliente'
    },
    {
      Header: 'Horario',
      accessor: 'horario',
    },
    {
      Header: 'Producto',
      accessor: 'producto',
    },
    {
        Header: 'Bolsa',
        accessor: 'loteBolsa',
    },
    {
        Header: 'Gel',
        accessor: 'loteGel',
    },
    {
        Header: 'DB',
        accessor: 'dobleBolsa',
    },
    {
        Header: 'M',
        accessor: 'manta',
    },    
    {
      Header: 'Produccion',
      accessor: 'cantProducida',
    },
    {
      Header: 'Descarte',
      accessor: 'cantDescarte',
    },
    {
      Header: 'Observaciones',
      accessor: 'observaciones',
    },
    {
      Header: 'Editar',
      accessor: 'editar',
    },
    {
      Header: 'Eliminar',
      accessor: 'eliminar',
    },
  ],
}

export {
  PRODUCCION_GEL,
}

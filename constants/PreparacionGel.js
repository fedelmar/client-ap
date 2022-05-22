import { format } from 'date-fns';

const PREPARACION_GEL = {
  export: {
    head: [
      ['Fecha',
      'Lote',
      "Hora",
      "Llenado",
      "Cantidad",
      "Lote Insumo",
      "Tanque Nº",
      "Operario",
      "Observaciones"]
    ],
    regFormat: (registro) => [
      format(new Date(registro.creado), 'dd/MM/yy'),
      registro.lote,
      format(new Date(registro.creado), 'HH:mm'),
      registro.llenado === true ? "SI" : "NO",
      registro.cantidad,
      registro.loteInsumo,
      registro.tanque,
      registro.operario,
      registro.observaciones
  ],
    title: 'REGISTRO DE PREPARACION DE GEL',
    fileName: 'Preparado Gel.pdf',
  },
  columnas: [
    {
      Header: 'Fecha',
      accessor: 'fecha',
    },
    {
        Header: 'Lote',
        accessor: 'lote',
    },
    {
        Header: 'Hora',
        accessor: 'hora',
    },
    {
      Header: 'Llenado',
      accessor: 'llenado',
    },
    {
      Header: 'Cantidad',
      accessor: 'cantidad',
    },
    {
      Header: 'Lote Insumo',
      accessor: 'loteInsumo',
    },
    {
      Header: 'Tanque Nº',
      accessor: 'tanque',
    },
    {
      Header: 'Operario',
      accessor: 'operario',
    },
    {
      Header: 'Observaciones',
      accessor: 'observaciones',
    },
    {
      Header: 'Eliminar',
      accessor: 'eliminar'
    },
  ],
}

export {
  PREPARACION_GEL,
}

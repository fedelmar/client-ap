import { format } from 'date-fns';

const PRODUCCION_PLACAS = {
  export: {
    head: [
      ['Fecha',
      'Operario',
      'Lote',
      "Inicio",
      "Cierre",
      "Producto",
      "Placa", 
      "Tapón",
      "PCM",
      "Produccion",
      "Descarte",
      "Observaciones"]
    ],
    regFormat: (registro) => [
      format(new Date(registro.creado), 'dd/MM/yy'),
      registro.operario,
      registro.lote,
      format(new Date(registro.creado), 'HH:mm'),
      format(new Date(registro.modificado), 'HH:mm'),
      registro.producto,
      registro.lPlaca,
      registro.lTapon,
      registro.lPcm,
      registro.cantProducida,
      registro.cantDescarte,
      registro.observaciones
  ],
    title: 'REGISTRO DE PRODUCCIÓN DE PLACAS',
    fileName: 'Produccion Placas.pdf',
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
      Header: 'Horario',
      accessor: 'horario',
    },
    {
      Header: 'Producto',
      accessor: 'producto',
    },
    {
      Header: 'Llenado',
      accessor: 'llenado',
    },
    {
      Header: 'Placa LI/LP',
      accessor: 'lPlaca',
    },
    {
      Header: 'Tapón',
      accessor: 'lTapon',
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
  PRODUCCION_PLACAS,
}

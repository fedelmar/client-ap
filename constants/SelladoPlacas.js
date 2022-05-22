import { format } from 'date-fns';

const SELLADO_PLACAS = {
  export: {
    head: [
      ['Fecha',
      'Operario',
      'Lote',
      "Inicio",
      "Cierre",
      "Producto",
      "Placas",
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
      registro.sellado,
      registro.descarte,
      registro.observaciones
  ],
    title: 'REGISTRO DE SELLADO DE PLACAS',
    fileName: 'Sellado Placas.pdf',
  },
  columnas: [
    {
      Header: 'Fecha',
      accessor: 'fecha',
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
      Header: 'Lote',
      accessor: 'lote',
    },
    {
      Header: 'Placas',
      accessor: 'sellado',
    },
    {
      Header: 'Descarte',
      accessor: 'descarte',
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
  SELLADO_PLACAS,
}

import { format } from 'date-fns';

const PRODUCCION_ESPONJAS = {
  export: {
    head: [
      ['Fecha',
      'Operario',
      'Lote',
      "Inicio",
      "Cierre",
      "Producto",
      "Bolsa", 
      "Esponja",
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
      registro.lBolsa,
      registro.lEsponja,
      registro.cantProducida,
      registro.descarte,
      registro.observaciones
    ],
    title: 'REGISTRO DE PRODUCCIÓN DE ESPONJAS',
    fileName: 'Produccion Esponjas.pdf',
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
      Header: 'Lote Bolsa',
      accessor: 'lBolsa',
    },
    {
      Header: 'Lote Esponja',
      accessor: 'lEsponja',
    },
    {
      Header: 'Produccion',
      accessor: 'cantProducida',
    },
    {
      Header: 'Descarte',
      accessor: 'descarte',
    },    
    {
      Header: 'D. Bolsa',
      accessor: 'descarteBolsa',
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
  PRODUCCION_ESPONJAS,
}
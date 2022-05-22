import { format } from 'date-fns';

const GUARDADO_ESPONJAS = {
  export: {
    head: [
      ['Fecha',
      'Operario',
      'Lote',
      "Inicio",
      "Cierre",
      "Producto",
      "Caja", 
      "Esponjas",
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
      registro.caja,
      registro.guardado,
      registro.descarte,
      registro.observaciones
  ],
    title: 'REGISTRO DE GUARDADO DE ESPONJAS',
    fileName: 'Guardado Esponjas.pdf',
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
      Header: 'Tipo de Caja',
      accessor: 'caja',
    },
    {
      Header: 'Descarte de caja',
      accessor: 'descCajas',
    },
    {
      Header: 'Esponjas',
      accessor: 'guardado',
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
  GUARDADO_ESPONJAS,
}
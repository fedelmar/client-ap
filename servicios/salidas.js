import { gql } from '@apollo/client'

const LISTA_REGISTROS = gql`
  query obtenerRegistrosSalidas($page: Int) {
    obtenerRegistrosSalidas(page: $page) {
      id
      fecha
      cliente
      remito
      lotes {
        producto
        lote
        cantidad
      }
    }
  }
`

const LISTA_REGISTROS_POR_FECHA = gql`
  query getRegsByDateSalidas($input: DateRange!) {
    getRegsByDateSalidas(input: $input) {
      id
      fecha
      cliente
      remito
      lotes {
        producto
        lote
        cantidad
      }
    }
  }
`

const NUEVA_SALIDA = gql`
  mutation nuevoRegistroSalida($input: SalidaInput) {
    nuevoRegistroSalida(input: $input) {
      id
      fecha
      cliente
      remito
      lotes {
        lote
        producto
        cantidad
      }
    }
  }
`

const EDITAR_SALIDA = gql`
  mutation actualizarRegistroSalida($id: ID!, $input: SalidaInput) {
    actualizarRegistroSalida(id: $id, input: $input) {
      id
      fecha
      cliente
      remito
      lotes {
        lote
        producto
        cantidad
      }
    }
  }
`

const OBTENER_REGISTRO = gql`
  query obtenerRegistroSalida($id: ID!) {
    obtenerRegistroSalida(id: $id) {
      id
      fecha
      cliente
      remito
      lotes {
        producto
        lote
        cantidad
      }
    }
  }
`

export {
  LISTA_REGISTROS,
  LISTA_REGISTROS_POR_FECHA,
  NUEVA_SALIDA,
  OBTENER_REGISTRO,
  EDITAR_SALIDA
}

import { gql } from "@apollo/client";

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
`;

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
`;

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
`;

export { LISTA_REGISTROS, LISTA_REGISTROS_POR_FECHA, NUEVA_SALIDA };

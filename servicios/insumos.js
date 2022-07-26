import { gql } from "@apollo/client";

const OBTENER_STOCK_CATEGORIA = gql`
  query obtneterStockInsumosPorCategoria($input: String!) {
    obtneterStockInsumosPorCategoria(input: $input) {
      id
      insumo
      insumoID
      cantidad
      lote
    }
  }
`;

const OBTENER_INSUMOS_FALTANTES = gql`
  query obtenerInsumosFaltantes {
    obtenerInsumosFaltantes {
      insumo
      cantidad
      categoria
    }
  }
`;

export { OBTENER_STOCK_CATEGORIA, OBTENER_INSUMOS_FALTANTES };

import { gql } from '@apollo/client';

const OBTENER_STOCK_CATEGORIA = gql `
    query obtneterStockInsumosPorCategoria($input: String!){
        obtneterStockInsumosPorCategoria(input: $input) {
            id
            insumo
            insumoID
            cantidad
            lote
        }
    }
`;


export {
  OBTENER_STOCK_CATEGORIA,
};

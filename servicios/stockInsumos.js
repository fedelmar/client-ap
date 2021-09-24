import { gql } from '@apollo/client';

const LOTE_INSUMO = gql `
    query obtenerInsumoPorLote($input: String!){
        obtenerInsumoPorLote(input: $input){
            id
            cantidad
            insumo
        }
    }
`;

export {
  LOTE_INSUMO,
};

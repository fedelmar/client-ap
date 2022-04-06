import { gql } from '@apollo/client';

const LISTA_REGISTROS = gql `
    query obtenerRegistrosSalidas($page: Int){
        obtenerRegistrosSalidas(page: $page){
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

export {
  LISTA_REGISTROS,
};

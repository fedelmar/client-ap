import { gql } from '@apollo/client';

const LISTA_REGISTROS = gql `
    query obtenerRegistrosSalidas{
        obtenerRegistrosSalidas{
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

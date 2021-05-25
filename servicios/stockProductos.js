import { gql } from '@apollo/client';

const LOTES_PLACAS = gql `
    query obtenerStockPlacas{
        obtenerStockPlacas{
            lote
            loteID
            estado
            caja
            producto
            cantCaja
            cantidad
        }
    }
`;

const LOTES_PLACAS_EN_PROCESO = gql `
    query obtenerStockPlacasEnProceso{
        obtenerStockPlacasEnProceso{
            lote
            loteID
            estado
            caja
            producto
            cantCaja
            cantidad
        }
    }
`;

export {
  LOTES_PLACAS,
  LOTES_PLACAS_EN_PROCESO,
};

import { gql } from '@apollo/client';

const LOTE_PRODUCTO = gql `
    query	obtenerProductoStock($id: ID!){
        obtenerProductoStock(id: $id){
            id
            lote
            cantidad
            producto
            estado
        }
    }
`;

const OBTENER_PRODUCTO_POR_LOTE = gql `
    query	obtenerProductoStockPorLote($lote: String!){
        obtenerProductoStockPorLote(lote: $lote){
            id
            lote
            cantidad
            producto
            estado
        }
    }
`;

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

const OBTENER_PRODUCTOS_TERMINADOS = gql`
    query obtenerProductosTerminados{
        obtenerProductosTerminados{
            loteID
            lote
            producto
            cantidad
        }
    }
`;

export {
  LOTE_PRODUCTO,
  OBTENER_PRODUCTO_POR_LOTE,
  LOTES_PLACAS,
  LOTES_PLACAS_EN_PROCESO,
  OBTENER_PRODUCTOS_TERMINADOS,
};

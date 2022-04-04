import { gql } from '@apollo/client';

const LISTA_REGISTROS = gql `
    query obtenerRegistrosSP($page: Int){
        obtenerRegistrosSP(page: $page){
            id
            lote
            loteID
            producto
            operario
            sellado
            descarte
            auxiliar
            observaciones
            creado
            modificado
            estado
        }
    }
`;

const NUEVO_REGISTRO = gql `
    mutation nuevoRegistroSP($id: ID, $input: CSPInput){
        nuevoRegistroSP(id: $id, input: $input){
            id
            creado
            lote
            producto
            loteID
            sellado
            descarte
            operario
            auxiliar
            observaciones
            modificado
        }
    }
`;

const ELIMINAR_REGISTRO = gql `
    mutation eliminarRegistroSP($id: ID!){
        eliminarRegistroSP(id: $id)
    }
`;

const OBTENER_REGISTRO = gql `
    query obtenerRegistroSP($id: ID!){
        obtenerRegistroSP(id: $id){
            lote
            loteID
            producto
            operario
            sellado
            descarte
            auxiliar
            observaciones
            creado
            modificado
            estado
        }
    }
`;

const ACTUALIZAR_REGISTRO = gql `
    mutation actualizarRegistroSP($id: ID!, $input: CSPInput){
        actualizarRegistroSP(id: $id, input: $input){
            lote
            sellado
            descarte
        }
    }
`;

const LISTA_REGISTROS_ABIERTOS = gql `
    query obtenerRegistrosAbiertosSP{
        obtenerRegistrosAbiertosSP{
            id
            lote
            loteID
            producto
            operario
            sellado
            descarte
            auxiliar
            observaciones
            creado
            modificado
            estado
        }
    }
`;

export {
  LISTA_REGISTROS,
  NUEVO_REGISTRO,
  ELIMINAR_REGISTRO,
  OBTENER_REGISTRO,
  ACTUALIZAR_REGISTRO,
  LISTA_REGISTROS_ABIERTOS
};

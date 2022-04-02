import { gql } from '@apollo/client';

const REGISTRO = gql `
    query obtenerRegistroPP($id: ID!){
        obtenerRegistroPP(id: $id){
            creado
            modificado
            producto
            operario
            lote
            lTapon
            lPcm
            tipoPCM
            lPlaca
            cantDescarte
            cantProducida
            observaciones
            estado
        }
    }
`;

const ACTUALIZAR_REGISTRO = gql`
    mutation actualizarRegistroPP($id: ID!, $input: CPPInput){
            actualizarRegistroPP(id: $id, input: $input){
                lote
                cantDescarte
                cantProducida
                lTapon
                lPlaca
        }
    }
`;

const NUEVO_REGISTRO = gql `
    mutation nuevoRegistroPP($id: ID, $input: CPPInput){
        nuevoRegistroPP(id: $id, input: $input){
            id
            creado
            modificado
            operario
            lote
            producto
            lTapon
            lPcm
            lPcmID
            tipoPCM
            lPlaca
            cantProducida
            cantDescarte
            auxiliar
            observaciones
            estado
        }
    }
`;

const ELIMINAR_REGISTRO = gql `
    mutation eliminarRegistroPP($id: ID!){
        eliminarRegistroPP(id: $id)
    }
`;

const LISTA_REGISTROS = gql `
    query obtenerRegistrosPP($page: Int){
        obtenerRegistrosPP(page: $page){
            id
            creado
            modificado
            producto
            operario
            lote
            lTapon
            lPcm
            tipoPCM
            lPlaca
            cantDescarte
            cantProducida
            auxiliar
            observaciones
            estado
        }
    }
`;

const LISTA_REGISTROS_ABIERTOS = gql `
    query obtenerRegistrosAbiertosPP{
        obtenerRegistrosAbiertosPP{
            id
            creado
            modificado
            producto
            operario
            lote
            lTapon
            lPcm
            tipoPCM
            lPlaca
            cantDescarte
            cantProducida
            auxiliar
            observaciones
            estado
        }
    }
`;


export {
  REGISTRO,
  ACTUALIZAR_REGISTRO,
  ELIMINAR_REGISTRO,
  NUEVO_REGISTRO,
  LISTA_REGISTROS,
  LISTA_REGISTROS_ABIERTOS,
};

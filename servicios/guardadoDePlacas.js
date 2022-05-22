import { gql } from '@apollo/client';

const LISTA_REGISTROS = gql`
    query obtenerRegistrosGP($page: Int){
        obtenerRegistrosGP(page: $page){
            id
            creado
            modificado
            operario
            lote
            producto
            loteID
            guardado
            descarte
            pallet
            auxiliar
            observaciones
            estado
        }
    }
`;

const LISTA_REGISTROS_ABIERTOS = gql`
    query obtenerRegistrosAbiertosGP{
        obtenerRegistrosAbiertosGP{
            id
            creado
            modificado
            operario
            lote
            producto
            loteID
            guardado
            descarte
            pallet
            auxiliar
            observaciones
            estado
        }
    }
`;

const NUEVO_REGISTRO = gql`
    mutation nuevoRegistroGP($id: ID, $input: CGPInput){
        nuevoRegistroGP(id: $id, input: $input){
            id
            creado
            modificado
            operario
            lote
            producto
            loteID
            guardado
            descarte
            pallet
            auxiliar
            observaciones
            estado
        }
    }
`;

const ELIMINAR_REGISTRO = gql`
    mutation eliminarRegistroGP($id: ID!){
        eliminarRegistroGP(id: $id)
    }
`;

const OBTENER_REGISTRO = gql`
    query obtenerRegistroGP($id: ID!){
        obtenerRegistroGP(id: $id){
          creado
          modificado
          operario
          lote
          producto
          loteID
          guardado
          descarte
          pallet
          auxiliar
          observaciones
          estado
        }
    }
`;

const ACTUALIZAR_REGISTRO = gql`
    mutation actualizarRegistroGP($id: ID!, $input: CGPInput){
        actualizarRegistroGP(id: $id, input: $input){
            lote
            guardado
            descarte
        }
    }
`;

const LISTA_REGISTROS_POR_FECHA = gql`
    query getRegsByDateGP  ($input: DateRange!) {
        getRegsByDateGP(input: $input){
            id
            creado
            modificado
            operario
            lote
            producto
            loteID
            guardado
            descarte
            pallet
            auxiliar
            observaciones
            estado
        }
    }
`;



export {
  LISTA_REGISTROS,
  LISTA_REGISTROS_ABIERTOS,
  LISTA_REGISTROS_POR_FECHA,
  ELIMINAR_REGISTRO,
  NUEVO_REGISTRO,
  OBTENER_REGISTRO,
  ACTUALIZAR_REGISTRO,
};

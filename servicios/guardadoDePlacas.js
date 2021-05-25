import { gql } from '@apollo/client';

const LISTA_REGISTROS = gql`
    query obtnerRegistrosGP{
        obtenerRegistrosGP{
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

export {
  LISTA_REGISTROS,
  ELIMINAR_REGISTRO,
  NUEVO_REGISTRO,
  OBTENER_REGISTRO,
  ACTUALIZAR_REGISTRO,
};

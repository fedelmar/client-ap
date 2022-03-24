import { gql } from '@apollo/client';

const LISTA_REGISTROS = gql `
  query obtenerRegistrosPE($page: Int) {
      obtenerRegistrosPE(page: $page){
          id
          creado
          modificado
          operario
          lote
          producto
          lBolsa
          lEsponja
          cantProducida
          descarte
          descarteBolsa
          observaciones
          estado
      }
  }
`;

const LISTA_REGISTROS_ABIERTOS = gql `
  query obtenerRegistrosAbiertosPE {
      obtenerRegistrosAbiertosPE{
          id
          creado
          modificado
          operario
          lote
          producto
          lBolsa
          lEsponja
          cantProducida
          descarte
          descarteBolsa
          observaciones
          estado
      }
  }
`;

const ELIMINAR_REGISTRO = gql `
  mutation eliminarRegistroCE($id: ID!){
      eliminarRegistroCE(id: $id)
  }
`;


export {
  LISTA_REGISTROS,
  LISTA_REGISTROS_ABIERTOS,
  ELIMINAR_REGISTRO,
};

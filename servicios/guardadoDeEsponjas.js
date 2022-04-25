import { gql } from '@apollo/client';

const LISTA_REGISTROS = gql `
  query obtenerRegistrosGE($page: Int){
      obtenerRegistrosGE(page: $page){
              id
              creado
              modificado
              operario
              lote
              caja
              descCajas
              guardado
              descarte
              auxiliar
              observaciones
              producto
              estado
          }
      }
`;

const LISTA_REGISTROS_ABIERTOS = gql `
  query obtenerRegistrosAbiertosGE{
      obtenerRegistrosAbiertosGE{
              id
              creado
              modificado
              operario
              lote
              caja
              descCajas
              guardado
              descarte
              auxiliar
              observaciones
              producto
              estado
          }
      }
`;

const REGISTRO = gql `
    query obtenerRegistroGE($id: ID!){
        obtenerRegistroGE(id: $id){
            creado
            modificado
            operario
            lote
            caja
            descCajas
            guardado
            descarte
            auxiliar
            observaciones
            producto
        }
    }
`;

const ACTUALIZAR_REGISTRO = gql `
    mutation actualizarRegistroGE($id: ID!, $input: CGEInput){
        actualizarRegistroGE(id: $id, input: $input){
            lote
            guardado
            descarte
        }
    }
`;

const LISTA_REGISTROS_POR_FECHA = gql`
    query getRegsByDateGE($input: DateRange!) {
        getRegsByDateGE(input: $input){
            id
            creado
            modificado
            operario
            lote
            caja
            descCajas
            guardado
            descarte
            auxiliar
            observaciones
            producto
            estado
        }
    }
`

export {
  LISTA_REGISTROS,
  LISTA_REGISTROS_ABIERTOS,
  LISTA_REGISTROS_POR_FECHA,
  REGISTRO,
  ACTUALIZAR_REGISTRO,
};

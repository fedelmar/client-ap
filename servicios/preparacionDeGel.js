import { gql } from "@apollo/client";

const LISTA_REGISTROS = gql`
  query obtenerRegistrosPG {
    obtenerRegistrosPG {
      id
      creado
      lote
      llenado
      cantidad
      loteInsumo
      tanque
      operario
      observaciones
    }
  }
`;

const LISTA_REGISTROS_POR_FECHA = gql`
  query getRegsByDatePG($input: DateRange!) {
    getRegsByDatePG(input: $input) {
      id
      creado
      lote
      llenado
      cantidad
      loteInsumo
      tanque
      operario
      observaciones
    }
  }
`;

const OBTENER_REGISTRO = gql`
  query obtenerRegistroPG($id: ID!) {
    obtenerRegistroPG(id: $id) {
      id
      creado
      lote
      llenado
      cantidad
      loteInsumo
      tanque
      operario
      observaciones
    }
  }
`;

const ACTUALIZAR_REGISTRO = gql`
  mutation actualizarRegistroPG($id: ID!, $input: PGInput) {
    actualizarRegistroPG(id: $id, input: $input) {
      id
      creado
      lote
      llenado
      cantidad
      loteInsumo
      tanque
      operario
      observaciones
    }
  }
`;

export {
  LISTA_REGISTROS,
  LISTA_REGISTROS_POR_FECHA,
  OBTENER_REGISTRO,
  ACTUALIZAR_REGISTRO,
};

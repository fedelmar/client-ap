import { gql } from '@apollo/client';

const LISTA_REGISTROS = gql `
  query obtenerRegistrosIngresos{
    obtenerRegistrosIngresos{
      id
      insumo
      cantidad
      proveedor
      remito
      creado
      lote
    }
  }
`;

const NUEVO_INGRESO = gql`
    mutation nuevoRegistroIngreso($input: IngresoInput){
        nuevoRegistroIngreso(input: $input){
            id
            creado
            lote
            cantidad
            insumo
            remito
            proveedor
        }
    }
`;

const REGISTRO = gql `
    query obtenerRegistroIngreso($id: ID!){
        obtenerRegistroIngreso(id:$id){
            id
            insumo
            cantidad
            proveedor
            remito
            creado
            lote
        }
    }
`;

const ACTUALIZAR_REGISTRO = gql`
    mutation actualizarRegistroIngreso($id: ID!, $input: IngresoInput){
        actualizarRegistroIngreso(id: $id, input: $input){
            id
            insumo
            cantidad
            proveedor
            remito
            creado
            lote
        }
    }
`;

export {
  LISTA_REGISTROS,
  NUEVO_INGRESO,
  REGISTRO,
  ACTUALIZAR_REGISTRO,
};

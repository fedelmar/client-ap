import { gql } from '@apollo/client';

const PRODUCTOS = gql`
    query obtenerProductosPorCategoria($input: String!) {
        obtenerProductosPorCategoria(input: $input){
            id
            nombre
            categoria
            caja
            cantCaja
            insumos
        }
    }
`;

export {
  PRODUCTOS,
}
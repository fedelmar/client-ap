import { gql } from '@apollo/client';

const OBTENER_PRODUCTO_POR_NOMBRE = gql`
    query obtenerProductoPorNombre($nombre: String!) {
        obtenerProductoPorNombre(nombre: $nombre){
            id
            nombre
            categoria
            caja
            cantCaja
            insumos
        }
    }
`;

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
  OBTENER_PRODUCTO_POR_NOMBRE,
};

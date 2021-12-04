import { gql } from '@apollo/client';

const OBTENER_PRODUCTO = gql`
    query obtenerProducto($id: ID!) {
        obtenerProducto(id: $id) {
            id
            nombre
            categoria
            caja
            cantCaja
            insumos
        }
    }
`; 

const ACTUALIZAR_PRODUCTO = gql`
    mutation actualizarProducto($id: ID!, $input: ProductoInput) {
        actualizarProducto(id: $id, input: $input) {
            id
            nombre
            categoria
            caja
            cantCaja
            insumos
        }
}
`;

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
    OBTENER_PRODUCTO,
    ACTUALIZAR_PRODUCTO,
    PRODUCTOS,
    OBTENER_PRODUCTO_POR_NOMBRE,
};

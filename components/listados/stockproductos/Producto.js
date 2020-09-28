import React from 'react';
import { useQuery, gql } from '@apollo/client';

const LISTADO_PRODUCTOS = gql`
    query obtenerProductos {
        obtenerProductos{
            id
            nombre
        }
    }
`;

const Producto = ({id}) => {

    const {data, loading} = useQuery(LISTADO_PRODUCTOS);

    if (loading) return null;

    // Buscar dentro de lista de productos el nombre del producto
    const { nombre } = data.obtenerProductos.find(i => i.id === id);

    return (
        <th className="border px-4 py-2">{nombre}</th>
    );
}

export default Producto;
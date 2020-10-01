import React from 'react';
import { useQuery, gql } from '@apollo/client';

const LISTADO_INSUMOS = gql`
    query obtenerInsumos {
        obtenerInsumos{
            id
            nombre
        }
    }
`;

const Insumo = ({id}) => {

    const {data, loading} = useQuery(LISTADO_INSUMOS);

    if (loading) return null;

    // Buscar dentro de lista de insumos el nombre
    const {nombre} = data.obtenerInsumos.find(i => i.id === id);

    return (
        <th className="border px-4 py-2">{nombre}</th>
    );
}

export default Insumo;
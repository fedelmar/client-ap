import React, {useContext} from 'react';
import UsuarioContext from '../../context/usuarios/UsuarioContext';
import { gql, useQuery } from '@apollo/client';

const LOTE_PRODUCTO = gql `
    query obtenerProductoStock($id: ID!){
        obtenerProductoStock(id: $id){
            id
            lote
            cantidad
            producto
        }
    }
`

const ListarLotes = (lote) => {
    const {cantidad} = lote.lote;
    const loteActual = lote.lote.lote;

    const { data, loading } = useQuery(LOTE_PRODUCTO, {
        variables: {
            id: loteActual
        }
    });

    const usuarioContext = useContext(UsuarioContext);
    const { productos } = usuarioContext;
    if(loading) return null;

    const { obtenerProductoStock } = data;

    // Buscar dentro de lista de productos el nombre del producto
    const {nombre} = productos.find(i => i.id == data.obtenerProductoStock.producto);
    
    return (
        <td className="flex">
                <h1 className="border px-4 py-2 w-1/8" >{obtenerProductoStock.lote}</h1>
                <h1 className="border px-4 py-2 w-1/8" >{nombre}</h1>      
                <h1 className="border px-4 py-2 w-1/8" >{cantidad}</h1>
        </td>        
    );
}

export default ListarLotes;
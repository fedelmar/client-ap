import React, {useContext} from 'react';
import { format } from 'date-fns';
import UsuarioContext from '../context/usuarios/UsuarioContext';
import { gql, useMutation, useQuery } from '@apollo/client';
import Swal from 'sweetalert2';

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

const RegistroSalidas = ({registro, rol}) => {

    const { fecha, cliente, remito, lProducto, cantidad} = registro;

    const { data, loading } = useQuery(LOTE_PRODUCTO, {
        variables: {
            id: lProducto
        }
    });
    const usuarioContext = useContext(UsuarioContext);
    const { productos } = usuarioContext;

 
    if(loading) return null;

    console.log(productos)
    console.log(data)

    // Buscar dentro de lista de productos el nombre del producto
    const {nombre} = productos.find(i => i.id == data.obtenerProductoStock.producto);
    
    return (
        <tr>
            <th className="border px-4 py-2" >{format(new Date(fecha), 'dd/MM/yy')}</th>
            <th className="border px-4 py-2" >{cliente}</th>
            <th className="border px-4 py-2" >{remito}</th>
            <th className="border px-4 py-2" >{data.obtenerProductoStock.lote}</th>
            <th className="border px-4 py-2" >{nombre}</th>
            <th className="border px-4 py-2" >{cantidad}</th>
            {rol === "Admin" ? (
                <>
                    <td className="border px-4 py-2">
                        <button
                            type="button"
                            className="flex justify-center items-center bg-green-600 py-2 px-4 w-full text-white rounded text-xs uppercase font-bold"
                            //onClick={() => editarRegistro()}
                        >
                            <svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" className="w-4 h-4"><path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
                        </button>
                    </td>
                    <td className="border px-4 py-2 ">
                        <button
                            type="button"
                            //onClick={() => confimarEliminarRegistro()}
                            className="flex justify-center item-center bg-red-800 py-2 px-4 w-full text-white rounded uppercase font-bold text-xs"    
                        >
                            <svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" className="w-4 h-4"><path d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                        </button>
                    </td>
                </>
            ) : null}
        </tr>
    );
}

export default RegistroSalidas
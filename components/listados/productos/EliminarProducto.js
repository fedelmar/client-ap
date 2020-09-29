import React from 'react';
import Swal from 'sweetalert2';
import { gql, useMutation, useQuery } from '@apollo/client';

const ELIMINAR_PRODUCTO = gql` 
    mutation eliminarProducto($id: ID!){
        eliminarProducto(id: $id)
    }
`;

const OBTENER_PRODUCTOS = gql`
  query obtenerProductos {
    obtenerProductos{
      id
      nombre
      categoria
      caja
      cantCaja
      insumos
    }
  }
`;

const EXISTE_PRODUCTO = gql ` 
    query existeProductoStock($id: ID!) {
        existeProductoStock(id: $id)
    }
`;

const EliminarRegistro = (props) => {

    const id = props.props;

    const [eliminarProducto] = useMutation(ELIMINAR_PRODUCTO, {
        update(cache) {
            // Obtener copia de registros
            const { obtenerProductos } = cache.readQuery({ query: OBTENER_PRODUCTOS });


            // Actualizar cache
            cache.writeQuery({
                query: OBTENER_PRODUCTOS,
                data: {
                    obtenerProductos: obtenerProductos.filter( registroActual => registroActual.id !== id )
                }
            })
        }
    })
    const {data: existeLote, loading: loadingExiste} = useQuery(EXISTE_PRODUCTO, { variables: {id} });

    if(loadingExiste) return null;

    const confimarEliminarProducto = () => {
        Swal.fire({
            title: '¿Seguro desea eliminar el registro?',
            text: "Sera eliminado definitivamente",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Eliminar!',
            cancelButtonText: 'Cancelar'
          }).then( async (result) => {
            if (result.value) {

                try {
                    //Eliminar por id
                    const { data } = await eliminarProducto({
                        variables: {
                            id
                        }
                    })
                    //console.log(data);
                    Swal.fire(
                        'Eliminado!',
                        data.eliminarProducto,
                        'success'
                )
                } catch (error) {
                    console.log(error);
                }
            }
          })
    }
    
    return (
        <td className="border px-4 py-2 ">
            {!existeLote.existeProductoStock ?
                <button
                    type="button"
                    onClick={() => confimarEliminarProducto()}
                    className="flex justify-center item-center bg-red-800 py-2 px-4 w-full text-white rounded uppercase font-bold text-xs"    
                >
                    <svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" className="w-4 h-4"><path d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                </button>
            : 'Producto en uso'}                        
        </td>
    );
}

export default EliminarRegistro;
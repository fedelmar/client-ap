import React from 'react';
import Swal from 'sweetalert2';
import { gql, useMutation, useQuery } from '@apollo/client';

const ELIMINAR_INSUMO = gql` 
    mutation eliminarInsumo($id: ID!){
        eliminarInsumo(id: $id)
    }
`;

const OBTENER_INSUMO = gql`
  query obtenerInsumos {
    obtenerInsumos {
      id
      nombre
      categoria
    }
  }
`;

const EXISTE_INSUMO = gql ` 
    query existeInsumoStock($id: ID!) {
        existeInsumoStock(id: $id)
    }
`;


const EliminarRegistro = (props) => {

    const id = props.props;

    const [eliminarInsumo] = useMutation(ELIMINAR_INSUMO, {
        update(cache) {
            // Obtener copia de registros
            const { obtenerInsumos } = cache.readQuery({ query: OBTENER_INSUMO });


            // Actualizar cache
            cache.writeQuery({
                query: OBTENER_INSUMO,
                data: {
                    obtenerInsumos: obtenerInsumos.filter( registroActual => registroActual.id !== id )
                }
            })
        }
    })
    const {data: existeLote, loading: loadingExiste} = useQuery(EXISTE_INSUMO, { variables: {id} });

    if(loadingExiste) return null;

    const confimarEliminarInsumo = () => {
        Swal.fire({
            title: '¿Seguro desea eliminar el Insumo?',
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
                    const { data } = await eliminarInsumo({
                        variables: {
                            id
                        }
                    })
                    //console.log(data);
                    Swal.fire(
                        'Eliminado!',
                        data.eliminarInsumo,
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
            {!existeLote.existeInsumoStock ?
                <button
                    type="button"
                    onClick={() => confimarEliminarInsumo()}
                    className="flex justify-center item-center bg-red-800 py-2 px-4 w-full text-white rounded uppercase font-bold text-xs"    
                >
                    <svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" className="w-4 h-4"><path d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                </button>
            : 'Insumo en uso'}                        
        </td>
    );
}

export default EliminarRegistro;
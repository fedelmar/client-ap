/* eslint-disable react/prop-types */
import React from 'react';
import Swal from 'sweetalert2';
import { gql, useMutation, useQuery } from '@apollo/client';
import Router from 'next/router';


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


const Insumo = ({insumo, rol}) => {

    const { nombre, categoria, id } = insumo;

    const [eliminarInsumo] = useMutation(ELIMINAR_INSUMO, {
        update(cache) {
            // Obtener copia de productos
            const { obtenerInsumos } = cache.readQuery({ query: OBTENER_INSUMO });

            // Reescribir el cache
            cache.writeQuery({
                query: OBTENER_INSUMO,
                data: {
                    obtenerInsumos : obtenerInsumos.filter( insumoActual => insumoActual.id !== id )
                }
            })
        }
    });
    const { data, loading } = useQuery(EXISTE_INSUMO, {variables: {id}});

    if (loading) return null;

    const confimarEliminarInsumo = async () => {
        Swal.fire({
            title: '¿Desea eliminar el insumo?',
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
                    console.log(data);
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

    const editarInsumo = () => {
        Router.push({
            pathname: "/editarInsumo/[id]",
            query: { id }
        })
    }

    return (
        <tr>
            <th className="border px-4 py-2" >{nombre}</th>
            <th className="border px-4 py-2" >{categoria}</th>
            {rol === "Admin" ? (
                <>
                    <td className="border px-4 py-2">
                        <button
                            type="button"
                            className="flex justify-center items-center bg-green-600 py-2 px-4 w-full text-white rounded text-xs uppercase font-bold"
                            onClick={() => editarInsumo()}
                        >
                            <svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" className="w-4 h-4"><path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
                        </button>
                    </td>
                    <td className="border px-4 py-2 ">
                        {!data.existeInsumoStock ?
                            <button
                                type="button"
                                onClick={() => confimarEliminarInsumo()}
                                className="flex justify-center item-center bg-red-800 py-2 px-4 w-full text-white rounded uppercase font-bold text-xs"    
                            >
                                <svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" className="w-4 h-4"><path d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                            </button>
                        : "Insumo en uso"
                        }                        
                    </td>
                </>
            ) : null}
        </tr>
    );
}

export default Insumo
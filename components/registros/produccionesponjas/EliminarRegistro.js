import React from 'react';
import Swal from 'sweetalert2';
import { gql, useMutation } from '@apollo/client';
import Router from 'next/router';

const ELIMINAR_REGISTRO = gql `
    mutation eliminarRegistroCE($id: ID!){
        eliminarRegistroCE(id: $id)
    }
`;

const LISTA_REGISTROS = gql `
    query obtenerRegistrosCE {
        obtenerRegistrosCE{
            id
            creado
            modificado
            operario
            lote
            producto
            lBolsa
            lEsponja
            cantProducida
            cantDescarte
            observaciones
            estado
        }
    }
`;

const EliminarRegistro = ({props}) => {

    const id = props;

    const [eliminarRegistroCE] = useMutation(ELIMINAR_REGISTRO, {
        update(cache) {
            // Obtener copia de registros
            const { obtenerRegistrosCE } = cache.readQuery({ query: LISTA_REGISTROS });


            // Actualizar cache
            cache.writeQuery({
                query: LISTA_REGISTROS,
                data: {
                    obtenerRegistrosCE: obtenerRegistrosCE.filter( registroActual => registroActual.id !== id )
                }
            })
        }
    })

    const confimarEliminarRegistro = () => {
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
                    const { data } = await eliminarRegistroCE({
                        variables: {
                            id
                        }
                    })
                    Swal.fire(
                        'Eliminado!',
                        data.eliminarRegistroCE,
                        'success'
                )
                } catch (error) {
                    console.log(error);
                }
            }
          })
    }

    const editarRegistro = id => {
        Router.push({
            pathname: "/registros/produccionesponjas/editarRegistro/[id]",
            query: { id }
        })
    }
    
    return (
        <td className="flex-col border justify-center px-3">
            <button
                type="button"
                className="flex justify-center items-center bg-green-600  my-1 py-2 px-2 w-full text-white rounded text-xs uppercase font-bold"
                onClick={() => editarRegistro(id)}
            >
                <svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" className="w-4 h-4"><path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
            </button>
            <button
                type="button"
                onClick={() => confimarEliminarRegistro()}
                className="flex justify-center item-center bg-red-800  my-1 py-2 px-2 w-full text-white rounded uppercase font-bold text-xs"    
            >
                <svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" className="w-4 h-4"><path d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            </button>
        </td> 
    );
}

export default EliminarRegistro;
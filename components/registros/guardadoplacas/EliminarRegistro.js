import React from 'react';
import Swal from 'sweetalert2';
import { gql, useMutation } from '@apollo/client';

const ELIMINAR_REGISTRO = gql`
    mutation eliminarRegistroGP($id: ID!){
        eliminarRegistroGP(id: $id)
    }
`;

const LISTA_REGISTROS = gql `
    query obtnerRegistrosGP{
        obtenerRegistrosGP{
            id
            creado
            modificado
            operario
            lote
            producto
            loteID
            guardado
            descarte
            pallet
            auxiliar
            observaciones
            estado
        }
    }
`;

const EliminarRegistro = (props) => {

    const id = props.props;

    const [eliminarRegistroGP] = useMutation(ELIMINAR_REGISTRO, {
        update(cache) {
            // Obtener copia de registros
            const { obtenerRegistrosGP } = cache.readQuery({ query: LISTA_REGISTROS });


            // Actualizar cache
            cache.writeQuery({
                query: LISTA_REGISTROS,
                data: {
                    obtenerRegistrosGP: obtenerRegistrosGP.filter( registroActual => registroActual.id !== id )
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
                    const { data } = await eliminarRegistroGP({
                        variables: {
                            id
                        }
                    })
                    //console.log(data);
                    Swal.fire(
                        'Eliminado!',
                        data.eliminarRegistroGP,
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
            <button
                type="button"
                onClick={() => confimarEliminarRegistro()}
                className="flex justify-center item-center bg-red-800 py-2 px-4 w-full text-white rounded uppercase font-bold text-xs"    
            >
                <svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" className="w-4 h-4"><path d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            </button>
        </td> 
    );
}

export default EliminarRegistro;
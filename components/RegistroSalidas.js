import React from 'react';
import { format } from 'date-fns';
import { gql, useMutation, useQuery } from '@apollo/client';
import Swal from 'sweetalert2';

const ELIMINAR_REGISTRO = gql `
    mutation eliminarRegistroSalida($id: ID!){
        eliminarRegistroSalida(id: $id)
    }
`;

const LISTA_REGISTROS = gql `
    query obtenerRegistrosSalidas{
        obtenerRegistrosSalidas{
            id
            fecha
            cliente
            remito
            lotes {
                lote
                cantidad
                producto
            }
        }
    }
`;

const RegistroSalidas = ({registro, rol}) => {

    const { fecha, cliente, remito, lotes, id} = registro;

    const [eliminarRegistroSalida] = useMutation(ELIMINAR_REGISTRO, {
        update(cache) {

            const { obtenerRegistrosSalidas } = cache.readQuery({ query: LISTA_REGISTROS })

            cache.writeQuery({
                query: LISTA_REGISTROS,
                data: {
                    obtenerRegistrosSalidas: obtenerRegistrosSalidas.filter( registroActual => registroActual.id !== id )
                }
            })
        }
    });
    
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
                    const { data } = await eliminarRegistroSalida({
                        variables: {
                            id
                        }
                    })
                    //console.log(data);
                    Swal.fire(
                        'Eliminado!',
                        data.eliminarRegistroSalida,
                        'success'
                )
                } catch (error) {
                    console.log(error);
                }
            }
          })
    }

    return (
        <tr>
            <th className="border px-4 py-2 w-1/8" >{format(new Date(fecha), 'dd/MM/yy')}</th>
            <th className="border px-4 py-2 w-1/8" >{cliente}</th>
            <th className="border px-4 py-2 w-1/8" >{remito}</th>
            {lotes.map(i =>
                <th key={i.id} className="flex">
                    <p className="border px-4 py-2 w-full h-full text-center font-bold" >{i.lote}</p>
                    <p className="border px-4 py-2 w-full h-full text-center font-bold" >{i.cantidad}</p>
                    <p className="border px-4 py-2 w-full h-full text-center font-bold" >{i.producto}</p>
                </th>
            )}
            {rol === "Admin" ? (
                    <td className="border px-4 py-2 ">
                        <button
                            type="button"
                            onClick={() => confimarEliminarRegistro()}
                            className="flex justify-center item-center bg-red-800 py-2 px-4 w-full text-white rounded uppercase font-bold text-xs"    
                        >
                            <svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" className="w-4 h-4"><path d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                        </button>
                    </td>
            ) : null}
        </tr>
    );
}

export default RegistroSalidas;
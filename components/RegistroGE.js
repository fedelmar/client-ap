import React from 'react';
import MostrarObser from './registros/MostrarObser';
import { format } from 'date-fns';
import { gql, useMutation } from '@apollo/client';
import Swal from 'sweetalert2';

const ELIMINAR_REGISTRO = gql`
    mutation eliminarRegistroGE($id: ID!){
        eliminarRegistroGE(id: $id)
    }
`;

const LISTA_REGISTROS = gql `
    query obtenerRegistrosGE{
        obtenerRegistrosGE{
                id
                fecha
                operario
                lote
                horaInicio
                horaCierre
                caja
                descCajas
                guardado
                descarte
                observaciones
                producto
            }
        }
`;

const RegistroGE = ({registro, rol}) => {

    const [eliminarRegistroGE] = useMutation(ELIMINAR_REGISTRO, {
        update(cache) {

            const { obtenerRegistrosGE } = cache.readQuery({ query: LISTA_REGISTROS })

            cache.writeQuery({
                query: LISTA_REGISTROS,
                data: {
                    obtenerRegistrosGE: obtenerRegistrosGE.filter( registroActual => registroActual.id !== id )
                }
            })
        }
    });

    const {
        id,
        fecha,
        horaCierre,
        lote,
        operario,
        caja,
        descCajas,
        descarte,
        guardado,
        observaciones,
        producto
    } = registro;

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
                    const { data } = await eliminarRegistroGE({
                        variables: {
                            id
                        }
                    })
                    //console.log(data);
                    Swal.fire(
                        'Eliminado!',
                        data.eliminarRegistroGE,
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
            <th className="border px-4 py-2" >{format(new Date(fecha), 'dd/MM/yy')}</th>
            <th className="border px-4 py-2" >De {format(new Date(fecha), 'HH:mm')} a {horaCierre}</th>
            <th className="border px-4 py-2" >{producto}</th>
            <th className="border px-4 py-2" >{lote}</th>
            <th className="border px-4 py-2" >{caja}</th>
            <th className="border px-4 py-2" >{descCajas}</th>
            <th className="border px-4 py-2" >{guardado}</th>
            <th className="border px-4 py-2" >{descarte}</th>
            <th className="border px-4 py-2" >{operario}</th>
            <MostrarObser observaciones={observaciones} />     
            {rol === "Admin" ? (
                <>
                    {/* De momento la edicion no va a estar disponible
                    
                    <td className="border px-4 py-2">
                        <button
                            type="button"
                            className="flex justify-center items-center bg-green-600 py-2 px-4 w-full text-white rounded text-xs uppercase font-bold"
                            //onClick={() => editarRegistro()}
                        >
                            <svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" className="w-4 h-4"><path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
                        </button>
                    </td>*/}
                    <td className="border px-4 py-2 ">
                        <button
                            type="button"
                            onClick={() => confimarEliminarRegistro()}
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

export default RegistroGE;
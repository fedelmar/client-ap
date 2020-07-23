import React from 'react';
import Swal from 'sweetalert2';
import { gql, useMutation } from '@apollo/client';

const ELIMINAR_CLIENTE = gql`
    mutation eliminarCliente($id: ID!) {
        eliminarCliente(id: $id)
    }
`;
const Cliente = ({cliente}) => {

    const [eliminarCliente] = useMutation(ELIMINAR_CLIENTE);
    
    const { nombre, apellido, empresa, email, id } = cliente;
   
    const confirmarEliminarCliente = id => {
        Swal.fire({
            title: '¿Estás seguro que quieres eliminar el cliente?',
            text: "No hay vuelta atras",
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
                    const { data } = await eliminarCliente({
                        variables: {
                            id
                        }
                    })
                    console.log(data);
                    Swal.fire(
                        'Eliminado!',
                        data.eliminarCliente,
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
            <td className="border px-4 py-2 ">{nombre} {apellido} </td>
            <td className="border px-4 py-2 ">{empresa}</td>
            <td className="border px-4 py-2 ">{email}</td>
            <td className="border px-4 py-2 ">
                <button
                    type="button"
                    onClick={() => confirmarEliminarCliente(id) }
                    className="flex justify-center item-center bg-red-800 py-2 px-4 w-full text-white rounded uppercase font-bold text-xs"    
                >
                    Eliminar
                    <svg fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor" className="w-4 h-4 ml-2"><path d="M13 7a4 4 0 11-8 0 4 4 0 018 0zM9 14a6 6 0 00-6 6v1h12v-1a6 6 0 00-6-6zM21 12h-6"></path></svg>
                </button>
            </td>
        </tr>
    );
}

export default Cliente;
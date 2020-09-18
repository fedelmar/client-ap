/* eslint-disable react/prop-types */
import React from 'react';
import Swal from 'sweetalert2';
import { gql, useQuery, useMutation } from '@apollo/client';
import Router from 'next/router';

const LISTADO_INSUMOS = gql`
    query obtenerInsumos {
        obtenerInsumos{
            id
            nombre
        }
    }
`;

const ELIMINAR_LOTE = gql `
    mutation eliminarInsumoStock($id: ID!){
        eliminarInsumoStock(id: $id)
    }
`;

const LISTADO_STOCK = gql`
    query obtenerStockInsumos{
        obtenerStockInsumos{
            id
            insumo
            lote
            cantidad
        }
    }
`;

const LoteInsumo = ({loteInsumo, rol}) => {

    const {lote, insumo, cantidad, id} = loteInsumo;


    const {data, loading} = useQuery(LISTADO_INSUMOS);


    const [eliminarInsumoStock] = useMutation(ELIMINAR_LOTE, {
        update(cache) {
            // Obtener copia del stock
            const { obtenerStockInsumos } = cache.readQuery({ query: LISTADO_STOCK });
           
            // Reescribir el cache
            cache.writeQuery({
                query: LISTADO_STOCK,
                data: {
                    obtenerStockInsumos : obtenerStockInsumos.filter( lote => lote.id !== id )
                }
            })
        }
    });

    
    if (loading) return null;

    // Buscar dentro de lista de productos el nombre del producto
    const {nombre} = data.obtenerInsumos.find(i => i.id === insumo);

    const confirmarEliminarLote = async () => {
        Swal.fire({
            title: '¿Desea eliminar el lote?',
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
                    const { data } = await eliminarInsumoStock({
                        variables: {
                            id
                        }
                    })
                    //console.log(data);
                    Swal.fire(
                        'Eliminado!',
                        data.eliminarInsumoStock,
                        'success'
                )
                } catch (error) {
                    console.log(error);
                }
            }
          })
    };

    const editarLote = () => {
        Router.push({
            pathname: "/editarLInsumo/[id]",
            query: { id }
        })
    }

    return (
        <tr>
            <th className="border px-3 py-2" >{lote}</th>
            <th className="border px-3 py-2" >{nombre}</th>
            <th className="border px-3 py-2" >{cantidad}</th>
            {rol === "Admin" ? (
                <>
                    <td className="border px-4 py-2">
                        <button
                            type="button"
                            className="flex justify-center items-center bg-green-600 py-2 px-4 w-full text-white rounded text-xs uppercase font-bold"
                            onClick={() => editarLote()}
                        >
                            <svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" className="w-4 h-4"><path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
                        </button>
                    </td>
                    <td className="border px-4 py-2 ">
                        <button
                            type="button"
                            onClick={() => confirmarEliminarLote()}
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

export default LoteInsumo
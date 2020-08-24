/* eslint-disable react/prop-types */
import React from 'react';
import Swal from 'sweetalert2';
import { gql, useMutation, useQuery } from '@apollo/client';
import Router from 'next/router';
import MostrarInsumos from './MostrarInsumos';


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

const OBTENER_INSUMOS = gql`
  query obtenerInsumos {
    obtenerInsumos {
      id
      nombre
      categoria
    }
  }
`;


const Producto = ({producto, rol}) => {

    const { nombre, categoria, caja, cantCaja, insumos, id } = producto;
   
    const [eliminarProducto] = useMutation(ELIMINAR_PRODUCTO, {
        update(cache) {
            // Obtener copia de productos
            const { obtenerProductos } = cache.readQuery({ query: OBTENER_PRODUCTOS });

            // Reescribir el cache
            cache.writeQuery({
                query: OBTENER_PRODUCTOS,
                data: {
                    obtenerProductos : obtenerProductos.filter( productoActual => productoActual.id !== id )
                }
            })
        }
    });
    const {data: existeLote, loading: loadingExiste} = useQuery(EXISTE_PRODUCTO, { variables: {id} });
    const { data, loading } = useQuery(OBTENER_INSUMOS);

    if(loading) return null;
    if(loadingExiste) return null;
    const arrInsumos = data.obtenerInsumos;

    const confimarEliminarProducto = async () => {
        Swal.fire({
            title: '¿Desea eliminar el producto?',
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

    const editarProducto = () => {
        Router.push({
            pathname: "/editarProducto/[id]",
            query: { id }
        })
    }

    return (
        <tr>
            <th className="border px-4 py-2" >{nombre}</th>
            <th className="border px-4 py-2" >{categoria}</th>
            <th className="border px-4 py-2" >{caja}</th>
            <th className="border px-4 py-2" >{cantCaja}</th>
            <MostrarInsumos key={insumos.id} arrInsumos={arrInsumos} insumos={insumos}/>       
            {rol === "Admin" ? (
                <>
                    <td className="border px-4 py-2">
                        <button
                            type="button"
                            className="flex justify-center items-center bg-green-600 py-2 px-4 w-full text-white rounded text-xs uppercase font-bold"
                            onClick={() => editarProducto()}
                        >
                            <svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" className="w-4 h-4"><path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
                        </button>
                    </td>
                    <td className="border px-4 py-2 ">
                        {!existeLote.existeProductoStock ?
                            <button
                                type="button"
                                onClick={() => confimarEliminarProducto()}
                                className="flex justify-center item-center bg-red-800 py-2 px-4 w-full text-white rounded uppercase font-bold text-xs"    
                            >
                                <svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" className="w-4 h-4"><path d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                            </button>
                        : 'Producto en uso'
                        }                        
                    </td>
                </>
            ) : null}
        </tr>
    );
}

export default Producto;
/* eslint-disable react/prop-types */
import React, { useReducer } from 'react';
import PedidoContext from './PedidoContext';
import PedidoReducer from './PedidoReducer';


import {
    SELECCIONAR_CLIENTE,
    SELECCIONAR_PRODUCTO,
    CANTIDAD_PRODUCTO
} from '../../types'

const PedidoState = ({children}) => {

    // State de pedidos
    const initialState = {
        cliente: {},
        productos: []
    }

    const [ state, dispatch ] = useReducer(PedidoReducer, initialState);

    // Modificando el cliente
    const agregarCliente = cliente => {
        dispatch({
            type: SELECCIONAR_CLIENTE,
            payload: cliente
        })
    }

    // Modificando productos
    const agregarProducto = productosSeleccionados => {

        let nuevoState;
        if( state.productos.length > 0 ) {
            nuevoState = productosSeleccionados.map( producto => {
                const nuevoObjeto = state.productos.find( productoState => productoState.id === producto.id );
                return {...producto, ...nuevoObjeto}
            })
        } else {
            nuevoState = productosSeleccionados;
        }

        dispatch({
            type: SELECCIONAR_PRODUCTO,
            payload: nuevoState
        })
    }

    // Modificando cantidades de productos
    const cantidadProductos = nuevoProducto => {
        dispatch({
            type: CANTIDAD_PRODUCTO,
            payload: nuevoProducto
        })
    }

    return (
        <PedidoContext.Provider
            value={{
                productos: state.productos,
                cliente: state.cliente,
                agregarCliente,
                agregarProducto,
                cantidadProductos
            }}
        >
            {children}
        </PedidoContext.Provider>
    );
}

export default PedidoState;
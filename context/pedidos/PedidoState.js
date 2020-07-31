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
        productos: [],
        total: 0
    }

    const [ state, dispatch ] = useReducer(PedidoReducer, initialState);

    const holaMundoEnUseReducer = () => {
        console.log('Hello World')
    }

    return (
        <PedidoContext.Provider
            value={{
                    holaMundoEnUseReducer
                }}
        >
            {children}
        </PedidoContext.Provider>
    );
}

export default PedidoState;
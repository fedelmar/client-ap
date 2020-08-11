/* eslint-disable react/prop-types */
import React, { useReducer } from 'react';
import UsuarioContext from './UsuarioContext';
import UsuarioReducer from './UsuarioReducer';

import {
    DATOS_USUARIO,
    LISTA_INSUMOS
} from '../../types'

const UsuarioState = ({children}) => {

    // State de usuarios
    const initialState = {
        usuario: {},
        insumos: []
    }

    const agregarUsuario = usuario => {
        dispatch({
            type: DATOS_USUARIO,
            payload: usuario
        })
    }

    const agregarInsumos = listaInsumos => {
        dispatch({
            type: LISTA_INSUMOS,
            payload: listaInsumos
        })
    }
    const [ state, dispatch ] = useReducer(UsuarioReducer, initialState);
    return (
        <UsuarioContext.Provider
            value={{
                usuario: state.usuario,
                insumos: state.insumos,
                agregarUsuario,
                agregarInsumos
            }}
        >
            {children}
        </UsuarioContext.Provider>
    );
}

export default UsuarioState;
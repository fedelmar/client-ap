/* eslint-disable react/prop-types */
import React, { useReducer } from 'react';
import UsuarioContext from './UsuarioContext';
import UsuarioReducer from './UsuarioReducer';

import {
    DATOS_USUARIO
} from '../../types'

const UsuarioState = ({children}) => {

    // State de usuarios
    const initialState = {
        usuario: {}
    }

    const agregarUsuario = usuario => {
        dispatch({
            type: DATOS_USUARIO,
            payload: usuario
        })
    }

    const [ state, dispatch ] = useReducer(UsuarioReducer, initialState);
    return (
        <UsuarioContext.Provider
            value={{
                usuario: state.usuario,
                agregarUsuario
            }}
        >
            {children}
        </UsuarioContext.Provider>
    );
}

export default UsuarioState;
import React from 'react'
import { gql, useQuery } from '@apollo/client'

const OBTENER_USUARIO = gql `
    query obtenerUsuario {
        obtenerUsuario {
            id
            nombre
            apellido
        }
    }
`;

const Header = () => {

    // Query de apollo
    const {data, loading, error } = useQuery(OBTENER_USUARIO);

    //console.log(data)
    //console.log(loading)
    //console.log(error)

    if(loading) return null;

    const { nombre, apellido } = data.obtenerUsuario;
 
    return (
        <div className="flex justify-between mb-5">
            <p className="text-2xl text-gray-800 font-light">Hola: {nombre} {apellido}</p>

            <button
                className="text-2xl text-gray-800 font-light" 
                type="button"
            >
                Cerrar Sessión
            </button>
        </div>
        
    );
}

export default Header;
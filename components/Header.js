import React from 'react'
import { gql, useQuery } from '@apollo/client'
import { useRouter } from 'next/router';

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

    const router = useRouter();

    // Query de apollo
    const {data, loading, error } = useQuery(OBTENER_USUARIO);

    //console.log(data)
    //console.log(loading)
    //console.log(error)

    if(loading) return null;

    //Redireccionar si no hay informacion
    if(!data) {
        return router.push('/login');
    }

    const { nombre, apellido } = data.obtenerUsuario;

    const cerrarSesion = () => {
        localStorage.removeItem('token');
        router.push('/login');
    }
 
    return (
        <div className="flex justify-between mb-5">
            <p className="text-2xl text-gray-800 font-light">Hola: {nombre} {apellido}</p>

            <button
                onClick={() => cerrarSesion()}
                className="uppercase shadow-md text-white text-xs  sm:w-auto p-2 font-black bg-red-700 rounded" 
                type="button"
            >
                Cerrar Sessión
            </button>
        </div>
        
    );
}

export default Header;
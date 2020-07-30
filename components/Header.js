import React, {useState, useEffect} from 'react'
import { gql, useQuery } from '@apollo/client'
import { useRouter } from 'next/router';
import client from '../config/apollo';

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

    const [usuario, setUsuario] = useState({});
    const router = useRouter();
    const {data, loading, error } = useQuery(OBTENER_USUARIO);

    useEffect(() => {
        function getUser(){

            if(loading) return "Cargando...";

            if(error) return error;

            if(!data.obtenerUsuario) {
                    return router.push('/login');
                }

            setUsuario(data.obtenerUsuario)
        }
        getUser();
    }, [data, loading, error])

  
    const { nombre, apellido } = usuario;

    const cerrarSesion = client => {
        localStorage.removeItem('token');
        client.resetStore();
        router.push('/login');
    }
 
    return (
        <div className="flex justify-between mb-5">
            <p className="text-2xl text-gray-800 font-light">Hola {nombre} {apellido}!</p>

            <button
                onClick={() => cerrarSesion(client)}
                className="uppercase shadow-md text-white text-xs  sm:w-auto p-2 font-black bg-red-700 rounded" 
                type="button"
            >
                Cerrar Sessión
            </button>
        </div>
        
    );
}

export default Header;
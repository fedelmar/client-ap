/* eslint-disable react/prop-types */
import React from 'react'
import { useRouter } from 'next/router';
import client from '../config/apollo';

const Header = ({usuario}) => {

    const router = useRouter();
    
    const { nombre, apellido, rol } = usuario;

    const cerrarSesion = client => {
        
        sessionStorage.clear()
        client.clearStore().then(() => {
            client.resetStore();
            localStorage.removeItem('token');
            router.push('/login');
        });
       
        //client.cache.reset();
    }
 
    return (
        <div className="sm:flex sm:justify-between mb-5">
            <p className="mb-5 lg:mb-0 text-2xl text-gray-800 font-light">Hola {nombre} {apellido}!</p>

            <div className="sm:flex sm:justify-between">
                
                {rol === "Admin" ? (
                    <div className="px-2" >
                        <button
                            onClick={() => router.push('/registro')}
                            className="uppercase shadow-md text-white text-xs sm:w-auto p-2 font-black bg-green-700 rounded w-full lg:w-auto text-center" 
                            type="button"
                        >
                            Nuevo Usuario
                        </button>
                    </div>
                ) : null}

                <div>
                    <button
                        onClick={() => cerrarSesion(client)}
                        className="uppercase shadow-md text-white text-xs sm:w-auto p-2 font-black bg-red-700 rounded w-full lg:w-auto text-center" 
                        type="button"
                    >
                        Cerrar Sessión
                    </button>
                </div>
            </div>
        </div>
        
    );
}

export default Header;
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
        <header className="flex items-center justify-between bg-gray-800 px-4 py-3">
            <div>
                <p className="text-white font-black text-2xl ">Sistema AP</p>
            </div>
            <p className="text-2xl text-white font-light">Hola {nombre} {apellido}!</p>
            <div className="flex">
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
            {/*<div>
                <button type="button" className="text-gray-300 hover:text-white focus:text-white focus:outline-none">
                    <svg  className="h-6 w-6 fill-current" viewBox="0 0 100 80">
                        <rect width="100" height="10"></rect>
                        <rect y="30" width="100" height="10"></rect>
                        <rect y="60" width="100" height="10"></rect>
                    </svg>
                </button>                        
            </div>*/}                  
        </header>        
    );
}

export default Header;
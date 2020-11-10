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
        <header className="flex items-center justify-between bg-gray-800 px-2 py-2">
            <button
                type="button"
                className="text-white font-black text-2xl "
                onClick={() => router.push('/')}
            >
                Sistema AP
            </button>
            <div className="flex-col">     
                <p className="text-base bg-gray-800 text-right text-white font-light">
                    Usuario: {usuario.nombre} {usuario.apellido}
                </p>       
                <div className="flex justify-end">
                    {rol === "Admin" ? (
                            <div className="px-1" >
                                <button
                                    onClick={() => router.push('/registro')}
                                    className="uppercase shadow-md text-white text-xs sm:w-auto p-1 font-black bg-green-700 rounded w-full lg:w-auto text-center" 
                                    type="button"
                                >
                                    Nuevo Usuario
                                </button>
                            </div>
                        ) : null}

                    <div>
                        <button
                            onClick={() => cerrarSesion(client)}
                            className="uppercase shadow-md text-white text-xs sm:w-auto p-1 font-black bg-red-700 rounded w-full lg:w-auto text-center" 
                            type="button"
                        >
                            Cerrar Sessión
                        </button>
                    </div>
                </div>
            </div>         
        </header>        
    );
}

export default Header;
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

const Footer = () => {

    // Routing de next
    const router = useRouter();
    const [listados, setListados] = useState(false);
    const [registros, setRegistros] = useState(false);

    const handleOpenCloseListados = () => {
        setListados(!listados);
        setRegistros(false);
    };

    const handleOpenCloseRegistros = () => {
        setListados(false);
        setRegistros(!registros);
    };

    const handleClose = () => {
        setListados(false);
        setRegistros(false);
    }

    return (
        <footer className="fixed bottom-0 bg-gray-900 w-full">
            <div>
                {registros ? 
                    <div className="relative z-10">
                        <li className={router.pathname === "/registros/produccionesponjas" ? "bg-blue-800 p-2 px-5" : "p-2 px-5"}>    
                            <Link href="/registros/produccionesponjas">
                                <a className="text-white block">Producción de Esponjas</a>
                            </Link>
                        </li>
                        <li className={router.pathname === "/registros/guardadoesponjas" ? "bg-blue-800 p-2 px-5" : "p-2 px-5"}>    
                            <Link href="/registros/guardadoesponjas">
                                <a className="text-white block">Guardado de Esponjas</a>
                            </Link>
                        </li>
                        <li className={router.pathname === "/registros/salidas" ? "bg-blue-800 p-2 px-5" : "p-2 px-5"}>    
                            <Link href="/registros/salidas">
                                <a className="text-white block">Salidas</a>
                            </Link>
                        </li>
                    </div>
                : null}
                {listados ? 
                    <div className="relative z-10">
                        <li className={router.pathname === "/productos" ? "bg-blue-800 p-2 px-5" : "p-2 px-5"}>    
                            <Link href="/productos">
                                <a className="text-white block">Productos</a>
                            </Link>
                        </li>
                        <li className={router.pathname === "/insumos" ? "bg-blue-800 p-2 px-5" : "p-2 px-5"}>    
                            <Link href="/insumos">
                                <a className="text-white block">Insumos</a>
                            </Link>
                        </li>
                        <li className={router.pathname === "/stockproductos" ? "bg-blue-800 p-2 px-5" : "p-2 px-5"}>    
                            <Link href="/stockproductos">
                                <a className="text-white block">Stock de Productos</a>
                            </Link>
                        </li>
                        <li className={router.pathname === "/stockinsumos" ? "bg-blue-800 p-2 px-5" : "p-2 px-5"}>    
                            <Link href="/stockinsumos">
                                <a className="text-white block">Stock de Insumos</a>
                            </Link>
                        </li>
                        <li className={router.pathname === "/clientes" ? "bg-blue-800 p-2 px-5" : "p-2 px-5"}>    
                            <Link href="/clientes">
                                <a className="text-white block">Clientes</a>
                            </Link>
                        </li>
                    </div>
                : null}
            </div>
            <nav className="sm:flex mx-3 list-none justify-center">
                <button 
                    onClick={() => handleClose()}
                    tabIndex="-1" 
                    className={(listados || registros ? "block " : "hidden ") + "fixed inset-0 h-full w-full cursor-default"}
                />
                <button 
                    onClick={() => handleOpenCloseListados()} 
                    className={listados ? "text-white p-2 px-5 bg-blue-800 relative z-10 focus:outline-none" : "text-white p-2 px-5 relative z-10 focus:outline-none"}
                >
                    Listados
                </button>
                <button 
                    onClick={() => handleOpenCloseRegistros()} 
                    className={registros ? "text-white p-2 px-5 bg-blue-800 relative z-10 focus:outline-none" : "text-white p-2 px-5 relative z-10 focus:outline-none"}
                >
                    Registros                    
                </button>


                {/*<div>
                    <button type="button" className="text-gray-300 hover:text-white focus:text-white focus:outline-none">
                        <svg  className="h-6 w-6 fill-current" viewBox="0 0 100 80">
                            <rect width="100" height="10"></rect>
                            <rect y="30" width="100" height="10"></rect>
                            <rect y="60" width="100" height="10"></rect>
                        </svg>
                    </button>                        
                </div>*/}    
                {/*<li className={router.pathname === "/pedidos" ? "bg-blue-800 p-2" : "p-2"}>    
                    <Link href="/pedidos">
                        <a className="text-white block">Pedidos</a>
                    </Link>
                </li>
                */}
            </nav>
        </footer>       
    );
}

export default Footer;
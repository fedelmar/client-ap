import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

const Footer = () => {

    // Routing de next
    const router = useRouter();

    return (
        <footer className="fixed bottom-0  bg-gray-800 w-full">
            <nav className=" sm:flex mx-3 list-none">
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
                <li className={router.pathname === "/stockproductos" ? "bg-blue-800 p-2" : "p-2"}>    
                    <Link href="/stockproductos">
                        <a className="text-white block">Stock de Productos</a>
                    </Link>
                </li>
                <li className={router.pathname === "/stockinsumos" ? "bg-blue-800 p-2" : "p-2"}>    
                    <Link href="/stockinsumos">
                        <a className="text-white block">Stock de Insumos</a>
                    </Link>
                </li>
                <li className={router.pathname === "/registros/produccionesponjas" ? "bg-blue-800 p-2" : "p-2"}>    
                    <Link href="/registros/produccionesponjas">
                        <a className="text-white block">Producción de Esponjas</a>
                    </Link>
                </li>
                <li className={router.pathname === "/registros/guardadoesponjas" ? "bg-blue-800 p-2" : "p-2"}>    
                    <Link href="/registros/guardadoesponjas">
                        <a className="text-white block">Guardado de Esponjas</a>
                    </Link>
                </li>

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
                <li className={router.pathname === "/clientes" ? "bg-blue-800 p-2" : "p-2"}>    
                    <Link href="/clientes">
                        <a className="text-white block">Clientes</a>
                    </Link>
                </li>*/}
            </nav>
        </footer>       
    );
}

export default Footer;
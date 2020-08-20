import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

const Sidebar = () => {

    // Routing de next
    const router = useRouter();

    return (
        <aside className="bg-gray-800 xl:w-1/5 sm:w-1/3 sm:min-h-screen p-5">
            <div>
                <p className="text-white font-black text-2x1">Sistema AP</p>
            </div>

            <nav className="mt-5 list-none">
                <li className={router.pathname === "/" ? "bg-blue-800 p-2" : "p-2"}>
                    <Link href="/">
                        <a className="text-white block">Inicio</a>
                    </Link>
                </li>
                <li className={router.pathname === "/productos" ? "bg-blue-800 p-2" : "p-2"}>    
                    <Link href="/productos">
                        <a className="text-white block">Productos</a>
                    </Link>
                </li>
                <li className={router.pathname === "/insumos" ? "bg-blue-800 p-2" : "p-2"}>    
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
                        <a className="text-white block">Produccion de Esponjas</a>
                    </Link>
                </li>
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
        </aside>
    );
}

export default Sidebar;
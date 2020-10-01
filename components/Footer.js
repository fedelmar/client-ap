import React, { useContext, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import UsuarioContext from '../context/usuarios/UsuarioContext';


const Footer = () => {

    const router = useRouter();
    const [listados, setListados] = useState(false);
    const [registros, setRegistros] = useState(false);
    const pedidoContext = useContext(UsuarioContext);
    const { rol } = pedidoContext.usuario;

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
                        <li className={router.pathname === "/registros/produccionesponjas" ? "bg-blue-800 p-2 px-5 list-none" : "p-2 px-5 list-none"}>    
                            <Link href="/registros/produccionesponjas">
                                <a className="text-white block">Producción de Esponjas</a>
                            </Link>
                        </li>
                        <li className={router.pathname === "/registros/guardadoesponjas" ? "bg-blue-800 p-2 px-5 list-none" : "p-2 px-5 list-none"}>    
                            <Link href="/registros/guardadoesponjas">
                                <a className="text-white block">Guardado de Esponjas</a>
                            </Link>
                        </li>
                        {rol === "Admin" ? 
                            <li className={router.pathname === "/registros/salidas" ? "bg-blue-800 p-2 px-5 list-none" : "p-2 px-5 list-none"}>    
                                <Link href="/registros/salidas">
                                    <a className="text-white block">Salidas</a>
                                </Link>
                            </li>
                        : null}
                    </div>
                : null}
                {listados ? 
                    <div className="relative z-10">
                        <li className={router.pathname === "/listados/productos" ? "bg-blue-800 p-2 px-5 list-none" : "p-2 px-5 list-none"}>    
                            <Link href="/listados/productos">
                                <a className="text-white block">Productos</a>
                            </Link>
                        </li>
                        <li className={router.pathname === "/listados/insumos" ? "bg-blue-800 p-2 px-5 list-none" : "p-2 px-5 list-none"}>    
                            <Link href="/listados/insumos">
                                <a className="text-white block">Insumos</a>
                            </Link>
                        </li>
                        <li className={router.pathname === "/listados/stockproductos" ? "bg-blue-800 p-2 px-5 list-none" : "p-2 px-5 list-none"}>    
                            <Link href="/listados/stockproductos">
                                <a className="text-white block">Stock de Productos</a>
                            </Link>
                        </li>
                        <li className={router.pathname === "/listados/stockinsumos" ? "bg-blue-800 p-2 px-5 list-none" : "p-2 px-5 list-none"}>    
                            <Link href="/listados/stockinsumos">
                                <a className="text-white block">Stock de Insumos</a>
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
            </nav>
            <p className="absolute bottom-0 right-0 p-2 text-white">Echo con ❤</p>
        </footer>       
    );
}

export default Footer;
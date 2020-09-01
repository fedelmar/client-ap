import React, { useContext } from 'react';
import Layout from '../components/Layout';
import Link from 'next/link';
import UsuarioContext from '../context/usuarios/UsuarioContext';
import { gql, useQuery } from '@apollo/client';
import LoteProducto from '../components/LoteProducto';

const OBTENER_STOCK = gql`
    query obtenerProductosStock{
        obtenerProductosStock{
            id
            lote
            cantidad
            producto
            estado
        }
    }
`;

const StockProductos = () => {

    const {data, loading} = useQuery(OBTENER_STOCK);

    const pedidoContext = useContext(UsuarioContext);
    const { rol } = pedidoContext.usuario;


    if(loading) return (
        <Layout>
          <p className="text-2xl text-gray-800 font-light" >Cargando...</p>
        </Layout>
    );

    //console.log(data.obtenerProductosStock);
    

    return (
        <Layout>
            <h1 className="text-2xl text-gray-800 font-light">Stock de Productos</h1>

            <Link href="nuevoloteproducto">
            <a className="bg-blue-800 py-2 px-5 mt-3 inline-block text-white rounded text-sm hover:bg-gray-800 mb-3 uppercase font-bold w-full lg:w-auto text-center">Nuevo Lote</a>
            </Link>

            <div className="overflow-x-scroll">
                <table className="table-auto shadow-md mt-2 w-full w-lg">
                {rol === "Admin" ? (
                    <thead className="bg-gray-800">
                    <tr className="text-white">
                        <th className="w-1/6 py-2">Lote</th>
                        <th className="w-1/6 py-2">Producto</th>
                        <th className="w-1/6 py-2">Cantidad</th>
                        <th className="w-1/6 py-2">Estado</th>
                        <th className="w-1/6 py-2">Editar</th>
                        <th className="w-1/6 py-2">Eliminar</th>               
                    </tr>
                    </thead>
                ) : (
                    <thead className="bg-gray-800">
                    <tr className="text-white">
                        <th className="w-1/4 py-2">Lote</th>
                        <th className="w-1/4 py-2">Producto</th>
                        <th className="w-1/4 py-2">Cantidad</th>
                        <th className="w-1/4 py-2">Estado</th>         
                    </tr>
                    </thead>
                )}   
                <tbody className="bg-white">
    
                {data.obtenerProductosStock.map( loteProducto => (
                    <LoteProducto
                        key={loteProducto.id}
                        loteProducto={loteProducto}
                        rol={rol}
                    />
                ))}  
                </tbody>
            </table>
            </div>
        </Layout>
    );
}

export default StockProductos;
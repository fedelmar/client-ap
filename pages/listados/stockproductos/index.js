import React, { useContext, useState } from 'react';
import Layout from '../../../components/Layout';
import Link from 'next/link';
import UsuarioContext from '../../../context/usuarios/UsuarioContext';
import { gql, useQuery } from '@apollo/client';
import Table from '../../../components/listados/stockproductos/Table';

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

    const {data, loading} = useQuery(OBTENER_STOCK, {
        pollInterval: 500,
    });
    const [ filtros, setFiltros ] = useState(false);
    const pedidoContext = useContext(UsuarioContext);
    const { rol } = pedidoContext.usuario;


    if(loading) return (
        <Layout>
          <p className="text-2xl text-gray-800 font-light" >Cargando...</p>
        </Layout>
    );

    let registros = data.obtenerProductosStock.map(i => i)
    registros.reverse();

    const handleOpenClose = () => {
        setFiltros(!filtros);
    }

    return (
        <Layout>
            <h1 className="text-2xl text-gray-800 font-light">Stock de Productos</h1>

            <div className="flex justify-between">
                <Link href="/listados/stockproductos/nuevoloteproducto">
                    <a className="bg-blue-800 py-2 px-5 mt-3 inline-block text-white rounded text-sm hover:bg-gray-800 mb-3 uppercase font-bold w-full lg:w-auto text-center">Nuevo Lote</a>
                </Link>
                <button onClick={() => handleOpenClose()}>
                    <a className="bg-blue-800 py-2 px-5  inline-block text-white rounded text-sm hover:bg-gray-800 uppercase font-bold w-full lg:w-auto text-center">Buscar Lote</a>
                </button>
            </div>

            <Table 
                registros={registros}
                rol={rol}
                filtros={filtros}
            />
        </Layout>
    );
}

export default StockProductos;
import React, { useContext, useState } from 'react';
import UsuarioContext from '../../../context/usuarios/UsuarioContext';
import Layout from '../../../components/Layout';
import Link from 'next/link';
import { gql, useQuery } from '@apollo/client';
import Table from '../../../components/listados/stockinsumos/Table';

const LISTA_STOCK = gql `
    query obtenerStockInsumos{
        obtenerStockInsumos{
            id
            insumo
            lote
            cantidad
        }
    }
`;

const StockInsumos = () => {

    const {data, loading} = useQuery(LISTA_STOCK);
    const [ filtros, setFiltros ] = useState(false);
    const pedidoContext = useContext(UsuarioContext);
    const { rol } = pedidoContext.usuario;

    if(loading) return (
        <Layout>
          <p className="text-2xl text-gray-800 font-light" >Cargando...</p>
        </Layout>
    );

    //console.log(data.obtenerStockInsumos);
    let registros = data.obtenerStockInsumos.map(i => i)
    registros.reverse();

    const handleOpenClose = () => {
        setFiltros(!filtros);
    }

    return (
        <Layout>
            <h1 className="text-2xl text-gray-800 font-light">Stock de Insumos</h1>

            <div className="flex justify-between">
                <Link href="/listados/stockinsumos/nuevoloteinsumo">
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

export default StockInsumos;

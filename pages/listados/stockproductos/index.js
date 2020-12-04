import React, { useContext, useState } from 'react';
import Layout from '../../../components/Layout';
import Link from 'next/link';
import UsuarioContext from '../../../context/usuarios/UsuarioContext';
import { gql, useQuery } from '@apollo/client';
import Table from '../../../components/listados/stockproductos/Table';
import TableTotal from '../../../components/listados/stockproductos/total/Table';

const OBTENER_STOCK = gql`
    query obtenerProductosStock{
        obtenerProductosStock{
            id
            lote
            cantidad
            producto
            estado
            modificado
            responsable
        }
    }
`;

const STOCK_TOTAL =  gql `
    query obtenerProductosTotal{
        obtenerProductosTotal{
            producto
            cantidad
            estado
            lotes
        }
    }
`;

const StockProductos = () => {

    const {data, loading} = useQuery(OBTENER_STOCK, {
        pollInterval: 500,
    });
    const {data: dataTotal, loading: loadingTotal} = useQuery(STOCK_TOTAL, {
        pollInterval: 500,
    });
    const [ vistaPorLotes, setVistaPorLotes ] = useState(false);
    const [ filtros, setFiltros ] = useState(false);
    const pedidoContext = useContext(UsuarioContext);
    const { rol } = pedidoContext.usuario;

    if(loading || loadingTotal) return (
        <Layout>
          <p className="text-2xl text-gray-800 font-light" >Cargando...</p>
        </Layout>
    );

    let registrosTotal = dataTotal.obtenerProductosTotal;
    let registros = data.obtenerProductosStock.map(i => i);

    const handleOpenClose = () => {
        setFiltros(!filtros);
    }

    const handleOpenCloseLotes = () => {
        setVistaPorLotes(!vistaPorLotes);
    }

    return (
        <Layout>
            <h1 className="text-2xl text-gray-800 font-light">Stock de Productos</h1>

            <div className="flex justify-between">
                <div>
                    <Link href="/listados/stockproductos/nuevoloteproducto">
                        <a className="bg-blue-800 py-2 px-5 mt-3 mr-2 inline-block text-white rounded text-sm hover:bg-gray-800 mb-3 uppercase font-bold w-full lg:w-auto text-center">Nuevo Lote</a>
                    </Link>
                    {!vistaPorLotes ? 
                        <button onClick={() => handleOpenCloseLotes()}>
                                <a className="bg-blue-800 py-2 px-5 mt-3 mr-1 inline-block text-white rounded text-sm hover:bg-gray-800 mb-3 uppercase font-bold w-full lg:w-auto text-center">Ver Totales</a>
                        </button>
                    :   <button onClick={() => handleOpenCloseLotes()}>
                            <a className="bg-blue-800 py-2 px-5 mt-3 mr-1 inline-block text-white rounded text-sm hover:bg-gray-800 mb-3 uppercase font-bold w-full lg:w-auto text-center">Ver Lotes</a>
                        </button>}
                </div>
                <button onClick={() => handleOpenClose()}>
                    <a className="bg-blue-800 py-2 px-5  inline-block text-white rounded text-sm hover:bg-gray-800 uppercase font-bold w-full lg:w-auto text-center">Buscar</a>
                </button>
            </div>

            {vistaPorLotes 
                ?   
                    <TableTotal 
                        registros={registrosTotal}
                        rol={rol}
                        filtros={filtros}
                    />
                :
                    <Table 
                        registros={registros}
                        rol={rol}
                        filtros={filtros}
                    />
            }
        </Layout>
    );
}

export default StockProductos;
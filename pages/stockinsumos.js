import React, { useContext } from 'react';
import UsuarioContext from '../context/usuarios/UsuarioContext';
import Layout from '../components/Layout';
import Link from 'next/link';
import { gql, useQuery } from '@apollo/client';
import LoteInsumo from '../components/LoteInsumo';

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

    const pedidoContext = useContext(UsuarioContext);
    const { rol } = pedidoContext.usuario;

    if(loading) return (
        <Layout>
          <p className="text-2xl text-gray-800 font-light" >Cargando...</p>
        </Layout>
    );

    //console.log(data.obtenerStockInsumos);

    return (
        <Layout>
            <h1 className="text-2xl text-gray-800 font-light">Stock de Insumos</h1>

            <Link href="nuevoloteinsumo">
                <a className="bg-blue-800 py-2 px-5 mt-3 inline-block text-white rounded text-sm hover:bg-gray-800 mb-3 uppercase font-bold w-full lg:w-auto text-center">Nuevo Lote</a>
            </Link>

            <div className="overflow-x-scroll">
                <table className="table-auto shadow-md mt-2 w-full w-lg">
                {rol === "Admin" ? (
                    <thead className="bg-gray-800">
                    <tr className="text-white">
                        <th className="w-1/5 py-2">Lote</th>
                        <th className="w-1/5 py-2">Insumo</th>
                        <th className="w-1/5 py-2">Cantidad</th>
                        <th className="w-1/5 py-2">Editar</th>
                        <th className="w-1/5 py-2">Eliminar</th>               
                    </tr>
                    </thead>
                ) : (
                    <thead className="bg-gray-800">
                    <tr className="text-white">
                        <th className="w-1/3 py-2">Lote</th>
                        <th className="w-1/3 py-2">Insumo</th>
                        <th className="w-1/3 py-2">Cantidad</th>       
                    </tr>
                    </thead>
                )}   
                <tbody className="bg-white">
    
                {data.obtenerStockInsumos.map( loteInsumo => (
                    <LoteInsumo
                        key={loteInsumo.id}
                        loteInsumo={loteInsumo}
                        rol={rol}
                    />
                ))} 
                </tbody>
            </table>
            </div>

        </Layout>
    );
}

export default StockInsumos
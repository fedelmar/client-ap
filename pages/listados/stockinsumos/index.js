import React, { useContext, useState } from "react";
import UsuarioContext from "../../../context/usuarios/UsuarioContext";
import Layout from "../../../components/Layout";
import Link from "next/link";
import { gql, useQuery } from "@apollo/client";
import Table from "../../../components/listados/stockinsumos/Table";
import TableSumados from "../../../components/listados/stockinsumos/sumados/Table";

const LISTA_STOCK = gql`
  query obtenerStockInsumos {
    obtenerStockInsumos {
      id
      insumo
      lote
      cantidad
      creado
    }
  }
`;

const LISTA_STOCK_SUMADOS = gql`
  query obtenerInsumosPorInsumo {
    obtenerInsumosPorInsumo {
      insumo
      cantidad
      categoria
      lotes
    }
  }
`;

const StockInsumos = () => {
  const { data, loading } = useQuery(LISTA_STOCK, {
    pollInterval: 500,
  });
  const { data: dataSumados, loading: loadingSumados } = useQuery(
    LISTA_STOCK_SUMADOS,
    {
      pollInterval: 500,
    }
  );
  const [filtros, setFiltros] = useState(false);
  const [vistaPorLotes, setVistaPorLotes] = useState(false);
  const pedidoContext = useContext(UsuarioContext);
  const { rol } = pedidoContext.usuario;

  if (loading || loadingSumados)
    return (
      <Layout>
        <p className="text-2xl text-gray-800 font-light">Cargando...</p>
      </Layout>
    );

  let registrosSumados = dataSumados.obtenerInsumosPorInsumo;
  let registros = data.obtenerStockInsumos.map((i) => i);

  const handleOpenClose = () => {
    setFiltros(!filtros);
  };

  const handleOpenCloseLotes = () => {
    setVistaPorLotes(!vistaPorLotes);
  };

  return (
    <Layout>
      <h1 className="text-2xl text-gray-800 font-light">Stock de Insumos</h1>

      <div className="flex justify-between">
        <div>
          <Link href="/listados/stockinsumos/nuevoloteinsumo">
            <a className="bg-blue-800 mr-2 py-2 px-5 mt-3 inline-block text-white rounded text-sm hover:bg-gray-800 mb-3 uppercase font-bold w-full lg:w-auto text-center">
              Nuevo Lote
            </a>
          </Link>
          {!vistaPorLotes ? (
            <button onClick={() => handleOpenCloseLotes()}>
              <a className="bg-blue-800 py-2 px-5 mt-3 mr-1 inline-block text-white rounded text-sm hover:bg-gray-800 mb-3 uppercase font-bold w-full lg:w-auto text-center">
                Ver por Lotes
              </a>
            </button>
          ) : (
            <button onClick={() => handleOpenCloseLotes()}>
              <a className="bg-blue-800 py-2 px-5 mt-3 mr-1 inline-block text-white rounded text-sm hover:bg-gray-800 mb-3 uppercase font-bold w-full lg:w-auto text-center">
                Insumos sumados
              </a>
            </button>
          )}
        </div>
        <button onClick={() => handleOpenClose()}>
          <a className="bg-blue-800 py-2 px-5  inline-block text-white rounded text-sm hover:bg-gray-800 uppercase font-bold w-full lg:w-auto text-center">
            Buscar
          </a>
        </button>
      </div>

      {!vistaPorLotes ? (
        <TableSumados registros={registrosSumados} filtros={filtros} />
      ) : (
        <Table registros={registros} rol={rol} filtros={filtros} />
      )}
    </Layout>
  );
};

export default StockInsumos;

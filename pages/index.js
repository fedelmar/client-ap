import React from "react";
import { useQuery, gql } from "@apollo/client";
import Layout from "../components/Layout";
import Table from "../components/pages/index/Table";
import { OBTENER_INSUMOS_FALTANTES } from "../servicios/insumos";
import {
  columnasInsumosFaltantes,
  columnasUltimosLotes,
} from "../components/pages/index/columns";

const ULTIMOS_LOTES = gql`
  query obtenerUltimosModificados {
    obtenerUltimosModificados {
      lote
      producto
      id
      cantidad
      creado
      modificado
      responsable
    }
  }
`;

const Index = () => {
  const { data, loading } = useQuery(ULTIMOS_LOTES, {
    pollInterval: 5000,
  });
  const { data: insumos, loading: loadingInsunmos } = useQuery(
    OBTENER_INSUMOS_FALTANTES
  );

  if (loading || loadingInsunmos)
    return (
      <Layout>
        <p className="text-2xl text-gray-800 font-light">Cargando...</p>
      </Layout>
    );

  const { obtenerInsumosFaltantes } = insumos;
  const insumosFaltantes = obtenerInsumosFaltantes
    .filter((i) => i.categoria !== "Placas")
    .filter((i) => i.categoria !== "Quimico");
  console.log(insumosFaltantes);

  return (
    <Layout>
      <div className="flex justify-center mt-3">
        <img src="/imagenAP.png" />
      </div>

      <div className="flex justify-center space-between mt-3">
        {data.obtenerUltimosModificados.length > 0 && (
          <div className="colum">
            <h1 className="text-2xl pl-2 text-gray-800 font-light">
              Ultimos lotes cargados
            </h1>
            <Table
              registros={data.obtenerUltimosModificados}
              columnas={columnasUltimosLotes}
            />
          </div>
        )}

        {insumosFaltantes.length > 0 && (
          <div className="colum ml-10">
            <h1 className="text-2xl pl-2 text-gray-800 font-light">
              Insumos con faltante
            </h1>
            <Table
              registros={insumosFaltantes}
              columnas={columnasInsumosFaltantes}
            />
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Index;

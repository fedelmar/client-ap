import React, { useContext, useState, useEffect } from "react";
import Link from "next/link";
import { useQuery } from "@apollo/client";

import Layout from "../../../components/Layout";
import UsuarioContext from "../../../context/usuarios/UsuarioContext";
import Table from "../../../components/registros/salidas/Table";
import { LISTA_REGISTROS } from "../../../servicios/salidas";
import ExportarPDF from "../../../components/registros/ExportarDatos";
import RegistrosPorFecha from "../../../components/registros/salidas/RegistrosPorFecha";
import FechaSelect from "../../../components/registros/FechaSelect";

const Salidas = () => {
  const usuarioContext = useContext(UsuarioContext);
  const { rol } = usuarioContext.usuario;

  const [pages, setPages] = useState(1);
  const [pdfOpen, setPdfOpen] = useState(false);
  const [filtros, setFiltros] = useState(false);
  const [registros, setRegistros] = useState([]);

  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [regs, setRegs] = useState(null);

  const { data, loading } = useQuery(LISTA_REGISTROS, {
    pollInterval: 500,
    variables: {
      page: pages,
    },
  });

  useEffect(() => {
    if (data) setRegistros([...registros, ...data.obtenerRegistrosSalidas]);
  }, [data, pages]);

  if (loading)
    return (
      <Layout>
        <p className="text-2xl text-gray-800 font-light">Cargando...</p>
      </Layout>
    );

  const handleOpenClose = (funct, state) => {
    funct(!state);
  };

  return (
    <Layout>
      <h1 className="text-2xl text-gray-800 font-light">
        Registros de Salidas
      </h1>

      <div className="flex justify-between">
        <Link href="/registros/salidas/nuevasalida">
          <a className="bg-blue-800 py-2 px-5 mt-1 inline-block text-white rounded text-sm hover:bg-gray-800 mb-3 uppercase font-bold w-full lg:w-auto text-center">
            Nueva Salida
          </a>
        </Link>
        <div>
          <button onClick={() => handleOpenClose(setFiltros, filtros)}>
            <a className="bg-blue-800 py-2 px-5 mt-1 mr-1 inline-block text-white rounded text-sm hover:bg-gray-800 mb-3 uppercase font-bold w-full lg:w-auto text-center">
              Buscar
            </a>
          </button>
          <button onClick={() => handleOpenClose(setPdfOpen, pdfOpen)}>
            <a className="bg-blue-800 py-2 px-5 mt-1 inline-block text-white rounded text-sm hover:bg-gray-800 mb-3 uppercase font-bold w-full lg:w-auto text-center">
              Exportar en pdf
            </a>
          </button>
        </div>
      </div>

      {pdfOpen ? (
        <div className="flex flex-row justify-center">
          <FechaSelect setEndDate={setEndDate} setStartDate={setStartDate} />
          {startDate && endDate ? (
            <>
              <RegistrosPorFecha
                start={startDate}
                end={endDate}
                setRegs={setRegs}
              />
              <ExportarPDF regs={regs} modelo={"SALIDAS"} />
            </>
          ) : null}
        </div>
      ) : null}

      {registros.length > 0 ? (
        <>
          <Table registros={registros} filtros={filtros} rol={rol} />
          <div className="flex justify-center mt-2">
            <button onClick={() => setPages(pages + 1)}>
              <a className="bg-blue-800 py-2 px-5 mt-1 inline-block text-white rounded text-sm hover:bg-gray-800 mb-3 uppercase font-bold w-full lg:w-auto text-center">
                Más registros...
              </a>
            </button>
          </div>
        </>
      ) : (
        <div className="bg-white border rounded shadow py-2 px-3 w-full my-3 max-w-sm text-center mx-auto">
          <p className="text-xl text-center">No hay registros para mostrar</p>
        </div>
      )}
    </Layout>
  );
};

export default Salidas;

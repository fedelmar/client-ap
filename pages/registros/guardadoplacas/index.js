import React, { useContext, useState, useEffect } from "react";
import UsuarioContext from "../../../context/usuarios/UsuarioContext";
import Layout from "../../../components/Layout";
import { useQuery } from "@apollo/client";
import Link from "next/link";
import Table from "../../../components/registros/guardadoplacas/Table";
import FechaSelect from "../../../components/registros/FechaSelect";
import ExportarPDF from "../../../components/registros/ExportarDatos";
import RegistrosPorFecha from "../../../components/registros/guardadoplacas/RegistrosPorFecha";
import {
  LISTA_REGISTROS,
  LISTA_REGISTROS_ABIERTOS,
} from "../../../servicios/guardadoDePlacas";

const GuardadoPlacas = () => {
  const usuarioContext = useContext(UsuarioContext);
  const { rol } = usuarioContext.usuario;

  const [pages, setPages] = useState(1);
  const [pdfOpen, setPdfOpen] = useState(false);
  const [filtros, setFiltros] = useState(false);
  const [activos, setActivos] = useState(false);
  const [registros, setRegistros] = useState([]);

  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [regs, setRegs] = useState(null);

  const { data: regAbiertos, loading: loadAbiertos } = useQuery(
    LISTA_REGISTROS_ABIERTOS
  );
  const { data, loading } = useQuery(LISTA_REGISTROS, {
    pollInterval: 500,
    variables: {
      page: pages,
    },
  });

  useEffect(() => {
    if (data) setRegistros([...registros, ...data.obtenerRegistrosGP]);
  }, [data, pages]);

  if (loading || loadAbiertos)
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
      <h1 className="text-2xl text-gray-800 font-light">Guardado de Placas</h1>

      <div className="flex justify-between">
        <div>
          <Link href="/registros/guardadoplacas/nuevoregistroGP">
            <a className="bg-blue-800 py-2 px-5 mt-1 inline-block text-white rounded text-sm hover:bg-gray-800 mb-3 uppercase font-bold w-full lg:w-auto text-center">
              Iniciar Registro
            </a>
          </Link>
          <button onClick={() => handleOpenClose(setActivos, activos)}>
            <a className="bg-blue-800 py-2 px-5 mt-1 ml-1 inline-block text-white rounded text-sm hover:bg-gray-800 mb-3 uppercase font-bold w-full lg:w-auto text-center">
              Registros Activos
            </a>
          </button>
        </div>
        <div>
          <button onClick={() => handleOpenClose(setFiltros, filtros)}>
            <a className="bg-blue-800 py-2 px-5 mt-1 ml-1 inline-block text-white rounded text-sm hover:bg-gray-800 mb-3 uppercase font-bold w-full lg:w-auto text-center">
              Buscar
            </a>
          </button>
          {rol === "Admin" ? (
            <button onClick={() => handleOpenClose(setPdfOpen, pdfOpen)}>
              <a className="bg-blue-800 py-2 px-5 mt-1 ml-1 inline-block text-white rounded text-sm hover:bg-gray-800 mb-3 uppercase font-bold w-full lg:w-auto text-center">
                Exportar en pdf
              </a>
            </button>
          ) : null}
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
              <ExportarPDF regs={regs} modelo={"GUARDADO_PLACAS"} />
            </>
          ) : null}
        </div>
      ) : null}

      {activos && regAbiertos.obtenerRegistrosAbiertosGP.length > 0 ? (
        <Table
          registros={regAbiertos.obtenerRegistrosAbiertosGP}
          filtros={filtros}
          rol={rol}
        />
      ) : activos ? (
        <div className="bg-white border rounded shadow py-2 px-3 w-full my-3 max-w-sm text-center mx-auto">
          <p className="text-xl text-center">
            No hay registros activos para mostrar
          </p>
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

export default GuardadoPlacas;

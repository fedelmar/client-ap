import React, { useState } from "react";
import Layout from "../../../components/Layout";
import { gql, useQuery } from "@apollo/client";
import Select from "react-select";
import FinalizarSalida from "../../../components/registros/salidas/FinalizarSalida";
import { useFormik } from "formik";
import * as Yup from "yup";
const OBTENER_PRODUCTOS_TERMINADOS = gql`
    query obtenerProductosTerminados{
        obtenerProductosTerminados{
            loteID
            lote
            producto
            cantidad
        }
    }
`;

const NuevaSalida = () => {
  const { data: dataStock, loading: loadingStock } = useQuery(
    OBTENER_PRODUCTOS_TERMINADOS,
    {
      pollInterval: 500,
    }
  );
  const [cliente, setCliente] = useState();
  const [remito, setRemito] = useState();
  const [productos, setProductos] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  const formik = useFormik({
    initialValues: {
      remito: "",
      cliente: "",
    },
    validationSchema: Yup.object({
      remito: Yup.string().required("El remito es obligatorio"),
      cliente: Yup.string().required("El cliente es obligatorio"),
    }),
    onSubmit: async (valores) => {
      const { remito, cliente } = valores;
      setRemito(remito);
      setCliente(cliente);
      handleOpenClose();
    },
  });

  if (loadingStock)
    return (
      <Layout>
        <p className="text-2xl text-gray-800 font-light">Cargando...</p>
      </Layout>
    );

  let lotes = [];
  dataStock.obtenerProductosTerminados.map((i) => {
    lotes.push({
      id: i.loteID,
      lote: i.lote,
      producto: i.producto,
      disponible: i.cantidad,
    });
  });

  const seleccionarLote = (value) => {
    setProductos(value);
  };

  const handleOpenClose = () => {
    setIsOpen(!isOpen);
  };

  return (
    <Layout>
      <h1 className="text-2xl text-gray-800 font-light">Nueva Salida</h1>
      {!isOpen ? (
        <div className="flex justify-center mt-5">
          <div className="w-full max-w-lg">
            <form onSubmit={formik.handleSubmit}>
              <div className="bg-white shadow-md px-8 pt-6 pb-8 mb-4">
                <p className="block text-gray-700 text-sm font-bold mb-2">
                  Remito
                </p>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 mb-2 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="remito"
                  type="text"
                  placeholder="Ingrese el remito"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.remito}
                />

                {formik.touched.remito && formik.errors.remito ? (
                  <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                    <p className="font-bold">Error</p>
                    <p>{formik.errors.remito}</p>
                  </div>
                ) : null}

                <p className="block text-gray-700 text-sm font-bold mb-2">
                  Seleccione el Cliente
                </p>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 mb-2 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="cliente"
                  type="text"
                  placeholder="Ingrese el cliente"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.cliente}
                />

                {formik.touched.cliente && formik.errors.cliente ? (
                  <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                    <p className="font-bold">Error</p>
                    <p>{formik.errors.cliente}</p>
                  </div>
                ) : null}

                <p className="block text-gray-700 text-sm font-bold mb-2">
                  Seleccione el Lote
                </p>
                <Select
                  className="mt-3"
                  options={lotes}
                  onChange={(opcion) => seleccionarLote(opcion)}
                  getOptionValue={(opciones) => opciones.id}
                  getOptionLabel={(opciones) =>
                    `${opciones.lote} Disponibles: ${opciones.disponible}`
                  }
                  noOptionsMessage={() => "No hay resultados"}
                  placeholder="Lote..."
                  isMulti
                />
                <input
                  type="submit"
                  className="bg-gray-800 w-full mt-5 p-2 text-white uppercase font-bold hover:bg-gray-900"
                  value="Seleccionar Cantidades"
                />
              </div>
            </form>
          </div>
        </div>
      ) : (
        <div className="flex justify-center mt-5">
          <div className="w-full max-w-lg">
            <div className="bg-white shadow-md px-8 pt-6 pb-8 mb-4">
              <FinalizarSalida
                productos={productos}
                cliente={cliente}
                remito={remito}
              />
              <button
                onClick={() => handleOpenClose()}
                className="bg-gray-800 w-full mt-5 p-2 text-white uppercase font-bold hover:bg-gray-900"
              >
                Volver
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default NuevaSalida;

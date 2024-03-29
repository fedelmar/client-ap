import React, { useState, useContext } from "react";
import { Formik, Form, FieldArray } from "formik";
import * as Yup from "yup";
import { gql, useMutation } from "@apollo/client";
import { useRouter } from "next/router";
import Swal from "sweetalert2";
import UsuarioContext from "../../../context/usuarios/UsuarioContext";
import MiniSpinner from "../../MiniSpiner";
import { NUEVA_SALIDA, LISTA_REGISTROS } from "../../../servicios/salidas";

const FinalizarSalida = (datos) => {
  const router = useRouter();
  const { cliente, productos, remito } = datos;
  const usuarioContext = useContext(UsuarioContext);
  const { nombre } = usuarioContext.usuario;
  const [mensaje, guardarMensaje] = useState(null);
  const [loading, setLoading] = useState(false);
  const [nuevoRegistroSalida] = useMutation(NUEVA_SALIDA);

  const schema = Yup.object().shape({
    friends: Yup.array().of(
      Yup.object().shape({
        id: Yup.string().required("Required"),
        lote: Yup.string().required("Required"),
        producto: Yup.string().required("Required"),
        disponible: Yup.number(),
        cantidad: Yup.number(),
      })
    ),
  });

  const handleSubmit = async (valores) => {
    const { lotes } = valores;
    const lotesAGuardar = [];

    lotes.forEach((index) => {
      lotesAGuardar.push({
        loteID: index.id,
        lote: index.lote,
        producto: index.producto,
        cantidad: index.cantidad,
      });
    });

    Swal.fire({
      title: "Verifique los datos antes de confirmar",
      html: "Remitp: " + remito + "</br>" + "Cliente: " + cliente + "</br>",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Confirmar",
      cancelButtonText: "Cancelar",
    }).then(async (result) => {
      if (result.value) {
        try {
          setLoading(true);
          const { data } = await nuevoRegistroSalida({
            variables: {
              input: {
                operario: nombre,
                cliente: cliente,
                remito: remito,
                lotes: lotesAGuardar,
              },
            },
          });
          if (data) {
            setLoading(false);
          }
          Swal.fire(
            "Se creo un nuevo registro y se descontaron los lotes del stock de productos",
            " ",
            "success"
          );
          router.push("/registros/salidas");
        } catch (error) {
          setLoading(false);
          guardarMensaje(error.message.replace("GraphQL error: ", ""));
        }
      }
    });
  };

  // Mostrar mensaje de base de datos si hubo un error
  const mostrarMensaje = () => {
    return (
      <div className="bg-white py-2 px-3 w-full my-3 max-w-sm text-center mx-auto">
        <p>{mensaje}</p>
      </div>
    );
  };

  return (
    <div>
      {mensaje && mostrarMensaje()}

      <div className="flex justify-between border-b-2 border-gray-600 mb-2">
        <div className="flex">
          <p className="block text-gray-700 text-m font-bold mb-2 pr-2">
            Remito:
          </p>
          <p className="block text-gray-700 text-m mb-2">{remito}</p>
        </div>
        <div className="flex">
          <p className="block text-gray-700 text-m font-bold mb-2 pr-2">
            Cliente:
          </p>
          <p className="block text-gray-700 text-m mb-2">{cliente}</p>
        </div>
      </div>
      <p className="block text-center text-gray-700 text-xl font-bold mb-2">
        Seleccione las cantidades
      </p>
      <Formik
        initialValues={{ lotes: productos }}
        onSubmit={(values) => handleSubmit(values)}
        validationSchema={schema}
        render={({ values }) => (
          <Form>
            <FieldArray
              name="lotes"
              render={(arrayHelpers) => (
                <div>
                  {values.lotes && values.lotes.length > 0
                    ? values.lotes.map((lote, index) => (
                        <div key={index}>
                          <div className="flex">
                            <div className="flex">
                              <p className="text-gray-700 text-m font-bold pr-2 pt-1">
                                Lote:{" "}
                              </p>
                              <p className="text-gray-700 text-m font-light pb-1 pt-1">
                                {lote.lote}
                              </p>
                            </div>
                            <div className="flex">
                              <p className="text-gray-700 text-m font-bold pr-2 pl-2 pt-1">
                                Producto:{" "}
                              </p>
                              <p className="text-gray-700 text-m font-light pb-1 pt-1">
                                {lote.producto}
                              </p>
                            </div>
                            <div className="flex">
                              <p className="text-gray-700 text-m font-bold pr-2 pl-2 pt-1">
                                Disponibles:{" "}
                              </p>
                              <p className="text-gray-700 text-m font-light pb-1 pt-1">
                                {lote.disponible}
                              </p>
                            </div>
                          </div>
                          <input
                            onChange={() =>
                              arrayHelpers.replace(index, {
                                lote: lote.lote,
                                producto: lote.producto,
                                disponible: lote.disponible,
                                cantidad: parseInt(event.target.value),
                                id: lote.id,
                              })
                            }
                            type="number"
                            id="cantidad"
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                          />
                        </div>
                      ))
                    : null}
                  <div>
                    <button
                      className={
                        loading
                          ? "bg-gray-400 w-full mt-5 p-2 text-white uppercase font-bold"
                          : "bg-green-800 w-full mt-5 p-2 text-white uppercase font-bold hover:bg-green-900"
                      }
                      type="submit"
                      disabled={loading}
                    >
                      {!loading ? (
                        "Finalizar Registro"
                      ) : (
                        <MiniSpinner type={"spin"} color={"#4A90E2"} />
                      )}
                    </button>
                  </div>
                </div>
              )}
            />
          </Form>
        )}
      />
    </div>
  );
};

export default FinalizarSalida;

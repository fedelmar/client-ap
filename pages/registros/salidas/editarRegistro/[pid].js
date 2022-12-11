import React, { useEffect, useState } from 'react'
import { format } from 'date-fns'
import { useRouter } from 'next/router'
import { Formik } from 'formik'
import Swal from 'sweetalert2'
import * as Yup from 'yup'
import { useQuery, useMutation } from '@apollo/client'

import Layout from '../../../../components/Layout'

import { EDITAR_SALIDA, OBTENER_REGISTRO } from '../../../../servicios/salidas'

const EditarRegistro = () => {
  const router = useRouter()
  const { query } = router
  if (!query) return null
  const { pid: id } = query
  console.log
  const [actualizarRegistroSalida] = useMutation(EDITAR_SALIDA)
  const { data, loading } = useQuery(OBTENER_REGISTRO, {
    variables: {
      id
    }
  })
  const [registro, setRegistro] = useState()
  const schemaValidacion = Yup.object({
    cliente: Yup.string(),
    remito: Yup.string()
  })
  useEffect(() => {
    if (data) {
      const { obtenerRegistroSalida } = data
      console.log(obtenerRegistroSalida)
      setRegistro({
        ...obtenerRegistroSalida
      })
    }
  }, [data])

  if (loading || !registro)
    return (
      <Layout>
        <p className="text-2xl text-gray-800 font-light">Cargando...</p>
      </Layout>
    )

  const finalizar = async (valores) => {
    const { cliente, remito } = valores
    Swal.fire({
      title: 'Verifique los datos antes de confirmar',
      html: 'Cliente: ' + cliente + '</br>' + 'Remito: ' + remito + '</br>',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Confirmar',
      cancelButtonText: 'Cancelar'
    }).then(async (result) => {
      if (result.value) {
        try {
          const { data } = actualizarRegistroSalida({
            variables: {
              id,
              input: {
                cliente,
                remito
              }
            }
          })
          console.log(data)
          Swal.fire('Se actualizo el registro y el stock', ' ', 'success')
          router.push("/registros/salidas");
        } catch (error) {
          console.log(error)
        }
      }
    })
  }

  return (
    <Layout>
      <h1 className="text-2xl text-gray-800 font-light">Editar Registro</h1>

      <div className="flex justify-center mt-5">
        <div className="w-full bg-white shadow-md px-8 pt-6 pb-8 mb-4 max-w-lg">
          <div className="mb-2 border-b-2 border-gray-600">
            <div className="flex justify-between pb-2">
              <div className="flex">
                <p className="text-gray-700 text-mm font-bold mr-1">Dia: </p>
                <p className="text-gray-700 font-light">
                  {format(new Date(registro.fecha), "dd/MM/yy")}
                </p>
              </div>
              <div className="flex">
                <p className="text-gray-700 text-mm font-bold mr-1">
                  Horario:{" "}
                </p>
                <p className="text-gray-700 font-light">
                  {format(new Date(registro.fecha), "HH:mm")}
                </p>
              </div>
            </div>
          </div>

          <Formik
            validationSchema={schemaValidacion}
            enableReinitialize
            initialValues={registro}
            onSubmit={(valores) => {
              finalizar(valores);
            }}
          >
            {(props) => {
              return (
                <form
                  className="bg-white shadow-md px-8 pt-6 pb-8 mb-4"
                  onSubmit={props.handleSubmit}
                >
                  <div className="mb-4">
                    <label
                      className="block text-gray-700 text-sm font-bold mb-2"
                      htmlFor="lote"
                    >
                      Cliente
                    </label>

                    <input
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      id="cliente"
                      type="string"
                      placeholder="Cliente"
                      onChange={props.handleChange}
                      onBlur={props.handleBlur}
                      value={props.values.cliente}
                    />
                  </div>

                  {props.touched.cliente && props.errors.cliente ? (
                    <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                      <p className="font-bold">Error</p>
                      <p>{props.errors.cliente}</p>
                    </div>
                  ) : null}

                  <div className="mb-4">
                    <label
                      className="block text-gray-700 text-sm font-bold mb-2"
                      htmlFor="cantProducida"
                    >
                      Remito
                    </label>

                    <input
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      id="remito"
                      type="string"
                      placeholder="Remito"
                      onChange={props.handleChange}
                      onBlur={props.handleBlur}
                      value={props.values.remito}
                    />
                  </div>

                  {props.touched.remito && props.errors.remito ? (
                    <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                      <p className="font-bold">Error</p>
                      <p>{props.errors.remito}</p>
                    </div>
                  ) : null}

                  <input
                    type="submit"
                    className="bg-gray-800 w-full mt-5 p-2 text-white uppercase font-bold hover:bg-gray-900"
                    value="Editar Registro"
                  />
                </form>
              );
            }}
          </Formik>
        </div>
      </div>
    </Layout>
  )
}

export default EditarRegistro

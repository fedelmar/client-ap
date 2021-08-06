import React, { useContext, useState } from 'react';
import Select from 'react-select';
import { format } from 'date-fns';
import { useRouter } from 'next/router';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import Swal from 'sweetalert2';
import { useQuery, useMutation } from '@apollo/client';

import Layout from '../../../../components/Layout';
import UsuarioContext from '../../../../context/usuarios/UsuarioContext';
import SelectInsumo from '../../../../components/registros/SelectInsumos';
import { GELES_EN_PROCESO, NUEVO_DOBLE_REGISTRO, ELIMINAR_REGISTRO } from '../../../../servicios/produccionDeGel';

const index = () => {
  const router = useRouter();  
  const usuarioContext = useContext(UsuarioContext);
  const { nombre: operario } = usuarioContext.usuario;
  const { data, loading } = useQuery(GELES_EN_PROCESO, {
    pollInterval: 500,
  });
  const [ nuevoDobleRegistroCPG ] = useMutation(NUEVO_DOBLE_REGISTRO);
  const [ eliminarRegistroCPG ] = useMutation(ELIMINAR_REGISTRO);
  const [loteGel, setLoteGel] = useState({});
  const [bolsaCristal, setBolsaCristal] = useState({});
  const [secionActiva, setSecionActiva] = useState();

  const cierre = useFormik({
    initialValues: {
        cantProducida: 0,
        cantDescarteBolsaCristal: 0,
        puesto1: '',
        puesto2: '',
        observaciones: ''
    },
    validationSchema: Yup.object({
        cantProducida: Yup.number().required('Ingrese la cantidad producida'),
        cantDescarteBolsaCristal: Yup.number().required('Ingrese el descarte de bolsa crital'),
        puesto1: Yup.string().required('Ingrese los operarios en el Puesto 1'),
        puesto2: Yup.string().required('Ingrese los operarios en el Puesto 2'),
        observaciones: Yup.string(),
    }), 
    onSubmit: valores => {
        finalizarRegistro(valores);
    }
  });

  if(loading) return (
    <Layout>
      <p className="text-2xl text-gray-800 font-light" >Cargando...</p>
    </Layout>
  );
  const listaLotes = data.obtenerStockGelesEnProceso;

  const seleccionarLote = value => {
    const { productoId, lote, producto } = value;
    setLoteGel({ productoId, lote, producto})
  };

  const seleccionarInsumo = value => {
    const { lote, cantidad } = value;
    setBolsaCristal({ lote, cantidad });
  };

  const iniciarProduccion = async () => {
    const { producto, lote } = loteGel;
    try {
      const { data } = await nuevoDobleRegistroCPG({
        variables: {
          input: {
            operario,
            lote,
            producto,
            loteBolsaCristal: bolsaCristal.lote,
          }
        }
      })
      setSecionActiva({ ...data.nuevoDobleRegistroCPG });
    } catch (error) {
      console.log(error)
    }
  };

  const finalizarRegistro = valores => {
    const { cantProducida, cantDescarteBolsaCristal, puesto1, puesto2, observaciones } = valores;
    const { lote, producto, cantDescarte, cliente, loteBolsa, loteBolsaCristal, loteGel, id } = secionActiva;
    let msjManta;
    secionActiva.manta ? msjManta = "Si" : msjManta = "No";

    Swal.fire({
        title: 'Verifique los datos antes de confirmar',
        html:   "Lote: " + lote + "</br>" + 
                "Producto: " + producto + "</br>" +
                "Cantidad Producida: " + cantProducida + "</br>" + 
                "Operario: " + operario + "</br>" +
                "Cliente: " + cliente + "</br>" +
                "Lote de Bolsa: " + loteBolsa + "</br>" +
                "Lote de Cristal: " + loteBolsaCristal + "</br>" +
                "Lote de Gel: " + loteGel + "</br>" +
                "Manta: " + msjManta + "</br>" +
                "Cantidad de descarte: " + cantDescarteBolsaCristal + "</br>" +
                "Puesto 1: " + puesto1 + "</br>" +
                "Puesto 2: " + puesto2 + "</br>" +
                "Observaciones: " + observaciones + "</br>",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Confirmar',
        cancelButtonText: 'Cancelar'
    }).then( async (result) => {
        if (result.value) {
            try {
                const { data } = await nuevoDobleRegistroCPG({
                    variables: {
                        id,
                        input: {      
                            operario,
                            cantProducida,
                            cantDescarteBolsaCristal,
                            puesto1,
                            puesto2,
                            observaciones,
                            lote, 
                            producto, 
                            cliente,
                            loteBolsa,
                            loteBolsaCristal,
                            loteGel,
                            cantDescarte,
                        }   
                    }                
                });
                Swal.fire(
                    'Se guardo el registro y se actualizo el stock de productos',
                    'Primer registro creado',
                    'success'
                )
                router.push('/registros/producciongel');
            } catch (error) {
                console.log(error)
            }
        }
    })  
  }

  // Funcion para volver a iniciar en caso de algun Error
  const volver = async () => {
    const { data } = await eliminarRegistroCPG({
      variables: {
        id: secionActiva.id
      }
    });      
    setSecionActiva(undefined);
  };

  return (
      <Layout>
        <h1 className='text-2xl text-gray-800 font-light'>Nuevo Registro de Producción de Gel - Doble Bolsa</h1>
        <div className="flex justify-center mt-5">
          <div className="w-full max-w-lg">
            {!secionActiva ? 
              <div className="bg-white shadow-md px-8 pt-6 pb-8 mb-4">
                <p className="block text-gray-700 font-bold mb-2">Seleccione el lote de Producto</p>
                  <Select
                      className="mt-3 mb-4"
                      options={listaLotes}
                      onChange={opcion => seleccionarLote(opcion)}
                      getOptionValue={ opcion => opcion.productoId }
                      getOptionLabel={ opcion => `Lote: ${opcion.lote} - Producto: ${opcion.producto}`}
                      placeholder="Lotes en Proceso..."
                      noOptionsMessage={() => "No hay resultados"}
                      isMulti={false}
                  />
                {loteGel.productoId ?
                  <>
                    <p className="block text-gray-700 font-bold mb-2">Lote de Bolsa Cristal</p>
                    <SelectInsumo productoID={loteGel.productoId} funcion={seleccionarInsumo} categoria={"Polietileno"} />
                  </>
                : null}
                <button 
                  className="bg-gray-800 w-full mt-5 p-2 text-white uppercase font-bold hover:bg-gray-900"
                  onClick={() => iniciarProduccion()}
                >
                    Iniciar Producción
                </button>
                <button
                    className="bg-green-700 w-full mt-2 p-2 text-white uppercase font-bold hover:bg-green-900" 
                    onClick={() => router.push('/registros/producciongel/dobleRegistro/nuevoRegistro')}
                >
                    Volver
                </button>
              </div>
            : 
              <div className="flex justify-center mt-5">
                <div className="w-full bg-white shadow-md px-8 pt-6 pb-8 mb-4 max-w-lg">
                  <div className="mb-2 border-b-2 border-gray-600">
                    <div className="flex justify-between pb-2">
                      <div className="flex">
                        <p className="text-gray-700 text-mm font-bold mr-1">Dia: </p>
                        <p className="text-gray-700 font-light">{format(new Date(secionActiva.creado), 'dd/MM/yy')}</p>
                    </div>
                      <div className="flex">
                        <p className="text-gray-700 text-mm font-bold mr-1">Hora de inicio: </p>
                        <p className="text-gray-700 font-light">{format(new Date(secionActiva.creado), 'HH:mm')}</p>
                      </div>
                    </div>
                    <div className="flex">
                      <p className="text-gray-700 text-mm font-bold mr-1">Lote: </p>
                      <p className="text-gray-700 font-light">{secionActiva.lote}</p>
                    </div>
                    <div className="flex">
                      <p className="text-gray-700 text-mm font-bold mr-1">Producto: </p>
                      <p className="text-gray-700 font-light">{secionActiva.producto}</p>
                    </div>
                    <div className="flex">
                      <p className="text-gray-700 text-mm font-bold mr-1">Cliente: </p>
                      <p className="text-gray-700 font-light">{secionActiva.cliente}</p>
                    </div>
                    <div className="flex">
                      <p className="text-gray-700 text-mm font-bold mr-1">Manta: </p>
                      <p>{secionActiva.manta ? '✔' : '✘'}</p>
                    </div>
                    <div className="flex">
                      <p className="text-gray-700 text-mm font-bold mr-1">Lote de Gel: </p>
                      <p className="text-gray-700 font-light">{secionActiva.loteGel}</p>
                    </div>
                    <div className="flex">
                      <p className="text-gray-700 text-mm font-bold mr-1">Lote de Bolsa: </p>
                      <p className="text-gray-700 font-light">{secionActiva.loteBolsa}</p>
                    </div>
                  <div className="flex justify-between pb-2">
                    <div className="flex">
                        <p className="text-gray-700 text-mm font-bold mr-1">Lote de Bolsa Cristal: </p>
                        <p className="text-gray-700 font-light">{secionActiva.loteBolsaCristal}</p>
                    </div>
                    <div className="flex">
                        <p className="text-gray-700 text-mm font-bold mr-1">Disponibles: </p>
                        <p className="text-gray-700 font-light">{bolsaCristal.cantidad}</p>
                    </div>
                  </div>
                  </div> 
                  <form
                    className="bg-white shadow-md px-8 pt-2 pb-8 mb-2"
                    onSubmit={cierre.handleSubmit}
                > 
                  <div className="mb-4">
                    <label className="block text-gray-700 font-bold mb-2" htmlFor="cantProducida">
                        Cantidad producida
                    </label>

                    <input
                        className="shadow appearance-none border rounded w-full mb-1 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        id="cantProducida"
                        type="number"
                        placeholder="Ingrese la cantidad de bolsas descartadas..."
                        onChange={cierre.handleChange}
                        onBlur={cierre.handleBlur}
                        value={cierre.values.cantProducida}
                    />
                  </div>

                  { cierre.touched.cantProducida && cierre.errors.cantProducida ? (
                      <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4" >
                          <p className="font-bold">Error</p>
                          <p>{cierre.errors.cantProducida}</p>
                      </div>
                  ) : null  }
                                           
                  <div className="mb-4">
                      <label className="block text-gray-700 font-bold mb-2" htmlFor="cantDescarteBolsaCristal">
                          Descarte de Bolsa Cristal
                      </label>

                      <input
                          className="shadow appearance-none border rounded w-full mb-1 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                          id="cantDescarteBolsaCristal"
                          type="number"
                          placeholder="Ingrese la cantidad de bolsas descartadas..."
                          onChange={cierre.handleChange}
                          onBlur={cierre.handleBlur}
                          value={cierre.values.cantDescarteBolsaCristal}
                      />
                  </div>

                  { cierre.touched.cantDescarteBolsaCristal && cierre.errors.cantDescarteBolsaCristal ? (
                      <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4" >
                          <p className="font-bold">Error</p>
                          <p>{cierre.errors.cantDescarteBolsaCristal}</p>
                      </div>
                  ) : null  }

                  <div className="mb-4">
                      <label className="block text-gray-700 font-bold mb-2" htmlFor="puesto1">
                          Puesto 1
                      </label>

                      <input
                          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                          id="puesto1"
                          type="text"
                          placeholder="Ingrese integrantes del Puesto 1"
                          onChange={cierre.handleChange}
                          onBlur={cierre.handleBlur}
                          value={cierre.values.puesto1}
                      />
                  </div>

                  { cierre.touched.puesto1 && cierre.errors.puesto1 ? (
                      <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4" >
                          <p className="font-bold">Error</p>
                          <p>{cierre.errors.puesto1}</p>
                      </div>
                  ) : null  }

                  <div className="mb-4">
                      <label className="block text-gray-700 font-bold mb-2" htmlFor="puesto2">
                          Puesto 2
                      </label>

                      <input
                          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                          id="puesto2"
                          type="text"
                          placeholder="Ingrese integrantes del Puesto 2"
                          onChange={cierre.handleChange}
                          onBlur={cierre.handleBlur}
                          value={cierre.values.puesto2}
                      />
                  </div>

                  { cierre.touched.puesto2 && cierre.errors.puesto2 ? (
                      <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4" >
                          <p className="font-bold">Error</p>
                          <p>{cierre.errors.puesto2}</p>
                      </div>
                  ) : null  }

                  <div className="mb-2">
                      <label className="block text-gray-700 font-bold mb-2" htmlFor="observaciones">
                          Observaciones
                      </label>

                      <input
                          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                          id="observaciones"
                          type="text"
                          placeholder="Observaciones..."
                          onChange={cierre.handleChange}
                          onBlur={cierre.handleBlur}
                          value={cierre.values.observaciones}
                      />
                  </div>

                  { cierre.touched.observaciones && cierre.errors.observaciones ? (
                      <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4" >
                          <p className="font-bold">Error</p>
                          <p>{cierre.errors.observaciones}</p>
                      </div>
                  ) : null  }

                  <input
                      type="submit"
                      className="bg-red-800 w-full mt-2 p-2 text-white uppercase font-bold hover:bg-red-900"
                      value="Finalizar Registro"
                  />
                  <button
                      className="bg-green-700 w-full mt-2 p-2 text-white uppercase font-bold hover:bg-green-900" 
                      onClick={() => volver()}
                      type='button'
                  >
                      Volver
                  </button>
                </form>
                </div>
                
              </div>  
          }
          </div>
        </div>
      </Layout>
  );
};

export default index;
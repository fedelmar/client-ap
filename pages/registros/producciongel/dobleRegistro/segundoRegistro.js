import React, { useContext, useState } from 'react';
import Select from 'react-select';
import { useRouter } from 'next/router';
import { useQuery, useMutation } from '@apollo/client';

import Layout from '../../../../components/Layout';
import UsuarioContext from '../../../../context/usuarios/UsuarioContext';
import SelectInsumo from '../../../../components/registros/SelectInsumos';
import { GELES_EN_PROCESO, NUEVO_DOBLE_REGISTRO, ELIMINAR_REGISTRO } from '../../../../servicios/produccionDeGel';
import FormCristal from './FormCristal';

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
  const [sesionActiva, setSesionActiva] = useState();

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
      setSesionActiva({ ...data.nuevoDobleRegistroCPG });
    } catch (error) {
      console.log(error)
    }
  };

  // Funcion para volver a iniciar en caso de algun Error
  const volver = async () => {
    await eliminarRegistroCPG({
      variables: {
        id: sesionActiva.id
      }
    });      
    setSesionActiva(undefined);
  };

  return (
      <Layout>
        <h1 className='text-2xl text-gray-800 font-light'>Nuevo Registro de Producción de Gel - Doble Bolsa</h1>
        <div className="flex justify-center mt-5">
          <div className="w-full max-w-lg">
            {!sesionActiva ? 
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
              <FormCristal sesionActiva={sesionActiva} volver={volver} bolsaCristal={bolsaCristal} />
          }
          </div>
        </div>
      </Layout>
  );
};

export default index;
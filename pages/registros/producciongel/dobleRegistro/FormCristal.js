import React, { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { useRouter } from 'next/router';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import Swal from 'sweetalert2';
import { useMutation } from '@apollo/client';
import { NUEVO_DOBLE_REGISTRO } from '../../../../servicios/produccionDeGel';

const FormCristal = ({sesionActiva, volver, bolsaCristal}) => {
  const router = useRouter(); 
  const [ nuevoDobleRegistroCPG ] = useMutation(NUEVO_DOBLE_REGISTRO);
  const [registro, setRegistro] = useState({});

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

  useEffect(() => {
    if (sesionActiva) {
        setRegistro({...sesionActiva, cantidad: bolsaCristal.cantidad});
    }
  }, [sesionActiva])

  const finalizarRegistro = valores => {
    const { cantProducida, cantDescarteBolsaCristal, puesto1, puesto2, observaciones } = valores;
    const { lote, producto, cantDescarte, cliente, loteBolsa, loteBolsaCristal, loteGel, id, operario } = registro;
    let msjManta;
    registro.manta ? msjManta = "Si" : msjManta = "No";

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
                    '¡Bien hecho!',
                    'success'
                )
                router.push('/registros/producciongel');
            } catch (error) {
                console.log(error)
            }
        }
    })  
  };

  return (
      <div className="w-full bg-white shadow-md px-8 pt-6 pb-8 mb-4 max-w-lg">
        <div className="mb-2 border-b-2 border-gray-600">
          <div className="flex justify-between pb-2">
            <div className="flex">
              <p className="text-gray-700 text-mm font-bold mr-1">Dia: </p>
              <p className="text-gray-700 font-light">{registro.creado ? format(new Date(registro.creado), 'dd/MM/yy') : null}</p>
          </div>
            <div className="flex">
              <p className="text-gray-700 text-mm font-bold mr-1">Hora de inicio: </p>
              <p className="text-gray-700 font-light">{registro.creado ?  format(new Date(registro.creado), 'HH:mm') : null}</p>
            </div>
          </div>
          <div className="flex">
            <p className="text-gray-700 text-mm font-bold mr-1">Lote: </p>
            <p className="text-gray-700 font-light">{registro.lote}</p>
          </div>
          <div className="flex">
            <p className="text-gray-700 text-mm font-bold mr-1">Producto: </p>
            <p className="text-gray-700 font-light">{registro.producto}</p>
          </div>
          <div className="flex">
            <p className="text-gray-700 text-mm font-bold mr-1">Cliente: </p>
            <p className="text-gray-700 font-light">{registro.cliente}</p>
          </div>
          <div className="flex">
            <p className="text-gray-700 text-mm font-bold mr-1">Manta: </p>
            <p>{registro.manta ? '✔' : '✘'}</p>
          </div>
          <div className="flex">
            <p className="text-gray-700 text-mm font-bold mr-1">Lote de Gel: </p>
            <p className="text-gray-700 font-light">{registro.loteGel}</p>
          </div>
          <div className="flex">
            <p className="text-gray-700 text-mm font-bold mr-1">Lote de Bolsa: </p>
            <p className="text-gray-700 font-light">{registro.loteBolsa}</p>
          </div>
        <div className="flex justify-between pb-2">
          <div className="flex">
              <p className="text-gray-700 text-mm font-bold mr-1">Lote de Bolsa Cristal: </p>
              <p className="text-gray-700 font-light">{registro.loteBolsaCristal}</p>
          </div>
          <div className="flex">
              <p className="text-gray-700 text-mm font-bold mr-1">Disponibles: </p>
              <p className="text-gray-700 font-light">{registro.cantidad}</p>
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
  );
};

export default FormCristal;
import React, { useState, useEffect, useContext } from 'react';
import { format } from 'date-fns';
import { useRouter} from 'next/router';
import { gql, useQuery, useMutation } from '@apollo/client';
import Layout from '../../../../components/Layout';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import UsuarioContext from '../../../../context/usuarios/UsuarioContext';
import Swal from 'sweetalert2';

const REGISTRO = gql `
    query obtenerRegistroPP($id: ID!){
        obtenerRegistroPP(id: $id){
            creado
            producto
            operario
            lote
            lTapon
            lPcm
            lPlaca
        }
    }
`;

const LOTE_INSUMO = gql `
    query obtenerInsumoPorLote($input: String!){
        obtenerInsumoPorLote(input: $input){
            id
            cantidad
            insumo
        }
    }
`;

const NUEVO_REGISTRO = gql `
    mutation nuevoRegistroPP($id: ID, $input: CPPInput){
        nuevoRegistroPP(id: $id, input: $input){
            id
            creado
            modificado
            operario
            lote
            producto
            lTapon
            lPcm
            lPlaca
            cantProducida
            cantDescarte
            auxiliar
            observaciones
            estado
        }
    }
`;

const FinalizarRegistro = () => {

    const router = useRouter();
    const { query: { id } } = router;
    const usuarioContext = useContext(UsuarioContext);
    const { productos } = usuarioContext;
    const { nombre } = usuarioContext.usuario;
    const [registro, setRegistro] = useState({
        placaDisp: 0,
        taponDisp: 0,
        lPlaca: '',
        lTapon: ''
    });
    const { data, loading } = useQuery(REGISTRO, {
        variables: {
            id
        }
    });    
    const { data: dataTapon, loading: loadingTapon } = useQuery(LOTE_INSUMO, {
        variables: {
            input: registro.lTapon
        }
    });
    const { data: dataPlaca, loading: loadingPlaca } = useQuery(LOTE_INSUMO, {
        variables: {
            input: registro.lPlaca
        }
    });
    const [ nuevoRegistroPP ] = useMutation(NUEVO_REGISTRO);
    // Formato del formulario de cierre de sesion
    let menor;
    registro.taponDisp <= registro.placaDisp ? menor = registro.taponDisp : menor = registro.placaDisp;
    const formikCierre = useFormik({
        initialValues: {
            cantProducida: 0,
            cantDescarte: 0,
            observaciones: '',
            pcmFinalizado: false,
            auxiliar: ''
        },
        validationSchema: Yup.object({
            cantProducida: Yup.number()
                            .max(menor, `Debe ser menor o igual a ${menor}`)
                            .required('Ingrese la cantidad Producida'),
            cantDescarte: Yup.number()
                            .max(Yup.ref('cantProducida'), `Debe ser menor a la cantidad producida`)
                            .required('Ingrese el descarte generado'),
            auxiliar: Yup.string(),
            observaciones: Yup.string()               
        }),
        onSubmit: valores => {       
            terminarProduccion(valores);            
        }
    });
    // Iniciar estado según base de datos
    useEffect(() => {
        if (data) {
            const { obtenerRegistroPP } = data;
            setRegistro({...registro,
                lote: obtenerRegistroPP.lote,
                creado: obtenerRegistroPP.creado,
                producto: obtenerRegistroPP.producto,
                lPcm: obtenerRegistroPP.lPcm,
                lPlaca: obtenerRegistroPP.lPlaca,
                lTapon: obtenerRegistroPP.lTapon
            })
        }
        if ((registro.lPlaca && registro.lTapon) !== '' && (dataPlaca && dataTapon)) {
            setRegistro({...registro,
                lTaponID: dataTapon.obtenerInsumoPorLote.id,
                taponDisp: dataTapon.obtenerInsumoPorLote.cantidad,
                lPlacaID: dataPlaca.obtenerInsumoPorLote.id,
                placaDisp: dataPlaca.obtenerInsumoPorLote.cantidad
            })
        }
    }, [data, dataPlaca])

    if(loading || loadingPlaca || loadingTapon) return (
        <Layout>
          <p className="text-2xl text-gray-800 font-light" >Cargando...</p>
        </Layout>
    );

    // Encontrar id segun nombre del producto
    let producto = productos.find(i => i.nombre === registro.producto);

    const terminarProduccion = valores => {
        const {observaciones, cantDescarte, cantProducida, pcmFinalizado, auxiliar} = valores;
        let msjPCM;
        pcmFinalizado ? msjPCM = ' finalizado.' : msjPCM = ' sin terminar.';
        Swal.fire({
            title: 'Verifique los datos antes de confirmar',
            html:   "Lote: " + registro.lote + "</br>" + 
                    "Producto: " + registro.producto + "</br>" +
                    "Operario: " + nombre + "</br>" +
                    "Lote de Placa: " + registro.lPlaca + "</br>" +
                    "Lote de Tapón: " + registro.lTapon + "</br>" +
                    "Lote de Pcm: " + registro.lPcm + msjPCM + "</br>" +
                    "Cantidad producida: " + cantProducida + "</br>" +
                    "Cantidad de descarte: " + cantDescarte + "</br>" +
                    "Auxiliares: " + auxiliar + "</br>" +
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
                    const { data } = await nuevoRegistroPP({
                        variables: {
                            id: id,
                            input: {
                                operario: nombre,
                                lote: registro.lote,
                                producto: registro.producto,
                                productoID: producto.id,
                                lTaponID: registro.lTaponID,
                                lPlacaID: registro.lPlacaID,
                                cantProducida: cantProducida,
                                cantDescarte: cantDescarte,
                                pcmFinalizado: pcmFinalizado,
                                auxiliar: auxiliar,
                                observaciones: observaciones
                            }   
                        }                
                    });
                    Swal.fire(
                        'Se guardo el registro y se actualizo el stock de productos',
                        data.nuevoRegistroPP,
                        'success'
                    )
                    router.push('/registros/produccionplacas');
                } catch (error) {
                    console.log(error)
                }
            }
        })
    }

    return (
        <Layout>
             <div className="flex justify-center mt-5">
                <div className="w-full bg-white shadow-md px-8 pt-6 pb-8 mb-4 max-w-lg">
                    <div className="mb-2 border-b-2 border-gray-600">
                        <div className="flex justify-between pb-2">
                            <div className="flex">
                                <p className="text-gray-700 text-mm font-bold mr-1">Dia: </p>
                                <p className="text-gray-700 font-light">{format(new Date(data.obtenerRegistroPP.creado), 'dd/MM/yy')}</p>
                            </div>
                            <div className="flex">
                                <p className="text-gray-700 text-mm font-bold mr-1">Hora de inicio: </p>
                                <p className="text-gray-700 font-light">{format(new Date(data.obtenerRegistroPP.creado), 'HH:mm')}</p>
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
                            <p className="text-gray-700 text-mm font-bold mr-1">Lote de PCM: </p>
                            <p className="text-gray-700 font-light">{registro.lPcm}</p>
                        </div>
                        <div className="flex justify-between">
                            <div className="flex">
                                <p className="text-gray-700 text-mm font-bold mr-1">Lote de Placa: </p>
                                <p className="text-gray-700 font-light ">{registro.lPlaca}</p>
                            </div>
                            <div className="flex">
                                <p className="text-gray-700 text-mm font-bold mr-1">Disponibles: </p>
                                <p className="text-gray-700 font-light">{registro.placaDisp}</p>
                            </div>
                        </div>
                        <div className="flex justify-between pb-2">
                            <div className="flex">
                                <p className="text-gray-700 text-mm font-bold mr-1">Lote de Tapón: </p>
                                <p className="text-gray-700 font-light ">{registro.lTapon}</p>
                            </div>
                            <div className="flex">
                                <p className="text-gray-700 text-mm font-bold mr-1">Disponibles: </p>
                                <p className="text-gray-700 font-light">{registro.taponDisp}</p>
                            </div>
                        </div>
                    </div>

                    <form
                        className="bg-white shadow-md px-8 pt-2 pb-8 mb-2"
                        onSubmit={formikCierre.handleSubmit}
                    >
                        <div className="mb-4">
                            <label className="block text-gray-700 font-bold mb-2" htmlFor="cantProducida">
                                Cantidad Producida
                            </label>

                            <input
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                id="cantProducida"
                                type="number"
                                placeholder="Ingrese la cantidad de cantProducida..."
                                onChange={formikCierre.handleChange}
                                onBlur={formikCierre.handleBlur}
                                value={formikCierre.values.cantProducida}
                            />
                        </div>

                        { formikCierre.touched.cantProducida && formikCierre.errors.cantProducida ? (
                            <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4" >
                                <p className="font-bold">Error</p>
                                <p>{formikCierre.errors.cantProducida}</p>
                            </div>
                        ) : null  }
                        
                        <div className="mb-4">
                            <label className="block text-gray-700 font-bold mb-2" htmlFor="cantDescarte">
                                Descarte
                            </label>

                            <input
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                id="cantDescarte"
                                type="number"
                                placeholder="Ingrese la cantidad de cantDescarte..."
                                onChange={formikCierre.handleChange}
                                onBlur={formikCierre.handleBlur}
                                value={formikCierre.values.cantDescarte}
                            />
                        </div>

                        { formikCierre.touched.cantDescarte && formikCierre.errors.cantDescarte ? (
                            <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4" >
                                <p className="font-bold">Error</p>
                                <p>{formikCierre.errors.cantDescarte}</p>
                            </div>
                        ) : null  }

                        <div className="flex mb-3">
                            <label className="block text-gray-700 font-bold " htmlFor="pcmFinalizado">
                                Lote de PCM finalizado:
                            </label>

                            <input
                                className="mt-1 ml-2 form-checkbox h-5 w-5 text-gray-600"
                                id="pcmFinalizado"
                                type="checkbox"
                                placeholder="Ingrese la cantidad de pcmFinalizado..."
                                onChange={formikCierre.handleChange}
                                onBlur={formikCierre.handleBlur}
                                value={formikCierre.values.pcmFinalizado}
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block text-gray-700 font-bold mb-2" htmlFor="auxiliar">
                                Auxiliar/es
                            </label>

                            <input
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                id="auxiliar"
                                type="text"
                                placeholder="auxiliar..."
                                onChange={formikCierre.handleChange}
                                onBlur={formikCierre.handleBlur}
                                value={formikCierre.values.auxiliar}
                            />
                        </div>

                        { formikCierre.touched.auxiliar && formikCierre.errors.auxiliar ? (
                            <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4" >
                                <p className="font-bold">Error</p>
                                <p>{formikCierre.errors.auxiliar}</p>
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
                                onChange={formikCierre.handleChange}
                                onBlur={formikCierre.handleBlur}
                                value={formikCierre.values.observaciones}
                            />
                        </div>

                        { formikCierre.touched.observaciones && formikCierre.errors.observaciones ? (
                            <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4" >
                                <p className="font-bold">Error</p>
                                <p>{formikCierre.errors.observaciones}</p>
                            </div>
                        ) : null  }

                        <input
                            type="submit"
                            className="bg-red-800 w-full mt-2 p-2 text-white uppercase font-bold hover:bg-red-900"
                            value="Finalizar Producción"
                        />
                    </form>
                </div>
            </div> 
        </Layout>
    );
}

export default FinalizarRegistro;

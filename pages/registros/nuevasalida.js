import React, {useState} from 'react';
import Layout from '../../components/Layout';
import { gql, useQuery, useMutation } from '@apollo/client';
import Select from 'react-select';
import FinalizarSalida from '../../components/registros/FinalizarSalida';
import { set } from 'date-fns';

const OBTENER_CLIENTES = gql `
  query obtenerClientes {
      obtenerClientes{
          id
          empresa
        }
      }
`;

const OBTENER_STOCK = gql`
    query obtenerProductosTerminados{
        obtenerProductosTerminados{
            loteID
            lote
            producto
            cantidad
        }
    }
`;

const LISTA_REGISTROS = gql `
    query obtenerRegistrosSalidas{
        obtenerRegistrosSalidas{
            id
            fecha
            cliente
            remito
            lotes {
                lote
                cantidad
            }
        }
    }
`;

const NuevaSalida = () => {

    const { data: dataClientes, loading: loadingClientes } = useQuery(OBTENER_CLIENTES);
    const { data: dataStock, loading: loadingStock } = useQuery(OBTENER_STOCK);
    const [ cliente, setCliente ] = useState();
    const [ remito, setRemito ] = useState();
    const [ productos, setProductos ] = useState([]);
    const [ isOpen, setIsOpen ] = useState(false);

    if(loadingClientes || loadingStock)  return (
        <Layout>
          <p className="text-2xl text-gray-800 font-light" >Cargando...</p>
        </Layout>
    );

    let lotes = [];
    const clientes = dataClientes.obtenerClientes;
    dataStock.obtenerProductosTerminados.map(i => {
        lotes.push({
            id: i.loteID,
            lote: i.lote,
            producto: i.producto,
            disponible: i.cantidad
    })});

    const seleccionarCliente = value => {
        setCliente(value)
    }

    const seleccionarLote = value => {
        console.log(value)
        setProductos(value)
    }

    const handleOpenClose = () => {
        setIsOpen(!isOpen)
    }

    return (
        <Layout>
             
            <h1 className="text-2xl text-gray-800 font-light" >Nueva Salida</h1>
            {!isOpen ?
                <div className="flex justify-center mt-5">
                    <div className="w-full max-w-lg">
                        <form>
                            <div className="bg-white shadow-md px-8 pt-6 pb-8 mb-4">
                                <p className="block text-gray-700 text-sm font-bold mb-2">Remito</p>         
                                <input
                                    className="shadow appearance-none border rounded w-full py-2 px-3 mb-2 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    id="cantGuardada"
                                    type="string"
                                    placeholder="Ingrese el remito"
                                    onChange={() => setRemito(event.target.value)}
                                />
                                
                                <p className="block text-gray-700 text-sm font-bold mb-2">Seleccione el Cliente</p>
                                <Select
                                    className="mt-3 mb-2"
                                    options={clientes}
                                    onChange={opcion => seleccionarCliente(opcion)}
                                    getOptionValue={opciones => opciones.id}
                                    getOptionLabel={opciones => opciones.empresa}
                                    noOptionsMessage={() => "No hay resultados"}
                                    placeholder="Cliente..."
                                />

                                <p className="block text-gray-700 text-sm font-bold mb-2">Seleccione el Lote</p>
                                <Select
                                    className="mt-3"
                                    options={lotes}
                                    onChange={opcion => seleccionarLote(opcion)}
                                    getOptionValue={opciones => opciones.id}
                                    getOptionLabel={opciones => `${opciones.lote} Disponibles: ${opciones.disponible}`}
                                    noOptionsMessage={() => "No hay resultados"}
                                    placeholder="Lote..."
                                    isMulti
                                />
                                <button 
                                    onClick={() => handleOpenClose()}
                                    className="bg-gray-800 w-full mt-5 p-2 text-white uppercase font-bold hover:bg-gray-900"
                                >
                                    Seleccionar Cantidades
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            :             
                <div className="flex justify-center mt-5">
                    <div className="w-full max-w-lg">
                        <div className="bg-white shadow-md px-8 pt-6 pb-8 mb-4">
                            <FinalizarSalida productos={productos} cliente={cliente} remito={remito} />
                            <button 
                                onClick={() => handleOpenClose()}
                                className="bg-gray-800 w-full mt-5 p-2 text-white uppercase font-bold hover:bg-gray-900"
                            >
                                Volver
                            </button>
                        </div>
                    </div>
                </div>
            }
        </Layout>
    )
}

export default NuevaSalida;
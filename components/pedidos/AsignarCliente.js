import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import { gql, useQuery } from '@apollo/client';

const OBTENER_CLIENTES = gql `
  query obtenerClientesVendedor {
      obtenerClientesVendedor{
          id
          nombre
          apellido
          empresa
          email
        }
      }
`;

const AsignarCliente = () => {

    const [ cliente , setCliente] = useState([]);

    // Consultar DB
    const { data, loading, error } = useQuery(OBTENER_CLIENTES);

    // Resultados de la consulta
    if (loading) return null;

    const { obtenerClientesVendedor } = data;


    useEffect(() => {
        console.log(cliente)
    }, [cliente])

    const seleccionarCliente = cliente =>{
        setCliente(cliente);
    }
    
    return (
        <>
            <p className="mt-10 my-2 bg-white border-l-4 border-gray-800 text-gray-700 p-2 text-sm font-bold ">1.- Asigne un cliente al pedido</p>
        
            <Select
                    className="mt-3"
                    options={obtenerClientesVendedor}
                    onChange={ opcion => seleccionarCliente(opcion)}
                    getOptionValue={ opciones => opciones.id}
                    getOptionLabel={ opciones => opciones.nombre}
                    placeholder="Selecionar o buscar cliente"
                    noOptionsMessage={() => "No hay resultados"}
                />
        </> 
  
    );
}

export default AsignarCliente;
import React, { useEffect } from 'react';
import { useQuery } from '@apollo/client';
import { LISTA_REGISTROS_POR_FECHA } from '../../../servicios/salidas';

const query = LISTA_REGISTROS_POR_FECHA;

const RegistrosPorFecha = ({start, end, setRegs}) => {
    const { data, loading } = useQuery(query,{
      variables: {
        input: {
          start,
          end,
        }
      }
    });

    useEffect(() => {
      if (data) setRegs([...data.getRegsByDateSalidas]);
    },[data]);

    if (loading) return <p className="text-gray-800 font-light" >Cargando...</p>

    return (
      <>
        {data.getRegsByDateSalidas.length > 0 ? 
          <p className="text-gray-800 font-light ml-2 mr-2 mt-1" >Se obtuvieron {data.getRegsByDateSalidas.length} registros</p>
        :
          <p className="text-red-700 font-bold ml-2 mr-2 mt-1" >No se obtuvieron registros</p>}
      </>              
    );
}

export default RegistrosPorFecha;

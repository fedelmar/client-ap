import React from 'react';
import { gql, useQuery} from '@apollo/client';
import MostrarInsumos from '../../MostrarInsumos';

const OBTENER_INSUMOS = gql`
  query obtenerInsumos {
    obtenerInsumos {
      id
      nombre
      categoria
    }
  }
`;

const Insumos = ({insumos}) => {

    const { data, loading } = useQuery(OBTENER_INSUMOS);

    if(loading) return null;
    const arrInsumos = data.obtenerInsumos;

    return (
        <MostrarInsumos key={insumos.id} arrInsumos={arrInsumos} insumos={insumos} />
    );
}

export default Insumos;

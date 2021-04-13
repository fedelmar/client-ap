import React from 'react';
import Select from 'react-select';
import { gql, useQuery } from '@apollo/client';

const STOCK_SEGUN_PRODUCTO = gql `
    query obtenerStockInsumosPorProducto($id: ID!){
        obtenerStockInsumosPorProducto(id: $id){
            id
            insumo
            cantidad
            lote
            insumoID
            categoria
        }
    }
`;


const SelectInsumo = ({productoID, funcion, categoria}) => {

    const { data, loading } = useQuery(STOCK_SEGUN_PRODUCTO, {
        pollInterval: 500,
        variables: {
            id: productoID
        }
    });

    if(loading) return <p className="text-gray-800 font-light pb-2" >Cargando...</p>;

    const listaInsumo = data.obtenerStockInsumosPorProducto.filter(i => i.categoria === categoria);
    return (
        <>
            <Select
                className="mt-3 mb-4"
                options={listaInsumo}
                onChange={opcion => funcion(opcion) }
                getOptionValue={ opciones => opciones.id }
                getOptionLabel={ opciones => `L: ${opciones.lote} - ${opciones.insumo} - Disp: ${opciones.cantidad}`}
                placeholder="Lote de insumo"
                noOptionsMessage={() => "No hay insumos disponibles para ese producto"}
                isMulti={false}
            />
        </>
    );
};

export default SelectInsumo;
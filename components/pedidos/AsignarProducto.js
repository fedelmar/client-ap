import React, { useEffect, useState, useContext } from 'react';
import Select from 'react-select';
import { gql, useQuery } from '@apollo/client';
import PedidoContext from '../../context/pedidos/PedidoContext';

const OBTENER_PRODUCTOS = gql`
    query obtenerProductos {
        obtenerProductos{
        id
        nombre
        categoria
        cantidad
        }
    }
`;

const AsignarProductos = () => {

    const [ productos, setProductos ] = useState([]);

    const pedidoContext = useContext(PedidoContext);
    const { agregarProducto } = pedidoContext;

    const { data, loading} = useQuery(OBTENER_PRODUCTOS);

    useEffect(() => {
        agregarProducto(productos)
    }, [productos])

    const seleccionarProducto = producto => {
        setProductos(producto)
    }

    if(loading) return null;
    const { obtenerProductos } = data;

    
    
    return( 
        <>
            <p className="mt-10 my-2 bg-white border-l-4 border-gray-800 text-gray-700 p-2 text-sm font-bold">2.- Seleccione o busque los productos</p>
            <Select
                className="mt-3"
                options={ obtenerProductos }
                onChange={ opcion => seleccionarProducto(opcion) }
                getOptionValue={ opciones => opciones.id }
                getOptionLabel={ opciones => `${opciones.nombre} - ${opciones.cantidad} Disponibles` }
                placeholder="Busque o Seleccione el Producto"
                noOptionsMessage={() => "No hay resultados"}
                isMulti={true}
            />
        </>
    );
}

export default AsignarProductos;
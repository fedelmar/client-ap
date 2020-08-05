/* eslint-disable react/prop-types */
import React, { useContext, useState, useEffect } from 'react';
import PedidoContext from '../../context/pedidos/PedidoContext';


const ProductoResumen = ({producto}) => {

    const pedidoContext = useContext(PedidoContext);
    const { cantidadProductos } = pedidoContext;

    const [nuevaCantidad, setCantidad ] = useState(0);

    useEffect(() => {
        actualizarCantidad();
    }, [nuevaCantidad])

    const actualizarCantidad = () => {
        const nuevoProducto = {...producto, nuevaCantidad: Number(nuevaCantidad)} 
        cantidadProductos(nuevoProducto)
    }

    const { nombre } = producto;
    
    return (
            <div className="md:flex md:justify-between md:items-center mt-5">
                <div className="md:w-2/4 mb-2 md:mb-0">
                    <p className="text-sm">{nombre}</p>
                </div>
                
                <input 
                    type="number"
                    placeholder="Cantidad"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shawod-outline"
                    onChange={ e => setCantidad(e.target.value)}
                    value={nuevaCantidad}
                />
            </div>
        );
}


export default ProductoResumen;
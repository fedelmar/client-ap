import React, { useContext } from 'react';
import Layout from '../components/Layout';
import AsignarCliente from '../components/pedidos/AsignarCliente';
import AsignarProductos from '../components/pedidos/AsignarProducto';
import ResumenPedido from '../components/pedidos/ResumenPedido';
import PedidoContext from '../context/pedidos/PedidoContext';

const NuevoPedido = () => {

    const pedidoContext = useContext(PedidoContext);
    const { productos, cliente } = pedidoContext;

    const validarPedido = () => {
        
        return cliente.length === 0 || !productos.every(producto => producto.nuevaCantidad > 0) ? " opacity-50 cursor-not-allowed " : "";
    }
       
               
    return (
        <Layout>

            <h1 className="text-2xl text-gray-800 font-light">Nuevo Pedido</h1>

            <div className="flex justify-center mt-5">
                <div className="w-full max-w-lg">
                    <AsignarCliente />
                    <AsignarProductos /> 
                    <ResumenPedido />     

                    <button
                        type="button"
                        className={`bg-gray-800 w-full mt-5 p-2 text-white uppercase font-bold hover:bg-gray-900 ${ validarPedido() }`}
                    >Registrar Pedido</button>
                </div>
            </div>

        </Layout>
        
    );
}

export default NuevoPedido;
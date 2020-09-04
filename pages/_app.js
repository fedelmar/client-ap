/* eslint-disable react/prop-types */
import React from 'react'
import { ApolloProvider } from '@apollo/client';
import client from '../config/apollo';
import PedidoState from '../context/pedidos/PedidoState';
import UsuarioState from '../context/usuarios/UsuarioState';
import 'react-day-picker/lib/style.css';

const MyApp = ({Component, pageProps}) => {

    return (
        <ApolloProvider client={client}>
            <UsuarioState>
                <PedidoState>
                    <Component {...pageProps} />               
                </PedidoState>
            </UsuarioState>
        </ApolloProvider>
    );
}

export default MyApp;
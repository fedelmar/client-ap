/* eslint-disable react/prop-types */
import React from 'react'
import { ApolloProvider } from '@apollo/client';
import client from '../config/apollo';
import UsuarioState from '../context/usuarios/UsuarioState';
import 'react-day-picker/lib/style.css';
import 'tailwindcss/tailwind.css'

const MyApp = ({Component, pageProps}) => {

    return (
        <ApolloProvider client={client}>
            <UsuarioState>
                <Component {...pageProps} />
            </UsuarioState>
        </ApolloProvider>
    );
}

export default MyApp;
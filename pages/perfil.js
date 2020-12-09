import React, { useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Layout from '../components/Layout';
import { Formik } from 'formik'
import * as Yup from 'yup';
import { useMutation, gql } from '@apollo/client';
import UsuarioContext from '../context/usuarios/UsuarioContext';

const NUEVO_USUARIO = gql`
    mutation nuevoUsuario($input: UsuarioInput) {
        nuevoUsuario(input: $input) {
            id
            nombre
            apellido
            email
            rol
        }
  }
`;

const Perfil = () => {

    // Obtener datos de usuario
    const usuarioContext = useContext(UsuarioContext);
    const { nombre, apellido, email, password, id } = usuarioContext.usuario;

    // State del mensaje
    const[mensaje, guardarMensaje] = useState(null);
    const[usuario, setUsuario] = useState();
    useEffect(() => {
        setUsuario({...usuario, nombre: nombre, 
                apellido: apellido, 
                email: email, 
                password: password, 
                id: id  
        })
    }, [usuarioContext.usuario])

    const schemaValidacion = Yup.object({
        nombre: Yup.string()
                        .required('Campo obligatorio'),
        apellido: Yup.string()
                        .required('Campo obligatorio'),
        email: Yup.string()
                        .email('El email no es válido')
                        .required('Campo obligatorio'),
        password: Yup.string()
                        .required('Campo obligatorio')
                        .min(6,'El password debe ser de al menos 6 caracteres')
    });

    const mostrarMensaje = () => {
        return (
            <div className="bg-white py-2 px-3 w-full my-3 max-w-sm text-center mx-auto text-gray-70">
                <p>{mensaje}</p>
            </div>
        )
    }
    console.log(usuario)
    return (
        <>
            <Layout>
                
                <h1 className="text-center text-2xl text-gray-800 font-ligth">Datos de usuario</h1> 

                {mensaje && mostrarMensaje() }

            </Layout>
        </>
    );
}

export default Perfil;
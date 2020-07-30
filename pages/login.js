import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Layout from '../components/Layout';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useMutation, gql } from '@apollo/client';
import client from '../config/apollo';

const AUTENTICAR = gql`
    mutation autenticarUsuario($input: AutenticarInput){
        autenticarUsuario(input: $input){
            token
        }
    }
`;


const Login = () => {

    const [mensaje, guardarMensaje] = useState(null);

    // Mutation para autentificar usuario
    const [ autenticarUsuario ] = useMutation(AUTENTICAR);

    // Routing
    const router = useRouter();

    // Validacion del formulario
    const formik = useFormik({
        initialValues: {
            email: '',
            password: ''
        },
        validationSchema: Yup.object({
            email: Yup.string()
                            .email('El email no es válido')
                            .required('Campo obligatorio'),
            password: Yup.string()
                            .required('Campo obligatorio')
                            .min(6,'El password debe ser de al menos 6 caracteres')
        }),
        onSubmit: async valores => {

            const { email, password } = valores;

            try {
                const { data } = await autenticarUsuario({
                    variables: {
                        input: {
                            email,
                            password
                        }
                    }
                })

                client.resetStore();

                // Guardar token
                const { token } = data.autenticarUsuario;
                localStorage.setItem('token', token);

                guardarMensaje(null);
                router.push('/')

            } catch (error) {
                guardarMensaje(error.message);
                console.log(error.message)
                setTimeout(() => {
                    guardarMensaje(null);
                }, 3000);

            }
        }
    });

    const mostrarMensaje = () => {
        return (
            <div className="bg-white py-2 px-3 w-full my-3 max-w-sm text-center mx-auto text-gray-70">
                <p>{mensaje}</p>
            </div>
        )
    }

    return (
        <>
            <Layout>
                
                <h1 className="text-center text-2xl text-white font-ligth">Log In</h1> 
                
                {mensaje && mostrarMensaje()}
                
                <div className="flex justify-center mt-5">
                    <div className="w-full max-w-sm">
                        <form
                            className="bg-white rounded shadow-md px-8 pb-8 pt-6 mb-4"
                            onSubmit={formik.handleSubmit}
                        >
                            <div className="mb-4">
                                <label className="block text-gray-70 text-sm font-bold mb-2" htmlFor="email">
                                    Email
                                </label>
                                
                                <input
                                    className="shadow appearence-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    id="email"
                                    type="email"
                                    placeholder="Email Usuario"
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.email}
                                />
                            </div>

                            {formik.touched.email && formik.errors.email ? (
                                <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                                    <p>{formik.errors.email} </p>
                                </div>
                            ): null}

                            <div className="mb-4">
                                <label className="block text-gray-70 text-sm font-bold mb-2" htmlFor="password">
                                    Password
                                </label>
                                
                                <input
                                    className="shadow appearence-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    id="password"
                                    type="password"
                                    placeholder="Password Usuario"
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.password}
                                />
                            </div>

                            {formik.touched.password && formik.errors.password ? (
                                <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                                    <p>{formik.errors.password} </p>
                                </div>
                            ): null}

                            <input
                                type="submit"
                                className="bg-gray-800 w-full mt-5 p-2 text-white uppercase hover:bg-gray-900"
                                value="Iniciar Sesíon"
                            />
                        </form>
                    </div>
                </div>
            </Layout>
        </>
    );
}

export default Login;
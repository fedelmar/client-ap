import React from 'react';
import Layout from '../components/Layout';
import { useFormik } from 'formik';
import * as Yup from 'yup';

const Login = () => {

    // Validacion del formulario
    const formik = useFormik({
        initialValues: {
            email: '',
            password: ''
        },
        onSubmit: valores => {
            console.log('enviando');
            console.log(valores);
        }
    });

    return (
        <>
            <Layout>
                <h1 className="text-center text-2xl text-white font-ligth">Login</h1> 

                <div className="flex justify-center mt-5">
                    <div className="w-full max-w-sm">
                        <form
                            className="bg-white rounded shadow-md px-8 pb-8 pt-6 mb-4"
                            onSubmit={formik.handleSubmit}
                            onChange={formik.handleChange}
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
                                />
                            </div>

                            <div className="mb-4">
                                <label className="block text-gray-70 text-sm font-bold mb-2" htmlFor="password">
                                    Password
                                </label>
                                
                                <input
                                    className="shadow appearence-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    id="password"
                                    type="password"
                                    placeholder="Password Usuario"
                                />
                            </div>

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
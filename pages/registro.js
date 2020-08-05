import React, {useState} from 'react';
import { useRouter } from 'next/router';
import Layout from '../components/Layout';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useMutation, gql } from '@apollo/client';

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

const Registro = () => {

    // State del mensaje
    const[mensaje, guardarMensaje] = useState(null);

    // Mutation de nuevo usuario
    const [ nuevoUsuario ] = useMutation(NUEVO_USUARIO);

    // Routing
    const router = useRouter();

    // Validacion del formulario
    const formik = useFormik({
        initialValues: {
            nombre: '',
            apellido: '',
            email: '',
            rol: '',
            password: ''
        },
        validationSchema: Yup.object({
            nombre: Yup.string()
                            .required('Campo obligatorio'),
            apellido: Yup.string()
                            .required('Campo obligatorio'),
            email: Yup.string()
                            .email('El email no es válido')
                            .required('Campo obligatorio'),
            rol: Yup.string()
                            .required('Campo obligatorio'),
            password: Yup.string()
                            .required('Campo obligatorio')
                            .min(6,'El password debe ser de al menos 6 caracteres')
        }),
        onSubmit: async valores => {

            const {nombre, apellido, email, rol, password} = valores

            try {
                const { data } = await nuevoUsuario({
                    variables: {
                        input: {
                            nombre,
                            apellido,
                            email,
                            rol,
                            password
                        }
                    }
                });

                guardarMensaje(`Se creo correctamente el Usuario ${data.nuevoUsuario.nombre} `);

                setTimeout(() => {
                    guardarMensaje(null);
                    router.push('/login')
                }, 3000);

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
                
                <h1 className="text-center text-2xl text-white font-ligth">Registro</h1> 

                {mensaje && mostrarMensaje() }

                <div className="flex justify-center mt-5">
                    <div className="w-full max-w-sm">
                        <form
                            className="bg-white rounded shadow-md px-8 pb-8 pt-6 mb-4"
                            onSubmit={formik.handleSubmit}
                        >
                            <div className="mb-4">
                                <label className="block text-gray-70 text-sm font-bold mb-2" htmlFor="nombre">
                                    Nombre
                                </label>
                                
                                <input
                                    className="shadow appearence-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    id="nombre"
                                    type="text"
                                    placeholder="Nombre"
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.nombre}
                                />
                            </div>

                            {formik.touched.nombre && formik.errors.nombre ? (
                                <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                                    <p>{formik.errors.nombre} </p>
                                </div>
                            ): null}

                            <div className="mb-4">
                                <label className="block text-gray-70 text-sm font-bold mb-2" htmlFor="apellido">
                                    Apellido
                                </label>
                                
                                <input
                                    className="shadow appearence-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    id="apellido"
                                    type="text"
                                    placeholder="Apellido"
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.apellido}
                                />
                            </div>

                            {formik.touched.apellido && formik.errors.apellido ? (
                                <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                                    <p>{formik.errors.apellido} </p>
                                </div>
                            ): null}

                            <div className="mb-4">
                                <label className="block text-gray-70 text-sm font-bold mb-2" htmlFor="rol">
                                    Rol
                                </label>
                                
                                <select
                                    className="shadow appearence-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    id="rol"
                                    type="text"
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.rol}
                                >
                                    <option value="" label="Seleccione una rol" />
                                    <option value="Admin" label="Admin" />
                                    <option value="Operario" label="Operario" />
                                </select>
                            </div>

                            {formik.touched.rol && formik.errors.rol ? (
                                <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                                    <p>{formik.errors.rol} </p>
                                </div>
                            ): null}    

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
                                value="Crear usuario"
                            />
                        </form>
                    </div>
                </div>
            </Layout>
        </>
    );
}

export default Registro;
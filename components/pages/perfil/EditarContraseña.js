import React, {useState} from 'react';
import Swal from 'sweetalert2';
import { useRouter } from 'next/router';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useMutation, gql } from '@apollo/client';

const EDITAR_CONTRASEÑA = gql`
    mutation modificarPassword($id: ID!, $input: passwordInput){
        modificarPassword(id: $id, input: $input)
    }
`;

const EditarContraseña = ({usuario}) => {

    const router = useRouter();
    const[mensaje, guardarMensaje] = useState(null);
    const [ modificarPassword ] = useMutation(EDITAR_CONTRASEÑA);

    const formik = useFormik({
        initialValues: {
            password: '',
            newPassword: '',
            confirm: ''
        },
        validationSchema: Yup.object({
            password: Yup.string()
                            .required('Campo obligatorio')
                            .min(6,'El password debe ser de al menos 6 caracteres'),
            newPassword: Yup.string()
                            .required('Campo obligatorio')
                            .min(6,'El password debe ser de al menos 6 caracteres'),
            confirm: Yup.string()
                            .required('Campo obligatorio')
                            .min(6,'El password debe ser de al menos 6 caracteres')
                            .oneOf([Yup.ref('newPassword'), null], 'Las nuevas contraseñas deben coincidir')
        }),
        onSubmit: async valores => {
            const { password, newPassword } = valores

            try {
                const { data } = await modificarPassword({
                    variables: {
                        id: usuario.id,
                        input: {
                            password,
                            newPassword
                        }
                    }
                });

                Swal.fire(
                    ':D',
                    data.modificarPassword,
                    'success'
                );
                router.push('/');

            } catch (error) {
                guardarMensaje(error.message.replace('GraphQL error: ', ''));

                setTimeout(() => {
                    guardarMensaje(null);
                }, 2000);
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
            <h1 className="text-center text-2xl text-gray-800 font-ligth mt-4">Actualizar Contraseña</h1> 

            {mensaje && mostrarMensaje() }

            <div className="flex justify-center mt-2">
                <div className="w-full max-w-sm">
                    <form
                        className="bg-white rounded shadow-md px-8 pb-8 pt-6 mb-4"
                        onSubmit={formik.handleSubmit}
                    >
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                                Contraseña
                            </label>
                            
                            <input
                                className="shadow appearence-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                id="password"
                                type="password"
                                placeholder="Contraseña"
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

                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="newPassword">
                                Nueva Contraseña
                            </label>
                            
                            <input
                                className="shadow appearence-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                id="newPassword"
                                type="password"
                                placeholder="Nueva Contraseña"
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.newPassword}
                            />
                        </div>

                        {formik.touched.newPassword && formik.errors.newPassword ? (
                            <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                                <p>{formik.errors.newPassword} </p>
                            </div>
                        ): null}

                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="confirm">
                                Confirmar
                            </label>
                            
                            <input
                                className="shadow appearence-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                id="confirm"
                                type="password"
                                placeholder="Confirmar Nueva contraseña"
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.confirm}
                            />
                        </div>

                        {formik.touched.confirm && formik.errors.confirm ? (
                            <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                                <p>{formik.errors.confirm} </p>
                            </div>
                        ): null}

                        <input
                            type="submit"
                            className="bg-gray-800 w-full mt-5 p-2 text-white uppercase font-bold hover:bg-gray-900"
                            value="Actualizar"
                        />
                    </form>
                </div>
            </div>
        </>
    );
}

export default EditarContraseña;
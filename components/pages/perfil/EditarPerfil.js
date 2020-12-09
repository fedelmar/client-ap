import React, { useState } from 'react';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { gql, useMutation } from '@apollo/client';
import Swal from 'sweetalert2';
import { useRouter } from 'next/router';

const EDITAR_PERFIL = gql`
    mutation actualizarUsuario($id: ID!, $input: ActualizarUsuarioInput){
        actualizarUsuario(id: $id, input: $input){
            id
            nombre
            apellido
            email
            rol
            creado
        }
    }
`;

const EditarPerfil = ({usuario}) => {

    const router = useRouter();
    const [ actualizarUsuario ] = useMutation(EDITAR_PERFIL);
    // State del mensaje
    const[mensaje, guardarMensaje] = useState(null);
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

    const actualizarPerfil = async valores => {
        const {nombre, apellido, email, password, id } = valores

        try {
           
            const { data } = await actualizarUsuario({
                variables: {
                    id: id,
                    input: {
                        nombre, 
                        apellido, 
                        email, 
                        password
                    }
                }
            });
            Swal.fire(
                'Perfil Actualizado',
                ':D',
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

    const mostrarMensaje = () => {
        return (
            <div className="bg-white py-2 px-3 w-full my-3 max-w-sm text-center mx-auto text-gray-70">
                <p>{mensaje}</p>
            </div>
        )
    }

    return (
        <>
            <h1 className="text-center text-2xl text-gray-800 font-ligth mt-2">Editar Perfil</h1> 

            {mensaje && mostrarMensaje() }

            {usuario ?
            <div className="flex justify-center mt-2">
                <div className="w-full max-w-lg">

                    <Formik
                        validationSchema={ schemaValidacion }
                        enableReinitialize
                        initialValues={ usuario }
                        onSubmit={ ( valores ) => { actualizarPerfil(valores) }}
                    >

                    {props => {
                    return (
                            <form
                                className="bg-white shadow-md px-8 pt-6 pb-8"
                                onSubmit={props.handleSubmit}
                            >
                                    <div className="mb-4">
                                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="nombre">
                                            Nombre
                                        </label>

                                        <input
                                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                            id="nombre"
                                            type="text"
                                            placeholder="Nombre de usuario"
                                            onChange={props.handleChange}
                                            onBlur={props.handleBlur}
                                            value={props.values.nombre}
                                        />
                                    </div>

                                    { props.touched.nombre && props.errors.nombre ? (
                                        <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4" >
                                            <p className="font-bold">Error</p>
                                            <p>{props.errors.nombre}</p>
                                        </div>
                                    ) : null  }

                                    <div className="mb-4">
                                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="apellido">
                                            Apellido
                                        </label>

                                        <input
                                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                            id="apellido"
                                            type="text"
                                            placeholder="Apellido"
                                            onChange={props.handleChange}
                                            onBlur={props.handleBlur}
                                            value={props.values.apellido}
                                        />
                                    </div>

                                    { props.touched.apellido && props.errors.apellido ? (
                                        <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4" >
                                            <p className="font-bold">Error</p>
                                            <p>{props.errors.apellido}</p>
                                        </div>
                                    ) : null  }

                                    <div className="mb-4">
                                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                                            Email
                                        </label>

                                        <input
                                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                            id="email"
                                            type="text"
                                            placeholder="Email"
                                            onChange={props.handleChange}
                                            onBlur={props.handleBlur}
                                            value={props.values.email}
                                        />
                                    </div>

                                    { props.touched.email && props.errors.email ? (
                                        <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4" >
                                            <p className="font-bold">Error</p>
                                            <p>{props.errors.email}</p>
                                        </div>
                                    ) : null  }

                                    <div className="mb-4">
                                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                                            Contraseña
                                        </label>
                                        
                                        <input
                                            className="shadow appearence-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                            id="password"
                                            type="password"
                                            placeholder="Contraseña"
                                            onChange={props.handleChange}
                                            onBlur={props.handleBlur}
                                            value={props.values.password}
                                        />
                                    </div>

                                    {props.touched.password && props.errors.password ? (
                                        <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                                            <p>{props.errors.password} </p>
                                        </div>
                                    ): null}

                                
                                    <input
                                        type="submit"
                                        className="bg-gray-800 w-full mt-5 p-2 text-white uppercase font-bold hover:bg-gray-900"
                                        value="Confirmar"
                                    />
                            </form>      
                        )
                    }}
                    </Formik>
                </div>
            </div> : 'Cargando...'}
        </>
    );
}

export default EditarPerfil;
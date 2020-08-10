/* eslint-disable react/prop-types */
import React, {useState, useEffect, useContext} from 'react'
import Head from 'next/head';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import { useRouter } from 'next/router';
import { gql, useQuery } from '@apollo/client';
import UsuarioContext from '../context/usuarios/UsuarioContext';

const OBTENER_USUARIO = gql `
    query obtenerUsuario {
        obtenerUsuario {
            id
            nombre
            apellido
            rol
        }
    }
`;

const OBTENER_INSUMOS = gql`
  query obtenerInsumos {
    obtenerInsumos{
      id
      nombre
      categoria
    }
  }
`;

const Layout = ({children}) => {

    // Routing de next
    const router = useRouter();
    const [usuario, setUsuario] = useState({});
    const {data: dataUsuario, loading: loadingUsuario, error } = useQuery(OBTENER_USUARIO);
    const {data: dataInsumos, loading: loadingInsumos} = useQuery(OBTENER_INSUMOS);

    const usuarioContext = useContext(UsuarioContext);
    const { agregarUsuario, agregarInsumos } = usuarioContext;
    
    useEffect(() => {
        
        const getUser = () => {
        
            if(loadingUsuario) return null;

            if(error) return error;

            if(!dataUsuario || !dataUsuario.obtenerUsuario) {
                return router.push('/login');
            }
            agregarUsuario(dataUsuario.obtenerUsuario)
            setUsuario(dataUsuario.obtenerUsuario)
        }

        const getInsumos = () => {

            if(loadingInsumos) return null;

            const {obtenerInsumos} = dataInsumos;
            agregarInsumos(obtenerInsumos)

        }

        getUser();
        getInsumos();
    }, [dataUsuario, loadingUsuario, loadingInsumos, dataInsumos, error])


  
    return (
      <>  
        <Head>
            <link rel="icon" type="image/ico" href="/favicon.ico" />
            <title>Sistema AP</title>
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/normalize/8.0.1/normalize.min.css" />
            <link href="https://unpkg.com/tailwindcss@^1.0/dist/tailwind.min.css" rel="stylesheet" />
        </Head>

        {router.pathname === "/login" || router.pathname === "/registro" ? (
            <div className="bg-gray-800 min-h-screen flex flex-col justify-center">
                <div>
                    {children}   
                </div>  
            </div>
        ) : (
            <div className="bg-gray-200 min-h-screen" >
                <div className="sm:flex min-h-screen">

                    <Sidebar />
                
                    <main className="xl:w-4/5 sm:w-2/3 sm:min-h-screen p-5">
                        {!usuario ? (null) : (<Header usuario={usuario} />)}
                        {children}   
                    </main>

                </div>
            </div>
        )}
               
      </>
    );
}

export default Layout;
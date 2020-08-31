/* eslint-disable react/prop-types */
import React, {useState, useEffect, useContext} from 'react'
import Head from 'next/head';
import Footer from './Footer';
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

const OBTENER_PRODUCTOS = gql`
  query obtenerProductos {
    obtenerProductos{
      id
      nombre
      categoria
      caja
      cantCaja
      insumos
    }
  }
`;

const Layout = ({children}) => {

    // Routing de next
    const router = useRouter();
    const [usuario, setUsuario] = useState({});
    const {data: dataUsuario, loading: loadingUsuario, error } = useQuery(OBTENER_USUARIO);
    const {data: dataInsumos, loading: loadingInsumos} = useQuery(OBTENER_INSUMOS);
    const {data: dataProductos, loading: loadingProductos} = useQuery(OBTENER_PRODUCTOS);
    

    const usuarioContext = useContext(UsuarioContext);
    const { agregarUsuario, agregarInsumos, agregarProductos } = usuarioContext;
    
    useEffect(() => {
        
        const getUser = () => {
        
            if(loadingUsuario) return 'Cargando...';

            if(error) return error;

            if(!dataUsuario || !dataUsuario.obtenerUsuario) {
                return router.push('/login');
            }
            agregarUsuario(dataUsuario.obtenerUsuario)
            setUsuario(dataUsuario.obtenerUsuario)
        }

        const getInsumos = () => {

            if(loadingInsumos) return 'Cargando...';

            const {obtenerInsumos} = dataInsumos;
            agregarInsumos(obtenerInsumos)

        }

        const getProductos = () => {

            if(loadingProductos) return 'Cargando...';

            const {obtenerProductos} = dataProductos;
            agregarProductos(obtenerProductos)

        }

        getUser();
        getInsumos();
        getProductos();

    }, [dataUsuario, 
        loadingUsuario, 
        loadingInsumos, 
        dataInsumos, 
        error,
        loadingProductos,
        dataProductos])

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
            <div className="flex flex-col justify-between h-auto pb-10">
                {!usuario ? (null) : (<Header usuario={usuario} />)} 
                
             
     
                <div className="bg-gray-200 p-2 mb-auto min-h-screen" > 
                        {children}
                </div>   
                
                <Footer />
               
            </div>
        )}
               
      </>
    );
}

export default Layout;
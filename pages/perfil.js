import React, { useContext, useEffect, useState } from 'react';
import Layout from '../components/Layout';
import UsuarioContext from '../context/usuarios/UsuarioContext';
import EditarPerfil from '../components/pages/perfil/EditarPerfil';

const Perfil = () => {

    // Obtener datos de usuario
    const usuarioContext = useContext(UsuarioContext);
    const { nombre, apellido, email, id } = usuarioContext.usuario;

    const[usuario, setUsuario] = useState();
    useEffect(() => {
        setUsuario({...usuario, 
                nombre: nombre, 
                apellido: apellido, 
                email: email,
                id: id  
        })
    }, [usuarioContext])


    return (
        <Layout>

            <EditarPerfil usuario={usuario} />
        

        </Layout>
    );
}

export default Perfil;
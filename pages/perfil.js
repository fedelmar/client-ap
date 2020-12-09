import React, { useContext, useEffect, useState } from 'react';
import Layout from '../components/Layout';
import UsuarioContext from '../context/usuarios/UsuarioContext';
import EditarPerfil from '../components/pages/perfil/EditarPerfil';
import EditarContraseña from '../components/pages/perfil/EditarContraseña';

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
            {usuario ?
                <>
                    <EditarPerfil usuario={usuario} />

                    <EditarContraseña usuario={usuario} />
                </>
            : 'Cargando...'}
        </Layout>
    );
}

export default Perfil;
import React, {useState, useContext, useEffect} from 'react';
import Layout from '../../components/Layout';
import UsuarioContext from '../../context/usuarios/UsuarioContext';

const IniciarProduccion = () => {

    

    const pedidoContext = useContext(UsuarioContext);
    const { nombre } = pedidoContext.usuario;

    const [registro, setRegistro] = useState({
        fecha: '',
        operario: nombre,
        lote: '',
        horaInicio: '',
        horaCierre: '',
        producto: '',
        lBolsa: '',
        lEsponja: '',
        cantProducida: '',
        cantDescarte: '',
        observaciones: '',
    });
    const [session, setSession] = useState(false);

    console.log(registro)

    const handleInicio = () => {
       setSession(!session);
    }

    console.log('session iniciada: ', session)
    const handleClick = () => {
        setRegistro({...registro, observaciones: 'hacia frio'})
    }

    return (
        <Layout>
            <h1 className=' text-2xl text-gray-800 font-light '>Iniciar Producción</h1>
            <button onClick={() => handleClick()}>Press</button>
            <div>
               <button onClick={() => handleInicio()}>Iniciar Producción</button> 
            </div>            
        </Layout>
    );
}

export default IniciarProduccion

import React, {useContext, useState} from 'react';
import { gql, useQuery } from '@apollo/client';
import Link from 'next/link';
import Layout from '../../../components/Layout';
import UsuarioContext from '../../../context/usuarios/UsuarioContext';

const REGISTROS = gql`
    query obtenerRegistrosCPG{
        obtenerRegistrosCPG{
            id
            creado
            modificado
            operario
            lote
            cliente
            loteBolsa
            loteBolsaID
            loteGel
            dobleBolsa
            manta
            cantDescarte
            cantProducida
            puesto1
            puesto2
            observaciones
            estado
        }
    }
`

const index = () => {

    const usuarioContext = useContext(UsuarioContext);
    const { rol } = usuarioContext.usuario;
    const { data, loading } = useQuery(REGISTROS);
    const [activos, setActivos] = useState(false);

    if(loading) return (
        <Layout>
          <p className="text-2xl text-gray-800 font-light" >Cargando...</p>
        </Layout>
    );

    let registrosCerrados = data.obtenerRegistrosCPG.filter(i => i.estado === false);
    let registrosAbiertos = data.obtenerRegistrosCPG.filter(i => i.estado === true);
    
    const handleOpenCloseActivos = () => {
        setActivos(!activos);
    };

    return (
        <Layout>
            <h1 className="text-2xl text-gray-800 font-light">Produccion de Gel</h1>

            <div className="flex justify-between">
                <div>
                    <Link href="/registros/produccionplacas/nuevoregistroPP">
                    <a className="bg-blue-800 py-2 px-5 mt-1 inline-block text-white rounded text-sm hover:bg-gray-800 mb-3 uppercase font-bold w-full lg:w-auto text-center">Iniciar producción</a>
                    </Link>
                    <button onClick={() => handleOpenCloseActivos()}>
                        <a className="bg-blue-800 py-2 px-5 mt-1 ml-1 inline-block text-white rounded text-sm hover:bg-gray-800 mb-3 uppercase font-bold w-full lg:w-auto text-center">Registros Activos</a>
                    </button>
                </div>
                <div>
                    <button onClick={() => handleOpenCloseFiltros()}>
                        <a className="bg-blue-800 py-2 px-5 mt-1 mr-1 inline-block text-white rounded text-sm hover:bg-gray-800 mb-3 uppercase font-bold w-full lg:w-auto text-center">Buscar</a>
                    </button>
                    {rol === "Admin" ? 
                        <button onClick={() => handleOpenClosePDF()}>
                            <a className="bg-blue-800 py-2 px-5 mt-1 inline-block text-white rounded text-sm hover:bg-gray-800 mb-3 uppercase font-bold w-full lg:w-auto text-center">Exportar en pdf</a>
                        </button>
                    : null}
                </div>
            </div>

            {activos && registrosAbiertos.length > 0 ? 
                <p>hay registros activos</p>
            :   activos ?
                    <div className="bg-white border rounded shadow py-2 px-3 w-full my-3 max-w-sm text-center mx-auto">  
                        <p className="text-xl text-center">No hay registros activos para mostrar</p>
                    </div>
                : null}

            {registrosCerrados.length > 0 ?
                <p>Hay registros cerrados</p>
            :           
                <div className="bg-white border rounded shadow py-2 px-3 w-full my-3 max-w-sm text-center mx-auto">  
                    <p className="text-xl text-center">No hay registros para mostrar</p>
                </div>}

        </Layout>
    );
};

export default index;
import React, { useContext } from 'react'
import UsuarioContext from '../../context/usuarios/UsuarioContext';
import Layout from '../../components/Layout';
import {gql, useQuery} from '@apollo/client';
import RegistroGE from '../../components/RegistroGE'

const LISTA_REGISTROS = gql `
    query obtenerRegistrosGE{
        obtenerRegistrosGE{
                fecha
                operario
                lote
                horaInicio
                horaCierre
                caja
                descCajas
                guardado
                descarte
                observaciones
                producto
            }
        }
`;


const GuardadoEsponjas = () => {

    const usuarioContext = useContext(UsuarioContext);
    const { rol } = usuarioContext.usuario;

    const { data, loading } = useQuery(LISTA_REGISTROS);

    if(loading) return (
        <Layout>
          <p className="text-2xl text-gray-800 font-light" >Cargando...</p>
        </Layout>
    );

    console.log(data.obtenerRegistrosGE)

    return (
        <Layout>
            <h1 className="text-2xl text-gray-800 font-light">Guardado de Esponjas</h1>

            <div className="overflow-x-scroll">
          <table className="table-auto shadow-md mt-10 w-full w-lg">
            <thead className="bg-gray-800">
                <tr className="text-white">
                    <th className="w-1/12 py-2">Fecha</th>
                    <th className="w-2/12 py-2">Horario</th>
                    <th className="w-1/12 py-2">Producto</th>
                    <th className="w-1/12 py-2">Lote</th>
                    <th className="w-1/12 py-2">Tipo de Caja</th>
                    <th className="w-1/12 py-2">Descarte de caja</th>
                    <th className="w-1/12 py-2">Esponjas</th>
                    <th className="w-1/12 py-2">Descarte</th>
                    <th className="w-1/12 py-2">Operario</th>
                    <th className="w-1/12 py-2">Observaciones</th>
                    {rol === "Admin" ? (
                    <>
                        {/* De momento la edicion no va a estar disponible

                        <th className="w-1/12 py-2">Editar</th> */}
                        <th className="w-1/12 py-2">Eliminar</th>
                    </>                  
                    ) : null}   
                </tr>
            </thead>
            <tbody className="bg-white">
              {data.obtenerRegistrosGE.map(registro => (
                  <RegistroGE
                    key={registro.id}
                    registro={registro}
                    rol={rol}
                  />
              ))}  
            </tbody>  
            </table>
        </div>
        </Layout>
    );
}

export default GuardadoEsponjas;
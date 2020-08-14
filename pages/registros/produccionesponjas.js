import React, { useContext } from 'react'
import { gql, useQuery } from '@apollo/client';
import UsuarioContext from '../../context/usuarios/UsuarioContext';
import Layout from '../../components/Layout';
import RegistroCPE from '../../components/RegistroCPE';

const LISTA_REGISTROS = gql `
    query obtenerRegistrosCE {
        obtenerRegistrosCE{
            id
            fecha
            operario
            lote
            horaInicio
            horaCierre
            producto
            lBolsa
            lEsponja
            cantProductida
            cantDescarte
            observaciones
        }
    }
`;

const ProduccionEsponjas = () => {

    const { data, loading } = useQuery(LISTA_REGISTROS);

    const pedidoContext = useContext(UsuarioContext);
    const { rol } = pedidoContext.usuario;


    if(loading) return (
        <Layout>
          <p className="text-2xl text-gray-800 font-light" >Cargando...</p>
        </Layout>
    );

    console.log(data.obtenerRegistrosCE)

    return (
    <Layout>
       <h1 className="text-2xl text-gray-800 font-light" >Registros de produccion de Esponjas</h1> 
       
       <div className="overflow-x-scroll">
          <table className="table-auto shadow-md mt-10 w-full w-lg">
            <thead className="bg-gray-800">
              <tr className="text-white">
                <th className="w-1/12 py-2">Fecha</th>
                <th className="w-1/12 py-2">Operario</th>
                <th className="w-1/12 py-2">Lote</th>
                <th className="w-2/12 py-2">Horario</th>
                <th className="w-1/12 py-2">Producto</th>
                <th className="w-1/12 py-2">Lote Bolsa</th>
                <th className="w-1/12 py-2">Lote Esponja</th>
                <th className="w-1/12 py-2">Produccion</th>
                <th className="w-1/12 py-2">Descarte</th>
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
              {data.obtenerRegistrosCE.map( registro => (
                  <RegistroCPE
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

export default ProduccionEsponjas
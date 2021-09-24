import React, { useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/router';
import { useQuery, useLazyQuery } from '@apollo/client';
import Layout from '../../../../../components/Layout';
import UsuarioContext from '../../../../../context/usuarios/UsuarioContext';
import { OBTENER_REGISTRO } from '../../../../../servicios/produccionDeGel';
import { LOTE_INSUMO } from '../../../../../servicios/stockInsumos';
import FormLlenado from '../FormLlenado';
import FormCristal from '../FormCristal';

const FinalizarRegistro = () => {
    const router = useRouter();
    const { query } = router;
    if (!query) return null;
    const { pid: id } = query;
    const usuarioContext = useContext(UsuarioContext);
    const [getLote, { loading: loadingCristal, data: dataCristal }] = useLazyQuery(LOTE_INSUMO);
    const { data, loading } = useQuery(OBTENER_REGISTRO, {
        variables: {
            id
        }
    });
    const [ registro, setRegistro ] = useState();
    const [ sesionActiva, setSesionActiva ] = useState();

    useEffect(() => {
        if (data) {
            const { obtenerRegistroCPG } = data;
            setRegistro(obtenerRegistroCPG);
            const { loteBolsaCristal } = obtenerRegistroCPG;
            const obtenerLoteBolsa = async (lote) => {
                await getLote({ variables: { input: lote } });
            }
            if (loteBolsaCristal) {
                obtenerLoteBolsa(loteBolsaCristal);
            } 
        }
    }, [data]);
    
    if(loading || loadingCristal) return (
        <Layout>
          <p className="text-2xl text-gray-800 font-light" >Cargando...</p>
        </Layout>
    );
    let bolsaCristal;
    if (dataCristal) {
        bolsaCristal = dataCristal.obtenerInsumoPorLote;
    }

    return(
        <Layout>
            <h1 className='text-2xl text-gray-800 font-light'>Finalizar registro</h1>
            {registro ?
                <div className="flex justify-center mt-5">
                    {!bolsaCristal ?
                        <FormLlenado registro={registro} sesionActiva={registro} volver={() => router.push('/registros/producciongel')}/>
                    :
                        <FormCristal sesionActiva={registro} volver={() => router.push('/registros/producciongel')} bolsaCristal={bolsaCristal} />}
                </div>
            : null}
        </Layout>
    );
}

export default FinalizarRegistro;
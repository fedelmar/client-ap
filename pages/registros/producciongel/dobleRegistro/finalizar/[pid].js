import React, { useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/router';
import { useQuery, useLazyQuery } from '@apollo/client';
import Layout from '../../../../../components/Layout';
import UsuarioContext from '../../../../../context/usuarios/UsuarioContext';
import { OBTENER_REGISTRO } from '../../../../../servicios/produccionDeGel';
import { LOTE_INSUMO } from '../../../../../servicios/stockInsumos';
import { OBTENER_PRODUCTO_POR_NOMBRE } from '../../../../../servicios/productos';
import FormLlenado from '../FormLlenado';
import FormCristal from '../FormCristal';

const FinalizarRegistro = () => {
    const router = useRouter();
    const { query } = router;
    if (!query) return null;
    const { pid: id } = query;
    const { usuario } = useContext(UsuarioContext);
    const [getLote, { loading: loadingCristal, data: dataCristal }] = useLazyQuery(LOTE_INSUMO);
    const [getProducto, { loading: loadingProducto, data: dataProducto}] = useLazyQuery(OBTENER_PRODUCTO_POR_NOMBRE);
    const { data, loading } = useQuery(OBTENER_REGISTRO, {
        variables: {
            id
        }
    });
    const [ registro, setRegistro ] = useState();

    useEffect(() => {
        if (data) {
            const { obtenerRegistroCPG } = data;
            setRegistro({ ...obtenerRegistroCPG, operario: usuario.nombre });
            const { loteBolsaCristal, producto } = obtenerRegistroCPG;
            const obtenerLoteBolsa = async (lote) => {
                await getLote({ variables: { input: lote } });
            }
            const obtenerProducto = async (nombre) => {
                await getProducto({ variables: { nombre }});
                if (dataProducto) {
                    const { obtenerProductoPorNombre } = dataProducto;
                    setRegistro({ ...registro, productoId: obtenerProductoPorNombre.id });  
                }
            }
            if (loteBolsaCristal) {
                obtenerLoteBolsa(loteBolsaCristal);
            }
            if (producto) {
                obtenerProducto(producto);
            }
        }
    }, [data, dataProducto]);
    
    if(loading || loadingCristal || loadingProducto) return (
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
                <>
                    {!bolsaCristal ?
                        <FormLlenado registro={registro} sesionActiva={registro} volver={() => router.push('/registros/producciongel')}/>
                    :
                        <FormCristal sesionActiva={registro} volver={() => router.push('/registros/producciongel')} bolsaCristal={bolsaCristal} />}
                </>
            : null}
        </Layout>
    );
}

export default FinalizarRegistro;
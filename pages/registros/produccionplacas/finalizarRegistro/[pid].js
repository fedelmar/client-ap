import React, { useState, useEffect, useContext } from 'react';
import { format } from 'date-fns';
import { useRouter} from 'next/router';
import { gql, useQuery, useMutation } from '@apollo/client';
import Layout from '../../../../components/Layout';
import ManejoDeStock from '../../../../components/registros/produccionesponjas/ManejoDeStock';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import UsuarioContext from '../../../../context/usuarios/UsuarioContext';
import Swal from 'sweetalert2';

const REGISTRO = gql `
    query obtenerRegistroPP($id: ID!){
        obtenerRegistroPP(id: $id){
            creado
            producto
            operario
            lote
            lTapon
            lPcm
            lPlaca
        }
    }
`;

const LOTE_INSUMO = gql `
    query obtenerInsumoPorLote($input: String!){
        obtenerInsumoPorLote(input: $input){
            id
            cantidad
            insumo
        }
    }
`;

const FinalizarRegistro = () => {

    const router = useRouter();
    const { query: { id } } = router;
    const [registro, setRegistro] = useState({
        placaDisp: 0,
        taponDisp: 0,
        lPlaca: '',
        lTapon: ''
    });
    const { data, loading } = useQuery(REGISTRO, {
        variables: {
            id
        }
    });    
    const { data: dataTapon, loading: loadingTapon } = useQuery(LOTE_INSUMO, {
        variables: {
            input: registro.lTapon
        }
    });
    const { data: dataPlaca, loading: loadingPlaca } = useQuery(LOTE_INSUMO, {
        variables: {
            input: registro.lPlaca
        }
    });
    useEffect(() => {
        if (data) {
            const { obtenerRegistroPP } = data;
            setRegistro({...registro,
                lote: obtenerRegistroPP.lote,
                creado: obtenerRegistroPP.creado,
                producto: obtenerRegistroPP.producto,
                lPcm: obtenerRegistroPP.lPcm,
                lPlaca: obtenerRegistroPP.lPlaca,
                lTapon: obtenerRegistroPP.lTapon
            })
        }
        if ((registro.lPlaca && registro.lTapon) !== '' && (dataPlaca && dataTapon)) {
            setRegistro({...registro,
                lTaponID: dataTapon.obtenerInsumoPorLote.id,
                taponDisp: dataTapon.obtenerInsumoPorLote.cantidad,
                lPlacaID: dataPlaca.obtenerInsumoPorLote.id,
                placaDisp: dataPlaca.obtenerInsumoPorLote.cantidad
            })
        }
    }, [data, dataPlaca])

    if(loading || loadingPlaca || loadingTapon) return (
        <Layout>
          <p className="text-2xl text-gray-800 font-light" >Cargando...</p>
        </Layout>
    );

    console.log(registro);

    return (
        <Layout>
            <h1>{id}</h1>
        </Layout>
    );
}

export default FinalizarRegistro;

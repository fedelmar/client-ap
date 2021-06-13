import React, { useState } from 'react';
import Link from 'next/link';
import { useQuery } from '@apollo/client';

import Layout from '../../../components/Layout';
import Table from '../../../components/registros/ingresos/Table';
import ExportarRegistro from '../../../components/registros/ingresos/ExportarRegistro';
import { LISTA_REGISTROS } from '../../../servicios/ingresos';

const Ingresos = () => {

    const { data, loading } = useQuery(LISTA_REGISTROS);

    const [ pdfOpen, setPdfOpen ] = useState(false);
    const [ filtros, setFiltros ] = useState(false);

    if(loading) return (
        <Layout>
          <p className="text-2xl text-gray-800 font-light">Cargando...</p>
        </Layout>
    );

    const handleOpenClosePDF = () => {
        setPdfOpen(!pdfOpen);
    }

    const handleOpenCloseFiltros = () => {
        setFiltros(!filtros);
    }

    let registros = data.obtenerRegistrosIngresos.map(i => i);

    return (
        <Layout>
            <h1 className="text-2xl text-gray-800 font-light" >Registro de ingreso de Insumos</h1>

            <div className="flex justify-between">
                <Link href="/registros/ingresos/nuevoingreso">
                    <a className="bg-blue-800 py-2 px-5 mt-1 inline-block text-white rounded text-sm hover:bg-gray-800 mb-3 uppercase font-bold w-full lg:w-auto text-center">Ingresar Insumos</a>
                </Link>
                <div>
                    <button onClick={() => handleOpenCloseFiltros()}>
                        <a className="bg-blue-800 py-2 px-5 mt-1 mr-1 inline-block text-white rounded text-sm hover:bg-gray-800 mb-3 uppercase font-bold w-full lg:w-auto text-center">Buscar</a>
                    </button>
                    <button onClick={() => handleOpenClosePDF()}>
                        <a className="bg-blue-800 py-2 px-5 mt-1 inline-block text-white rounded text-sm hover:bg-gray-800 mb-3 uppercase font-bold w-full lg:w-auto text-center">Exportar en pdf</a>
                    </button>
                </div>   
            </div>

            {pdfOpen ? 
                <ExportarRegistro 
                    registros={registros}
                />
            : null}

            {registros.length > 0 ?
                <Table 
                    registros={registros}
                    filtros={filtros}
                />
            :           
                <div className="bg-white border rounded shadow py-2 px-3 w-full my-3 max-w-sm text-center mx-auto">  
                    <p className="text-xl text-center">No hay registros para mostrar</p>
                </div>}
        </Layout>
    );
}

export default Ingresos;
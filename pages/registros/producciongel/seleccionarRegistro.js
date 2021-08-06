import React from 'react';
import { useRouter } from 'next/router';

import Layout from '../../../components/Layout';

const index = () => {
  const router = useRouter();  
  return (
      <Layout>
        <h1 className='text-2xl text-gray-800 font-light'>Nuevo Registro de Producción de Gel</h1>
        <div className="flex justify-center mt-5">
            <div className="w-full max-w-lg bg-white shadow-md px-8 pt-6 pb-8 mb-4">
                <h1 className=" text-gray-700 font-bold">Seleccione el tipo de producto</h1>
                <button
                    type="button"
                    className="bg-gray-800 w-full mt-5 p-2 text-white uppercase font-bold hover:bg-gray-900"
                    onClick={() => router.push('/registros/producciongel/nuevoregistroPG')}
                >Bolsa Simple</button>
                <button
                    type="button"
                    className="bg-gray-800 w-full mt-5 p-2 text-white uppercase font-bold hover:bg-gray-900"
                    onClick={() => router.push('/registros/producciongel/dobleRegistro/nuevoRegistro')}
                >Doble bolsa</button>
                <button
                    type="button"
                    className="bg-green-700 w-full mt-5 p-2 text-white uppercase font-bold hover:bg-green-900"
                    onClick={() => router.push('/registros/producciongel')}
                >Volver</button>
            </div>
        </div>
      </Layout>
  );
};

export default index;
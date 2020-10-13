import React from 'react';
import Layout from '../../../../components/Layout';
import { useRouter} from 'next/router';

const FinalizarRegistro = () => {

    const router = useRouter();
    const { query: { id } } = router;
    console.log(id)
    return (
        <Layout>
            <h1 className="text-2xl text-gray-800 font-light">Finalizar Registro</h1>
        </Layout>
    );
}

export default FinalizarRegistro;
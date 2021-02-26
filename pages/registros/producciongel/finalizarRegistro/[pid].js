import React from 'react';
import { useRouter} from 'next/router';
import Layout from '../../../../components/Layout';

const FinalizarRegistro = () => {

    const router = useRouter();
    const { query: { id } } = router;

    return(
        <Layout>
            <h1>Continuar registro - {id}</h1>
        </Layout>
    );
}

export default FinalizarRegistro;
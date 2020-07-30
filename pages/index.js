import Layout from '../components/Layout';
import { useRouter } from 'next/router';


const Index = () => {

  const router = useRouter();
  
  return (
    <Layout>

      <h1 className="text-2xl text-gray-800 font-light">Inicio</h1>

      <img src='/imagenAP.png' />
      
    </Layout>
  )
  
}

export default Index;
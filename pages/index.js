import Layout from '../components/Layout';
import { useRouter } from 'next/router';



const Index = () => {

  const router = useRouter();
  
  return (
    <div>
      <Layout>
        <h1 className="text-2xl text-gray-800 font-light">Inicio</h1>
        
      </Layout>
      </div>
  )
  
}

export default Index;
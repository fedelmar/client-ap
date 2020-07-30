import Layout from '../components/Layout';
import { useRouter } from 'next/router';


const Index = () => {

  const router = useRouter();
  
  return (
    <Layout>

      <div className="flex justify-center  " >
        <img src='/imagenAP.png' />
      </div>

    </Layout>
  )
  
}

export default Index;
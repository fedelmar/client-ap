/* eslint-disable react/prop-types */
import React from 'react';
import Head from 'next/head';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import { useRouter } from 'next/router';

const Layout = ({children}) => {

    // Routing de next
    const router = useRouter();

    return (
      <>  
        <Head>
            <link rel="icon" type="image/ico" href="/favicon.ico" />
            <title>Sistema AP</title>
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/normalize/8.0.1/normalize.min.css" />
            <link href="https://unpkg.com/tailwindcss@^1.0/dist/tailwind.min.css" rel="stylesheet" />
        </Head>

        {router.pathname === "/login" || router.pathname === "/registro" ? (
            <div className="bg-gray-800 min-h-screen flex flex-col justify-center">
                <div>
                    {children}   
                </div>  
            </div>
        ) : (
            <div className="bg-gray-200 min-h-screen" >
                <div className="sm:flex min-h-screen">

                    <Sidebar />
                
                    <main className="xl:w-4/5 sm:w-2/3 sm:min-h-screen p-5">
                        <Header />
                        {children}   
                    </main>

                </div>
            </div>
        )}
               
      </>
    );
}

export default Layout;
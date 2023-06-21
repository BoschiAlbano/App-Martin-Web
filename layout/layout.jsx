import Image from 'next/image';
import React from 'react';
import styles from 'styles/Layout.module.css'
import Head from 'next/head';

const Layout = ({children, title}) => {
    return (
        <>
            <Head>
                <title>{title}</title>
                <meta name="description" content="Generated by create next app" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <div className='ContenedorLayout flex flex-col justify-center items-center h-screen bg-[#ffffff] p-0 sm:p-3'>
                
                {/* Contenedor */}
                <div className=' neumorphismoLogin rounded-none sm:rounded-md overflow-hidden bg-[#ffffffc0] w-[100%] h-[100%] lg:w-min-[65%] lg:w-[65%] lg:h-[65%] sm:w-min-[100%] sm:w-[100%] sm:h-[80%] shadow-2xl'>
                    
                    {/* Imagen */}
                    <div className="bg-gradient-to-r from-blue-500 to-indigo-500 flex flex-col justify-center items-center w-[auto] relative min-h-[200px]">
                        <Image src={'/assets/layout.png'} layout="fill" objectFit='contain' alt="Distrinova" priority={true} className='p-4'/>
                    </div>

                    {/* Login y Register */}
                    <div className='flex justify-center items-start sm:items-center sm:col-span-1 row-span-2 overflow-y-auto'>
                        <div className='text-center  mt-2 sm:mt-1 '>
                            {children}
                        </div>
                    </div>
                </div>

            </div>
        </>
    );
}

export default Layout;

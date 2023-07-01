import Image from 'next/image';
import React from 'react';
import Head from 'next/head';

const Layout = ({children, title}) => {
    return (
        <>
            <Head>
                <title>{title}</title>
                <meta name="description" content="Aplicacion Creada con nextJS" />
                <link rel="icon" href="/assets/Icono.ico" />
            </Head>

            <div className='sm:grid sm:place-items-center  m-auto h-screen p-0 sm:p-4'>
                
                {/* Contenedor */}
                <div className='GrillaLayou rounded-none sm:rounded-md overflow-hidden bg-[#ffffffc0] min-h-[70%] shadow-2xl  lg:w-min-[65%] lg:w-[65%] sm:w-min-[100%] sm:w-[100%]'>
                    
                    {/* Imagen */}
                    <div className="LayoutImg bg-gradient-to-r from-blue-500 to-indigo-500 w-[auto] items-center  relative min-h-[180px]">
                        <Image src={'/assets/layout.png'} layout="fill" objectFit='contain' alt="Distrinova" priority={true} className='p-4'/>
                    </div>

                    {/* Login y Register */}
                    <div className='LayoutContenido flex justify-center items-start sm:items-center overflow-y-auto'>
                        <div className='text-center  mt-2 sm:mt-0 '>
                            {children}
                        </div>
                    </div>
                </div>

            </div>
        </>
    );
}

export default Layout;

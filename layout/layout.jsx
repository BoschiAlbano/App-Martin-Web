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

            <div className='ContenedorLayout flex flex-col justify-center items-center h-screen bg-[#ffffff] p-0 sm:p-3'>
                
                {/* Contenedor */}
                <div className=' neumorphismoLogin rounded-none sm:rounded-md overflow-hidden bg-[#ffffffc0] w-[100%] h-[100%] lg:w-min-[65%] lg:w-[65%] lg:h-[65%] sm:w-min-[100%] sm:w-[100%] sm:h-[80%] shadow-2xl'>
                    
                    {/* Imagen */}
                    <div className="LayoutImg bg-gradient-to-r from-blue-500 to-indigo-500 flex flex-col justify-center items-center w-[auto] relative min-h-[180px]">
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

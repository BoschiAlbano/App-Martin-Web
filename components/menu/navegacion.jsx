import React from 'react';
import { IoMenuSharp, IoCartSharp, IoCartOutline } from 'react-icons/io5'
import Link from 'next/link';
import Image from 'next/image';
const Navegacion = ({ EsconderMenu, EsconderMenuPatalla }) => {
    return (
        <header className='flex flex-row justify-end h-full'>
                
                <div className="flex items-center absolute py-1 px-1 left-0">

                    {/* Boton Menu  */}
                    <div className="w-[50px] h-[50px] mx-1 text-4xl cursor-pointer transition-all duration-300 rounded-full hover:bg-gray-100 hover:text-gray-700 flex justify-center items-center" onClick={() => EsconderMenu()}><IoMenuSharp /></div>

                    <Link href="/" className="transition hover:rotate-2 hover:scale-110 focus:outline-none focus:ring" onClick={() => EsconderMenuPatalla()}>
                        <Image height={100} width={150} src={'/assets/Logo.png'} alt={"Logo"} className="h-[50px] p-1"/>
                    </Link>

                </div> 
               

                <div className="flex justify-end ">

                    {/* Botones Navegacion */}
                        <div className="items-center divide-x divide-gray-100 border-x border-gray-100 hidden sm:flex">

                            <span className="hidden sm:block">
                                <Link href="/" className="block h-16 font-[Merienda] border-b-4 border-transparent leading-[4rem] hover:border-current hover:text-white px-3" onClick={() => EsconderMenuPatalla()}>
                                    Home
                                </Link>
                            </span>
                            <span className="hidden sm:block">
                                <Link href="/contacto" className="block h-16 font-[Merienda] border-b-4 border-transparent leading-[4rem] hover:border-current hover:text-white px-3" onClick={() => EsconderMenuPatalla()}>
                                    Contacto
                                </Link>
                            </span>
                            <span className="hidden sm:block">
                                <Link href="/articulos" className="block h-16 font-[Merienda] border-b-4 border-transparent leading-[4rem] hover:border-current hover:text-white px-3" onClick={() => EsconderMenuPatalla()}>
                                    Articulos
                                </Link>
                            </span >
                        </div>

                        <Link className="group flex items-center overflow-hidden rounded bg-indigo-600 pl-4 text-white focus:outline-none focus:ring active:bg-indigo-500 " href="/carrito" onClick={() => EsconderMenuPatalla()}>

                            <span className="text-sm font-medium font-[Merienda] transition-all group-hover:mr-1">
                                Carrito
                            </span>

                            <span className=" translate-x-[3rem] transition-transform group-hover:-translate-x-0 group-hover:mr-2 ">

                                <IoCartOutline className="h-5 w-5" />

                            </span>

                        </Link>

                </div>
        </header>
    );
}

export default Navegacion;

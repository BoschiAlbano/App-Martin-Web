import React from 'react';
import { IoMenuSharp, IoCartSharp, IoCartOutline } from 'react-icons/io5'
import Link from 'next/link';
import Image from 'next/image';
import { signOut } from 'next-auth/react';
import { useLocalStorage } from 'components/prueba/localStorage/hook';
import Swal from 'sweetalert2'

const Navegacion = () => {


    const [store, setValue] = useLocalStorage('Carrito', [])

    const [showWelcome, setshowWelcome] = useLocalStorage('showWelcome', false)

    const BtnSalir = () => {

        Swal.fire({
            title: '¿Estas Seguro que quieres cerrar session?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#86F09B',
            cancelButtonColor: '#F14848',
            confirmButtonText: 'Si, Cerrar Sesion',
            focusCancel: true
          }).then((result) => {
            if (result.isConfirmed) {
                setValue([])
                setshowWelcome(true)
                signOut()
            }
          })

    }

    return (
        <header className='flex flex-row items-center justify-end h-full w-full '>
                
                <div className="flex justify-start items-center left-0 w-full">

                    {/* Boton Menu  */}
                    {/* <div className="w-[50px] h-[50px]  mx-1 text-4xl cursor-pointer transition-all duration-300 rounded-full hover:bg-gray-100 hover:text-gray-700 flex justify-center items-center md:hidden" onClick={() => EsconderMenu()}><IoMenuSharp /></div> */}

                    <Link href="/" className="ml-3 transition hover:rotate-2 hover:scale-110 focus:outline-none focus:ring">
                        <Image height={100} width={200} src={'/assets/Logo.png'} alt={"Logo"} className="h-[auto] ml-0 sm:ml-5"/>
                    </Link>

                </div> 
               

                <div className="flex justify-end h-full  md:w-full w-auto">

                    {/* Botones Navegacion */}
                        <div className="items-center divide-x divide-gray-100 border-x border-gray-100 hidden sm:flex">

                            <span className="hidden sm:block">
                                <Link href="/" className="block h-16 font-[Merienda] border-b-4 border-transparent leading-[4rem] hover:border-current hover:text-white px-3">
                                    Home
                                </Link>
                            </span>
                            <span className="hidden sm:block">
                                <Link href="/articulos" className="block h-16 font-[Merienda] border-b-4 border-transparent leading-[4rem] hover:border-current hover:text-white px-3">
                                    Articulos
                                </Link>
                            </span >
                            <span className="hidden sm:block">
                                <button className="block h-16 font-[Merienda] border-b-4 border-transparent leading-[4rem] hover:border-current hover:text-white px-3" onClick={() => BtnSalir()}>
                                    Cerrar Session
                                </button>
                            </span>
                        </div>

                        <Link className="group flex items-center overflow-hidden rounded bg-indigo-600 pl-4 text-white focus:outline-none focus:ring active:bg-indigo-500 " href="/carrito">

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

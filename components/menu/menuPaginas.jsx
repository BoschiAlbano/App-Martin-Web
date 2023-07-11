
import React, { useState, useRef, useEffect } from 'react';
import Navegacion from './navegacion';
import { useLocalStorage } from 'components/prueba/localStorage/hook';
import Head from 'next/head';
import { IoHomeOutline, IoCartOutline, IoFastFoodOutline } from 'react-icons/io5'
import Link from 'next/link';
import { signOut } from 'next-auth/react';
import Swal from 'sweetalert2'
import { MdExitToApp } from 'react-icons/md'
import { FaArrowCircleUp } from 'react-icons/fa';

/*[Items del menu horizontal]*/
const datos = [
    { ruta: "/", nombre: "Home", icono: IoHomeOutline, subMenu: [] },
    { ruta: "/articulos", nombre: "Articulos", icono: IoFastFoodOutline, subMenu: [] },
    { ruta: "/carrito", nombre: "Carrito", icono: IoCartOutline, subMenu: [] },
]

export default function ({ user, children }) {

    const [background, setbackground] = useState('Degradado');
    const MenuRef = useRef()

    const [store, setValue] = useLocalStorage('Carrito', [])
    const [showWelcome, setshowWelcome] = useLocalStorage('showWelcome', false)

    const [ocultar, setOcultar] = useState(false);

    const [prevY, setPrevY] = useState(0);

    let tituto = "Distrinova"

    useEffect(() => {

        window.addEventListener('blur', () => {
          document.title = '¡No te vayas! 😱'
        })
    
        window.addEventListener('focus', () => {
          document.title = tituto
        })
    
    }, []);


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

    /*[Agregar el evento scroll al la referencia del contenedor]*/
    useEffect(() => {

        const EventoMenu = () => {
            const _menu = MenuRef.current;
            const { y } = _menu.getBoundingClientRect();

            const _background = y >= 0 ? 'Degradado' : 'DegradadoTransparente';
            setbackground(_background);
          
            if (y > prevY) {
              setOcultar(false);
            } else {
              setOcultar(true);
            }
            
            setPrevY(y);
        };
          

        window.addEventListener('scroll', EventoMenu)
        return () => {
            window.removeEventListener('scroll', EventoMenu)
        };

    }, [prevY]);


    const scrollToTop = () => {
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
      };


    return (
        <>
            <Head>
            <title>{tituto}</title>
            <meta name="description" content="Distrinova, Tu destino de compras mayoristas en linea." />
            <link rel="icon" href="/assets/Icono.ico" />
            </Head>

            {/* Encabezado */}
            <div className={`fixed w-full h-[60px] z-[99] top-0 ${background} mx-0`}>
                <Navegacion />
            </div>

            <FaArrowCircleUp
                className={`Saltar w-[45px] h-[45px] mx-2 cursor-pointer rounded-full z-[300] text-[rgb(59,130,246)] fixed bottom-0 right-0 flex justify-center items-center ${ocultar ? "my-2 " : "my-12 "} sm:my-2 transition-all duration-500`}
                onClick={scrollToTop}
                />

            {/* Barra de abajo */}
            <nav className={`fixed ${background} z-[100] rounded-t-xl  h-12 w-full transition-all duration-500 ${ocultar ? "bottom-[-100%] oculto" : "bottom-0"} sm:hidden`}>

                <div className="flex flex-row justify-between items-center mx-1">

                    {
                        datos.map((_item, i) => {

                            return (
                                <Link key={i} href={_item.ruta}><_item.icono className=" text-4xl m-2 text-black p-1" /></Link>
                            )
                        })
                    }

                    {/* Cerrar Sesion */}
                    <div className="" onClick={() => BtnSalir()}>
                        <MdExitToApp className=" text-4xl m-2 text-black p-1" />
                    </div>
                        
                </div>
            </nav>
            

            {/* Contenedor */}
            <main ref={MenuRef} className="z-[98] relative">

                {children}

            </main>
        </>
    )
}
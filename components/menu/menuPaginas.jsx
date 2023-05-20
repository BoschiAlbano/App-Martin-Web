
import Link from 'next/link'
import { IoClose, IoHomeOutline, IoNewspaperOutline, IoCartOutline, IoFastFoodOutline } from 'react-icons/io5'
import React, { useState, useRef, useEffect } from 'react';
import { signOut } from 'next-auth/react';
import Image from 'next/image';
import MenuDesplegable from 'components/menu/Submenu'
import Navegacion from './navegacion';
import { useLocalStorage } from 'components/prueba/localStorage/hook';
import Swal from 'sweetalert2'

export default function ({ user, children }) {

    const [open, setopen] = useState(false);
    const [background, setbackground] = useState('Degradado');
    const MenuRef = useRef()

    const [store, setValue] = useLocalStorage('Carrito', [])


    /*[Esconder el menu al presionar el boton menu]*/
    const EsconderMenu = () => {
        setopen(!open);
        
        // Ocultar Scroll
        document.body.style.overflow = !open ? "hidden" : "auto";
    }

    /*[Esconder Menu al Presionar en la pantalla]*/
    const EsconderMenuPantalla = () => {
        // open == true && setopen(false);

        if (open) {
            setopen(false)
            // Ocultar Scroll
            document.body.style.overflow = !open ? "hidden" : "auto";
        }
    }

    /*[Agregar el evento scroll al la referencia del contenedor]*/
    useEffect(() => {

        const EventoMenu = () => {
            const _menu = MenuRef.current
            const { y } = _menu.getBoundingClientRect();
            //console.log(y)
            const _background = y == 0 ? 'Degradado' : 'DegradadoTransparente'
            setbackground(_background)
        }

        window.addEventListener('scroll', EventoMenu)
        return () => {
            window.removeEventListener('scroll', EventoMenu)
        };

    }, []);

    /*[Items del menu horizontal]*/
    const datos = [
        { ruta: "/", nombre: "Home", icono: IoHomeOutline, subMenu: [] },
        { ruta: "/Favoritos", nombre: "Favoritos", icono: IoNewspaperOutline, subMenu: [] },
        { ruta: "/articulos", nombre: "Articulos", icono: IoFastFoodOutline, subMenu: [] },
        { ruta: "/carrito", nombre: "Carrito", icono: IoCartOutline, subMenu: [] },

        // { ruta: "/articulos", nombre: "Articulos", icono: IoCartOutline, subMenu: [] },
        // {
        //     ruta: "/comic", nombre: "Comics", icono: IoBulbOutline, subMenu: [
        //         { ruta: "/#", nombre: "Detalle", icono: IoBulbOutline },
        //         { ruta: "/#", nombre: "Seguridad", icono: IoBulbOutline },
        //     ]
        // },


    ]

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
                signOut()
            }
          })

    }

    return (
        <>
            {/* Encabezado */}
            <div className={`fixed w-full h-[60px] z-[99] top-0 ${background} mx-0`}>
                <Navegacion EsconderMenu={EsconderMenu} EsconderMenuPatalla={EsconderMenuPantalla} />
            </div>

            {/* Menu Horizontal */}
            <nav id='Menu-Horizontal' className={`fixed overflow-y-auto overflow-x-hidden h-full flex flex-col w-[85%] sm:min-w-[250px] sm:w-[20%] DegradadoHorizontal opacity-[0.98] z-[100] rounded-r-xl items-stretch top-0 transition-all duration-500 ${open ? "left-0" : "left-[-100%]"}`}>
                
                <div className="w-full flex flex-row justify-end absolute">
                    <div className="w-[50px] h-[50px] mx-1 text-4xl cursor-pointer transition-all duration-300 rounded-full hover:bg-gray-100 hover:text-gray-700 flex justify-center items-center right-0" onClick={() => EsconderMenu()}><IoClose /></div>
                </div>
                
                <header className="flex items-start justify-center mt-3 mb-2 py-1 px-1 left-0">

                    <Link href="/" className="transition ml-3 hover:rotate-2 hover:scale-110 focus:outline-none focus:ring" onClick={() => EsconderMenuPantalla()}>
                        <Image height={100} width={180} src={'/assets/layout.png'} alt={"Logo"} className="h-[auto] p-1" />
                    </Link>

                </header>


                <div className="flex flex-col justify-between h-full mt-2">

                    <div className='flex flex-col' >
                        <ul id='ScrollMenu' className='overflow-y-auto'>
                            {
                                datos.map((_item, i) => {

                                    return (

                                        _item.subMenu.length == 0
                                            ? <li key={i}>
                                                <Link href={_item.ruta}>
                                                    <div className="flex items-center text-black rounded-lg cursor-pointer hover:bg-gray-100 mx-3 my-1 hover:text-gray-700 transition-all duration-300" onClick={() => EsconderMenu()}>
                                                        <_item.icono className=" text-4xl m-2 text-black p-1" />
                                                        <h1 className="text-xl font-[Merienda] px-1 text-black">{_item.nombre}</h1>
                                                    </div>
                                                </Link>
                                            </li>
                                            : <MenuDesplegable key={i} datos={_item} EsconderMenuPantalla={EsconderMenuPantalla} />
                                    )
                                })
                            }
                        </ul>

                    
                    </div>
                        
                        <div>
                            
                            {/* Datos */}
                            <div className="flex flex-col gap-1 items-center text-center h-auto m-1  rounded-lg p-2">


                                {/* Cerrar Sesion */}
                                <div className="flex bg-gray-300 items-center text-black rounded-lg cursor-pointer hover:bg-transparent mx-1 my-1 hover:text-gray-700 transition-all duration-300 w-full" onClick={() => BtnSalir()}>
                                    <Image className='text-4xl m-2 text-black p-1' src={'/assets/salir.png'} width={40} priority={true} height={40} alt={"Avatar de user"} />
                                    <h1 className="text-xl px-1 font-[Merienda] text-black">Cerrar Sesion</h1>
                                </div>
                                
                        </div>
                    </div>
                </div>
            </nav>

            

            {/* Contenedor */}
            <main ref={MenuRef} className="z-[98] mt-[60px] relative" onClick={() => {EsconderMenuPantalla()}}>
                <div className={`${open ? "w-full h-full bg-[rgba(0,0,0,0.3)] absolute z-[100]" : null}`}></div>

                {children}

            </main>
        </>
    )
}
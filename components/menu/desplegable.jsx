import React, {useEffect,useState} from 'react';
import Image from 'next/image';
import MenuDesplegable from 'components/menu/Submenu'
import { IoClose } from 'react-icons/io5'
import Link from 'next/link';
import { IoHomeOutline, IoCartOutline, IoFastFoodOutline } from 'react-icons/io5'
import { signOut } from 'next-auth/react';
import Swal from 'sweetalert2'


    /*[Items del menu horizontal]*/
    const datos = [
        { ruta: "/", nombre: "Home", icono: IoHomeOutline, subMenu: [] },
        { ruta: "/articulos", nombre: "Articulos", icono: IoFastFoodOutline, subMenu: [] },
        { ruta: "/carrito", nombre: "Carrito", icono: IoCartOutline, subMenu: [] },
    ]

const Desplegable = ({open, EsconderMenu, EsconderMenuPantalla, setValue, setshowWelcome}) => {


    const [background, setbackground] = useState('Degradado');

    const [Ocultar, SetOcultar] = useState(false)

    useEffect(() => {

        const EventoMenu = () => {
            const _menu = MenuRef.current
            const { y } = _menu.getBoundingClientRect();
            console.log(y)
            const _background = y <= 0 ? 'Degradado' : 'DegradadoTransparente'
            setbackground(_background)
            SetOcultar(true)
        }

        window.addEventListener('scroll', EventoMenu)
        return () => {
            window.removeEventListener('scroll', EventoMenu)
        };

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


    return (
        <nav id='Menu-Horizontal' className={`fixed overflow-y-auto overflow-x-hidden h-full flex flex-col w-[85%] sm:min-w-[250px] sm:w-[20%] DegradadoHorizontal opacity-[0.98] z-[100] rounded-r-xl items-stretch top-0 transition-all duration-500 ${open ? "left-0" : "left-[-100%]"}`}>
                
        {/* Boton Cruz Cerrar */}
        <div className="w-full flex flex-row justify-end absolute">
            <div className="w-[50px] h-[50px] mx-1 text-4xl cursor-pointer transition-all duration-300 rounded-full hover:bg-gray-100 hover:text-gray-700 flex justify-center items-center right-0" onClick={() => EsconderMenu()}><IoClose /></div>
        </div>
        
        {/* Logo */}
        <header className="flex items-start justify-center mt-8 mb-2 py-1 px-1 left-0">

            <Link href="/" className="transition ml-3 hover:rotate-2 hover:scale-110 focus:outline-none focus:ring" onClick={() => EsconderMenuPantalla()}>
                <Image height={100} width={180} src={'/assets/layout.png'} alt={"Logo"} className="h-[auto] p-1" />
            </Link>

        </header>


        <div className="flex flex-col justify-between h-full mt-8">

            {/* Items */}
            <div className='flex flex-col' >
                <ul id='ScrollMenu' className='overflow-y-auto'>
                    {
                        datos.map((_item, i) => {

                            return (

                                _item.subMenu.length == 0
                                    ? <li className="my-4" key={i}>
                                        <Link href={_item.ruta}>
                                            <div className=" border-b-2 border-l-2 border-r-2 border-[#ffffff88] flex items-center text-black rounded-lg cursor-pointer hover:bg-gray-100 mx-3 my-1 hover:text-gray-700 transition-all duration-300" onClick={() => EsconderMenu()}>
                                                <_item.icono className=" text-4xl m-2 text-black p-1" />
                                                <h1 className="text-xl font-[Merienda] px-1 text-balck">{_item.nombre}</h1>
                                            </div>
                                        </Link>
                                    </li>
                                    : <MenuDesplegable key={i} datos={_item} EsconderMenuPantalla={EsconderMenuPantalla} />
                            )
                        })
                    }
                </ul>

            
            </div>
                
            {/* Cerrar */}
            <div>
                    
                    {/* Datos */}
                    <div className="flex flex-col gap-1 items-center text-center h-auto m-1  rounded-lg p-2">


                        {/* Cerrar Sesion */}
                        <div className="flex border-b-2 border-l-2 border-r-2 border-[#ffffff88] items-center text-black rounded-lg cursor-pointer hover:bg-transparent mx-1 my-1 hover:text-gray-700 transition-all duration-300 w-full" onClick={() => BtnSalir()}>
                            <Image className='text-4xl m-2 p-1' src={'/assets/salir.png'} width={40} priority={true} height={40} alt={"Avatar de user"} />
                            <h1 className="text-xl px-1 font-[Merienda] text-white">Cerrar Sesion</h1>
                        </div>
                        
                </div>
            </div>
        </div>
        </nav>
    );
}

export default Desplegable;





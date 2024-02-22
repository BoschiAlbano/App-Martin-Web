import React from "react";
import { IoCartOutline } from "react-icons/io5";
import Link from "next/link";
import Image from "next/image";
import { signOut } from "next-auth/react";
import { useLocalStorage } from "components/prueba/localStorage/hook";
import Swal from "sweetalert2";

const Navegacion = () => {
    const [store, setValue] = useLocalStorage("Carrito", []);

    const [showWelcome, setshowWelcome] = useLocalStorage("showWelcome", false);

    const BtnSalir = () => {
        Swal.fire({
            title: "¿Estás Seguro de que quieres cerrar sesión?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#86F09B",
            cancelButtonColor: "#F14848",
            confirmButtonText: "Si, Cerrar Sesion",
            focusCancel: true,
        }).then((result) => {
            if (result.isConfirmed) {
                setValue([]);
                setshowWelcome(true);
                signOut();
            }
        });
    };

    return (
        <header className="flex flex-row items-center justify-end h-full w-full ">
            <div className="flex justify-start items-center left-0 w-full">
                {/* Boton Menu  */}

                <Link
                    href="/"
                    className="ml-3 transition hover:rotate-2 hover:scale-110 focus:outline-none focus:ring"
                >
                    <Image
                        height={100}
                        width={200}
                        src={"/assets/Logo.png"}
                        alt={"Logo"}
                        className="h-[auto] ml-0 sm:ml-5"
                    />
                </Link>
            </div>

            <div className="flex justify-end h-full  md:w-full w-auto">
                {/* Botones Navegacion */}
                <div className="items-center divide-x divide-gray-100 border-x border-gray-100 hidden sm:flex">
                    <span className="hidden md:block">
                        <Link
                            href="/"
                            className="block h-16 font-[Merienda] border-b-4 border-transparent leading-[4rem] hover:border-current hover:text-white px-3 whitespace-nowrap"
                        >
                            Home
                        </Link>
                    </span>
                    <span className="hidden md:block">
                        <Link
                            href="/articulos/0/Todo"
                            className="block h-16 font-[Merienda] border-b-4 border-transparent leading-[4rem] hover:border-current hover:text-white px-3 whitespace-nowrap"
                        >
                            Articulos
                        </Link>
                    </span>

                    <span className="hidden md:block">
                        <button
                            className="block h-16 font-[Merienda] border-b-4 border-transparent leading-[4rem] hover:border-current hover:text-white px-3 whitespace-nowrap"
                            onClick={() => BtnSalir()}
                        >
                            Cerrar Session
                        </button>
                    </span>
                </div>

                <Link
                    className="group flex items-center overflow-hidden rounded bg-indigo-600 pl-4 text-white focus:outline-none focus:ring active:bg-indigo-500 "
                    href="/carrito"
                >
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
};

export default Navegacion;

// Desplegable
// <span className="hidden md:block">
//     {/* <div className="block h-16 font-[Merienda] border-b-4 border-transparent leading-[4rem] hover:border-current hover:text-white px-3 whitespace-nowrap">
//         Preventista
//     </div> */}

//     {/* Preventista Desplegable */}
//     <div className="relative">
//         <div
//             className="block h-16 font-[Merienda] border-b-4 border-transparent leading-[4rem] hover:border-current hover:text-white px-3 whitespace-nowrap"
//             onMouseEnter={() => SetCategoriaOpen(true)}
//             onMouseLeave={() => SetCategoriaOpen(false)}
//             onClick={() =>
//                 SetCategoriaOpen(!categoriaOpen)
//             }
//         >
//             Preventista
//         </div>

//         <div
//             className={`absolute left-[-50%] shadow-xls w-[200%] ${
//                 categoriaOpen
//                     ? "overflow-visible"
//                     : "hidden"
//             }`}
//             onMouseEnter={() => SetCategoriaOpen(true)}
//             onMouseLeave={() => SetCategoriaOpen(false)}
//         >
//             <div
//                 className={`relative EfectoCategoria overflow-hidden`}
//             >
//                 <div
//                     className={`${fondo} mt-2 pt-3 pb-5 shadow-xls w-full  rounded-md text-center overflow-hidden`}
//                 >
//                     <div className="w-full flex flex-col items-center justify-center">
//                         <span className="hidden md:block">
//                             <Link
//                                 href="/preventista/cliente"
//                                 className="block my-2 font-[Merienda] hover:text-white whitespace-nowrap"
//                             >
//                                 Clientes
//                             </Link>
//                         </span>

//                         <span className="hidden md:block">
//                             <Link
//                                 href="/preventista/catalogo"
//                                 className="block my-2 font-[Merienda] hover:text-white whitespace-nowrap"
//                             >
//                                 Catalogo
//                             </Link>
//                         </span>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     </div>
// </span>

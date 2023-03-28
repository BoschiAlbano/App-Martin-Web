import React from 'react';
import Link from 'next/link';

const Menu = ({ datos, EsconderMenuPantalla}) => {

    const { subMenu } = datos

    return (

        <div className=" mx-3 my-1">

            <nav aria-label="Main Nav" className="flex flex-col space-y-1">

                <details className="group [&_summary::-webkit-details-marker]:hidden">
                    <summary
                        className="flex items-center text-black rounded-lg transition-all duration-300 cursor-pointer hover:bg-gray-100 hover:text-gray-700"
                    >
                        <datos.icono className="text-4xl m-2 text-black"></datos.icono>

                        <span className="text-xl px-1 text-black font-[Merienda]"> {datos.nombre} </span>

                        <span
                            className="ml-auto mr-2 transition duration-300 shrink-0 group-open:-rotate-180"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="w-5 h-5"
                                viewBox="0 0 20 20"
                            >
                                <path
                                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                />
                            </svg>
                        </span>
                    </summary>

                    <nav aria-label="Teams Nav" className="mt-1.5 ml-8 flex flex-col">
                        {
                            subMenu.map((item, i) => {
                                return (
                                    <Link
                                        href={item.ruta}
                                        className="flex items-center px-4 py-2 text-black rounded-lg hover:bg-gray-100 hover:text-gray-700"
                                        key={i}
                                        onClick={() => EsconderMenuPantalla()}
                                    >
                                        <item.icono className="w-5 h-5 opacity-75"></item.icono>

                                        <span className="ml-3 text-lg font-[Merienda]"> {item.nombre} </span>
                                    </Link>
                                )
                            })
                        }

                    </nav>
                </details>
            </nav>
        </div>
    )
}

export default Menu;


/*
    return (
        <div>
            <h1>{datos.ruta}</h1>
            <h1>{datos.nombre}</h1>
            <datos.icono></datos.icono>

            {subMenu.length == 0
            ? <h1>No hay submenu</h1>  
            : subMenu.map((item, i) => {
                return <div key={i}>
                    <h1>{item.nombre}</h1>
                </div>
            })
            }
        </div>
    )
*/
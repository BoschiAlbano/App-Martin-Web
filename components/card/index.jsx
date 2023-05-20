import React,{useEffect} from 'react';
import {IoCartOutline} from 'react-icons/io5'

const card = ({ articulo, AgregarCarrito }) => {

    return (
        <div className="CardProductos relative block overflow-hidden">
            <button className="absolute right-4 top-4 z-10 rounded-full bg-white p-1.5 text-gray-900 transition hover:text-rose-900">
                <span className="sr-only">Corazon</span>

                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"  stroke="currentColor" className="w-4 h-4">
                    <path  d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                </svg>
            </button>

            <span className="">
                {/* Imagenes de next, necesito q las images vengan del mismo dominio */}
                <img
                    src={articulo.FotoUrl ?? "./assets/ProductoSinFoto.png"}
                    alt={articulo.Descripcion}
                    className="object-cover w-full h-auto transition duration-500 hover:scale-150"
                />
            </span>

            <div className="relative bg-white border border-gray-100 flex flex-col h-full">

                {/* Descripcion */}
                <p className="m-1 text-center text-xl font-medium text-gray-900">{articulo.Descripcion}</p>

                {/* <div className="px-6"> */}
                    {/* Precio */}
                    <p className="mt-1.5 text-center text-sm text-gray-700">{`Precio: $${articulo.PrecioVenta}`}</p>
                    <p className="mt-1.5 text-center text-sm text-gray-700">{`Stock: ${articulo.Stock}`}</p>

                    {/* Boton */}
                    <div className="mt-4 px-6">

                        <button onClick={() => AgregarCarrito(articulo)} type="button" className="Degradado w-full h-[3rem] p-4 mb-4 group flex items-center overflow-hidden rounded text-white justify-center">

                            <div className="text-sm ml-4 font-medium font-[Merienda] transition-all group-hover:mr-1">
                                Agregar
                            </div>

                            <div className=" translate-x-[8rem] transition-transform duration-300 group-hover:-translate-x-0 group-hover:mr-2 ">

                                <IoCartOutline className="h-5 w-5" />

                            </div>

                        </button>

                    </div>
                {/* </div> */}
            </div>

        </div>
    );
}

export default card;
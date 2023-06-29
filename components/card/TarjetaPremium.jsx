import React from 'react';
import {IoCartOutline} from 'react-icons/io5'

const TarjetaPremium = ({ articulo, AgregarCarrito }) => {
    return (
        <div className="container mt-4">
            <div className="card_box shadow-2xl">
                
                {
                    articulo.Oferta ? <span></span> : null
                }



                <div className='flex flex-col justify-center items-center'>
                {/* className="object-cover w-full h-auto transition duration-500 hover:scale-150" */}
                    <img loading="lazy" className="rounded-[0.5rem] h-[200px] object-cover" src={articulo.FotoUrl ?? "./assets/ProductoSinFoto.png"}alt={articulo.Descripcion}
                    />

                    <p className="m-1 text-center text-xl font-medium text-gray-900">{articulo.Descripcion}</p>

                    <p className="mt-1.5 text-center  font-[Merienda]  text-gray-700">{`Precio: $${articulo.PrecioVenta}`}</p>

                    

                    {
                    articulo.Stock ? <p className="text-black ">{`Stock: ${articulo.Stock}`}</p>
                    :
                        articulo.PermiteStockNegativo 
                        ? <p className="text-[#2fc4ff]">{`Stock: ${articulo.Stock}`}</p>
                        : <p className="text-[#FF512F]">{`Stock: ${articulo.Stock}`}</p>
                    }

                    {/* Boton */}
                    <div className="mt-4">

                        <button onClick={() => AgregarCarrito(articulo)} type="button" className="Degradado w-full h-[3rem] p-4 mb-4 group flex items-center overflow-hidden rounded text-white justify-center">

                            <div className="text-sm ml-4 font-medium font-[Merienda] transition-all group-hover:mr-1">
                                Agregar
                            </div>

                            <div className=" translate-x-[8rem] transition-transform duration-300 group-hover:-translate-x-0 group-hover:mr-2 ">

                                <IoCartOutline className="h-5 w-5" />

                            </div>

                        </button>

                    </div>

                </div>

            </div>


        </div>
    );
}

export default TarjetaPremium;

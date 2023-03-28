import Link from 'next/link';
import React from 'react';

const Banner = () => {
    return (
        <div className="">
            <section
                className="relative bg-[url(/assets/App-Albano.jpg)] bg-cover bg-center bg-no-repeat"
            >
                {/* Efecto Tranparente */}
                <div
                    className="absolute inset-0 bg-white/75 sm:bg-transparent sm:bg-gradient-to-r sm:from-white/95 sm:to-white/25"
                ></div>

                <div
                    className="relative mx-auto px-4 py-32 sm:px-6 lg:flex lg:h-screen lg:items-center lg:px-8 "
                >
                    <div className="w-[100%] h-[40%] text-center sm:text-left sm:w-[40%]">

                        {/* Tarjeta */}
                        <div className="rounded-2xl bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 p-1 shadow-xl transition rotate-2 hover:-rotate-2 scale-110 focus:outline-none focus:ring m-5">

                            <Link className=" flex flex-col justify-center items-center text-center rounded-xl bg-white py-6 sm:py-8 " href="/articulos">

                                <div className=" sm:px-2">
                                    <h3 className="text-2xl font-bold text-gray-900">Ya realizaste tu pedido?</h3>

                                    <p className="mt-2 text-sm text-gray-500">
                                        hacelo ahora, contamos con mas de 100 articulos diferentes
                                    </p>
                                </div>
                            </Link>
                        </div>

                    </div>
                </div>
            </section>

        </div>
    );
}

export default Banner;

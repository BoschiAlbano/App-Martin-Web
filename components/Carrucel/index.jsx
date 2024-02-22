import React, { useState } from "react";
// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "swiper/css/scrollbar";

// import required modules
import {
    Keyboard,
    Pagination,
    Autoplay,
    Navigation,
    Scrollbar,
} from "swiper/modules";

import { IoCartOutline } from "react-icons/io5";
import Publicas from "config";
import Swal from "sweetalert2";
import { useLocalStorage } from "components/prueba/localStorage/hook";

export default function Carrusel({ articulos }) {
    const [value, setValue] = useLocalStorage("Carrito", []);

    const AgregarCarrito = (articulo) => {
        try {
            const { Stock, PermiteStockNegativo } = articulo;
            const indice = value.findIndex((art) => art.Id === articulo.Id);

            if (indice >= 0) {
                return Swal.fire({
                    icon: "success",
                    title: "El Articulo ya esta Agregado al Carrito de compras",
                    timer: 2500,
                });
            }

            if (!PermiteStockNegativo && Stock === 0) {
                return Swal.fire({
                    icon: "error",
                    title: "No hay Stock",
                    timer: 2500,
                });
            }

            if (PermiteStockNegativo || Stock > 0) {
                mostrarAlertaCantidad(articulo); // Llama a la función para ingresar la cantidad
            }
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Se Produjo un error Grave.",
                timer: 2500,
            });
        }
    };

    const mostrarAlertaCantidad = (articulo) => {
        const { Stock, PermiteStockNegativo } = articulo;

        Swal.fire({
            title: "Ingrese la cantidad",
            input: "number",
            showCancelButton: true,
            confirmButtonText: "Agregar",
            cancelButtonText: "Cancelar",
            inputValidator: (value) => {
                if (!value || value < 1) {
                    return "Por favor, ingrese una cantidad válida.";
                }
                if (!PermiteStockNegativo) {
                    if (value > Stock) {
                        return "La cantidad ingresada supera el stock disponible.";
                    }
                }
            },
        }).then((result) => {
            if (result.isConfirmed) {
                Agregar(articulo, parseInt(result.value));
            }
        });
    };

    const Agregar = (articulo, Cantidad) => {
        const {
            Id,
            Descripcion,
            FotoUrl,
            PrecioVenta,
            Stock,
            PermiteStockNegativo,
            Descuento,
        } = articulo;

        let _Descuento = PrecioVenta - PrecioVenta * (Descuento / 100);

        const Add = value.concat({
            Id,
            Descripcion,
            FotoUrl,
            PrecioVenta: _Descuento,
            Cantidad,
            Stock,
            PermiteStockNegativo,
        });
        setValue(Add);

        // pedir Cantidad:

        return Swal.fire({
            icon: "success",
            title: "Agregado al Carrito...",
            timer: 2500,
        });
    };

    return (
        <div className="w-full h-auto">
            <Swiper
                loop={true}
                slidesPerView={1}
                spaceBetween={10}
                // when window width is >= 640px
                breakpoints={{
                    640: {
                        slidesPerView: 1,
                        spaceBetween: 10,
                    },
                    768: {
                        slidesPerView: 3,
                        spaceBetween: 40,
                    },
                    1024: {
                        slidesPerView: 4,
                        spaceBetween: 50,
                    },
                    1200: {
                        slidesPerView: 5,
                        spaceBetween: 50,
                    },
                }}
                autoplay={{
                    delay: 3500,
                    disableOnInteraction: false,
                }}
                keyboard={{
                    enabled: true,
                }}
                navigation={false}
                modules={[
                    Keyboard,
                    Pagination,
                    Autoplay,
                    Navigation,
                    // Scrollbar,
                ]}
                // scrollbar={{ draggable: true }}
                className="mySwiperCarrusel"
            >
                {articulos.map((articulo, index) => {
                    return (
                        <SwiperSlide key={index}>
                            <div className=" w-full " key={articulo.Id}>
                                <div className="card_box_Oferta relative mx-3 my-2 mt-3 shadow-1xl mb-5 Saltar bg-[#FFFFFF] shadow-lg  rounded-lg">
                                    {articulo.Oferta ? (
                                        <span className="span"></span>
                                    ) : null}

                                    <div className="flex flex-col justify-center items-center">
                                        <img
                                            loading="lazy"
                                            className="rounded-[0.5rem] object-contain h-[200px]"
                                            src={
                                                articulo.URL ||
                                                `${Publicas.NEXT_PUBLIC_HOST}/assets/ProductoSinFoto.png`
                                            }
                                            alt={articulo.Descripcion}
                                        />

                                        <p className="m-1 text-center text-xl font-medium text-gray-900 ">
                                            {articulo.Descripcion}
                                        </p>

                                        <p className="mt-1.5 text-center flex gap-2 font-[Merienda]  text-gray-700">
                                            Antes:
                                            <s className="">{` $${articulo.PrecioVenta}`}</s>
                                            <span className="text-rose-500">{` %${
                                                articulo.Descuento ?? 0
                                            }`}</span>
                                        </p>

                                        <p className="mt-1.5 text-xl text-center flex gap-2 font-[Merienda]  text-gray-700">
                                            Ahora:
                                            <span className="text-green-500">{` $${(
                                                articulo.PrecioVenta -
                                                articulo.PrecioVenta *
                                                    (articulo.Descuento / 100)
                                            ).toFixed(2)}`}</span>
                                        </p>

                                        {articulo.Stock ? (
                                            <p className="text-black ">{`Stock: ${articulo.Stock}`}</p>
                                        ) : articulo.PermiteStockNegativo ? (
                                            <p className="text-[#2fc4ff]">{`Stock: ${articulo.Stock}`}</p>
                                        ) : (
                                            <p className="text-[#FF512F]">{`Stock: ${articulo.Stock}`}</p>
                                        )}

                                        {/* Boton */}
                                        <div className="mt-4">
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    AgregarCarrito(articulo)
                                                }
                                                className={`Degradado w-full h-[3rem] p-4 mb-4 group flex items-center overflow-hidden rounded text-white justify-center`}
                                            >
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
                        </SwiperSlide>
                    );
                })}
            </Swiper>
        </div>
    );
}

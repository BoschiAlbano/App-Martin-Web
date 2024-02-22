import React, { useEffect, useState } from "react";
import { useArticulos } from "components/prueba/articulos/hook";
import Spinner from "components/Spinner";
import Masonry from "react-masonry-css";
import Publicas from "config";

import { getSession } from "next-auth/react";
import { BorrarCookies } from "utils/metodos";
import prisma from "pirsma";

import MenuPaginas from "components/menu/menuPaginas";
import { eliminarBigIntYDecimal } from "utils/metodos";
const ArticulosApi = () => {
    // const { loading, error, data } = useArticulos();
    const [getData, { loading, error, data }] = useArticulos();

    const [mostrarDatos, SetmostrarDatos] = useState([]);

    useEffect(() => {
        getData({ variables: { medicamento: true } });
    }, []);

    useEffect(() => {
        if (data?.GET_Rubro) {
            console.log(data?.GET_Rubro);
            SetmostrarDatos(data?.GET_Rubro);
        }
    }, [data]);

    const filtrar = (Id = null) => {
        if (Id === null) {
            SetmostrarDatos(data?.GET_Rubro);
            return;
        }
        SetmostrarDatos(data?.GET_Rubro.filter((rubro) => rubro.Id == Id));
    };

    const handleImprimir = () => {
        // Llama a la función window.print() para activar la impresión
        window.print();
    };

    return (
        <MenuPaginas preventista={true}>
            <div className="w-[90%] ml-[5%] grid grid-cols-1 mt-[80px]">
                {!data ? (
                    <div className="w-full flex flex-col items-center mt-3">
                        <Spinner />
                    </div>
                ) : (
                    <div className="flex flex-col gap-10">
                        {/* Filtro por rubro */}
                        <div className=" print:hidden  w-full flex justify-center items-center sm:gap-10 gap-5 flex-wrap">
                            {data?.GET_Rubro.map((Rubro, index) => {
                                return (
                                    <button
                                        key={index}
                                        className="buttonHover"
                                        onClick={() => filtrar(Rubro.Id)}
                                    >
                                        {Rubro.Descripcion}
                                    </button>
                                );
                            })}
                            <button
                                className="buttonHover"
                                onClick={() => filtrar()}
                            >
                                Todos
                            </button>
                            <button
                                className="buttonHover"
                                onClick={() => handleImprimir()}
                            >
                                Imprimir
                            </button>
                        </div>

                        {/* Catalogo por rubros */}
                        <div className="flex flex-col gap-10">
                            {mostrarDatos.map((Rubro, index) => {
                                // const Tarjetas = Rubro.Articulo.map(
                                //     (art, index) => Tarjeta(art, index)
                                // );
                                return (
                                    <div
                                        key={index}
                                        className=" flex flex-col justify-center items-center"
                                    >
                                        <h1 className=" font-semibold text-2xl">
                                            {Rubro.Descripcion}
                                        </h1>

                                        <div className="flex flex-row justify-center items-center gap-5 flex-wrap w-full">
                                            {Rubro.Articulo.map(
                                                (articulo, indice) => {
                                                    return (
                                                        <Tarjeta
                                                            articulo={articulo}
                                                            index={indice}
                                                        ></Tarjeta>
                                                    );
                                                }
                                            )}
                                        </div>
                                        {/* <Masonry
                                            breakpointCols={{
                                                default: 4, // Número de columnas en el mosaico por defecto
                                                1100: 3, // Número de columnas cuando la ventana tiene un ancho de 1100px o menos
                                                700: 2, // Número de columnas cuando la ventana tiene un ancho de 700px o menos
                                                500: 1, // Número de columnas cuando la ventana tiene un ancho de 500px o menos
                                            }}
                                            className=" flex ml-[-30px] w-full mb-10 mt-5"
                                            columnClassName="my-masonry-grid_column"
                                        >
                                            {Tarjetas}
                                        </Masonry> */}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>
        </MenuPaginas>
    );
};

export default ArticulosApi;

function Tarjeta({ articulo, index }) {
    console.log(articulo);

    return (
        <div key={index} className="w-[250px] mt-4">
            <div className="card_box shadow-2xl Saltar">
                {articulo.Oferta ? <span className="span"></span> : null}

                <div className="flex flex-col justify-center items-center">
                    <img
                        // loading="lazy"
                        className="rounded-[0.5rem] h-[200px] object-cover"
                        src={
                            articulo.URL ||
                            `${Publicas.NEXT_PUBLIC_HOST}/assets/ProductoSinFoto.png`
                        }
                        alt={articulo.Descripcion}
                    />

                    <p className="m-1 text-center text-xl font-medium text-gray-900">
                        {articulo.Descripcion}
                    </p>
                </div>
            </div>
        </div>
    );
}

export async function getServerSideProps(context) {
    const session = await getSession(context);

    if (!session) {
        BorrarCookies(context);
        return {
            redirect: {
                destination: "/login",
                permanent: false,
            },
        };
    }

    if (session?.error) {
        console.log(session.error);
        BorrarCookies(context);
        return {
            redirect: {
                destination: "/login",
                permanent: false,
            },
        };
    }

    //#region Obtener todos los datos de la persona y pasarlos por props
    const Mail = session.user.email;

    const _persona = await prisma.persona.findFirst({
        where: {
            Mail,
        },
    });

    // sin persona
    if (!_persona) {
        BorrarCookies(context);
        return {
            redirect: {
                destination: "/login",
                permanent: false,
            },
        };
    }

    if (_persona.Roll === 2) {
        return {
            redirect: {
                destination: "/",
                permanent: false,
            },
        };
    }
    //#endregion

    return {
        props: { persona: eliminarBigIntYDecimal(_persona) },
    };
}

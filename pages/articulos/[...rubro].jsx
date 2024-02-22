import React, { useState, useEffect } from "react";
import MenuPaginas from "components/menu/menuPaginas";
import { getSession } from "next-auth/react";
import Spinner from "components/Spinner";
import { useRubro, useArticuloFiltro } from "components/prueba/articulos/hook";
import FiltroArt from "components/filtroArt";
import { useLocalStorage } from "components/prueba/localStorage/hook";
import Swal from "sweetalert2";
import TarjetaPremium from "components/card/TarjetaPremium";
import Masonry from "react-masonry-css";
import { BorrarCookies, eliminarBigIntYDecimal } from "utils/metodos";
import prisma from "pirsma";

const Articulos = ({ persona, rubro }) => {
    console.log(rubro);

    const [value, setValue] = useLocalStorage("Carrito", []);

    const [
        getArticulo,
        { loading: ArticuloLoading, error: ArticuloError, data: Articulos },
    ] = useArticuloFiltro();

    const [
        getRubro,
        { loading: RubroLoading, error: RubroError, data: Rubros },
    ] = useRubro();

    // Consultar Articulos y Rubros
    useEffect(() => {
        function Consultar() {
            const Parametrorubro =
                rubro.descripcion === "Todo" ? null : rubro.id;

            if (persona.Roll === 3) {
                // Preventista
                getRubro({
                    variables: {
                        medicamento: true,
                    },
                });
                getArticulo({
                    variables: {
                        keyword: "",
                        rubro: Parametrorubro,
                        medicamento: true,
                    },
                });
            } else {
                // Cleinte
                getRubro({
                    variables: {
                        medicamento: persona.Persona_Cliente.Medicamento,
                    },
                });
                getArticulo({
                    variables: {
                        keyword: "",
                        rubro: Parametrorubro,
                        medicamento: persona.Persona_Cliente.Medicamento,
                    },
                });
            }
        }

        Consultar();
    }, []);

    const filtro = ({ keyword = "", rubro = null }) => {
        console.log(rubro);

        if (persona.Roll === 3) {
            // Preventista
            getArticulo({
                variables: {
                    keyword,
                    rubro: rubro === "Todo" || rubro === "0" ? null : rubro,
                    medicamento: true,
                },
            });
        } else {
            // Cliente
            getArticulo({
                variables: {
                    keyword,
                    rubro: rubro === "Todo" || rubro === "0" ? null : rubro,
                    medicamento: persona.Persona_Cliente.Medicamento,
                },
            });
        }
    };

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
            URL,
            PrecioVenta,
            Stock,
            PermiteStockNegativo,
            Descuento,
        } = articulo;

        let _Descuento = PrecioVenta - PrecioVenta * (Descuento / 100);

        const Add = value.concat({
            Id,
            Descripcion,
            URL,
            PrecioVenta: _Descuento.toFixed(2),
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
        <div>
            <MenuPaginas preventista={persona.Roll === 3 ? true : false}>
                <div className="w-[90%] ml-[5%] grid grid-cols-1 mt-[60px]">
                    {!Rubros?.GET_Rubro ? (
                        <div className="w-full flex flex-col items-center mt-3">
                            <Spinner />
                        </div>
                    ) : (
                        <FiltroArt
                            datos={Rubros?.GET_Rubro}
                            filtro={filtro}
                            rubroSeleccionado={rubro}
                        />
                    )}

                    {!Articulos?.FILTRO_Articulo ? (
                        <div className="w-full flex flex-col items-center">
                            <Spinner />
                        </div>
                    ) : (
                        <Masonry
                            breakpointCols={{
                                default: 5, // Número de columnas en el mosaico por defecto
                                1100: 3, // Número de columnas cuando la ventana tiene un ancho de 1100px o menos
                                700: 2, // Número de columnas cuando la ventana tiene un ancho de 700px o menos
                                500: 1, // Número de columnas cuando la ventana tiene un ancho de 500px o menos
                            }}
                            className="my-masonry-grid"
                            columnClassName="my-masonry-grid_column"
                        >
                            {Articulos?.FILTRO_Articulo.map((item, index) => (
                                <TarjetaPremium
                                    key={index}
                                    articulo={item}
                                    AgregarCarrito={AgregarCarrito}
                                />
                            ))}
                        </Masonry>
                    )}
                </div>
            </MenuPaginas>
        </div>
    );
};

export default Articulos;

export async function getServerSideProps(context) {
    //#region Session
    console.log("Entra cuantas");
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

    console.log(session.user);

    //#endregion

    //#region Obtener todos los datos de la persona y pasarlos por props
    const Mail = session.user.email;

    const _persona = await prisma.persona.findFirst({
        where: {
            Mail,
        },
        include: {
            Persona_Cliente: true,
            Persona_Empleado: {
                select: { Foto: false, Id: true, Legajo: true },
            },
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

    console.log(_persona);

    // Persona sin Cliente / Empleado
    if (!_persona.Persona_Cliente && !_persona.Persona_Empleado) {
        BorrarCookies(context);
        return {
            redirect: {
                destination: "/login",
                permanent: false,
            },
        };
    }

    //#endregion

    //#region Obtener parametros rubro
    const { rubro } = context.query;
    // const [id = null, descripcion = "Todo"] = rubro || [];
    const [id, descripcion] = rubro;

    console.log(rubro);
    console.log(id, descripcion);
    //#endregion

    return {
        props: {
            persona: eliminarBigIntYDecimal(_persona),
            rubro: { id, descripcion },
        },
    };
}

import { getSession } from "next-auth/react";
import MenuPaginas from "components/menu/menuPaginas";
import Banner from "components/banner/banner";
import { useEffect } from "react";
import { useLocalStorage } from "components/prueba/localStorage/hook";
import Swal from "sweetalert2";
import Carousel from "components/Carrucel";
import { useArticuloOferta } from "components/prueba/articulos/hook";

import Spinner from "components/Spinner";
import Link from "next/link";

import prisma from "pirsma";

import { BorrarCookies, eliminarBigIntYDecimal } from "utils/metodos";

export default function Home({ Persona, Rubros }) {
    const { Nombre, Apellido } = Persona;
    const [store, setValue] = useLocalStorage("showWelcome", true);

    const [getOfertas, resultOfertas] = useArticuloOferta();

    useEffect(() => {
        if (Persona.Roll === 3) {
            // preventista
            getOfertas({
                variables: { medicamento: true },
            });
        } else {
            // cliente
            getOfertas({
                variables: { medicamento: Persona.Persona_Cliente.Medicamento },
            });
        }

        if (store) {
            Swal.fire({
                icon: "info",
                title: "Distrinova",
                html: `Hola ${Nombre} ${Apellido} !!! Bienvenido a nuestra pagina web.`,
                allowOutsideClick: false,
                didOpen: () => {
                    Swal.hideLoading();
                },
            });

            setValue(false);
        }
    }, []);

    return (
        <div>
            <MenuPaginas preventista={Persona.Roll === 3 ? true : false}>
                <div className=" min-h-screen h-full Degradado_Banner">
                    <Banner />

                    <div className="flex flex-col mt-5 ">
                        <section>
                            {/* <h1 className="block text-2xl font-[Merienda] border-b-4 border-transparent px-3 my-10">
                                Rubros
                            </h1> */}
                            <div className="flex w-full sm:flex-row flex-col flex-wrap gap-3 sm:gap-5 justify-center items-center mt-3 mb-10">
                                {Rubros.map((item, index) => (
                                    <Link
                                        className="button w-[85%] sm:w-auto p-2 border-black rounded-xl border-[4px]"
                                        href={`articulos/${item.Id}/${item.Descripcion}`}
                                        key={index}
                                    >
                                        {item.Descripcion}
                                    </Link>
                                ))}
                            </div>
                        </section>

                        {resultOfertas.data ? (
                            <Carousel
                                articulos={
                                    resultOfertas.data.GET_Articulos_Oferta
                                }
                            />
                        ) : (
                            <div className="w-full flex flex-col items-center mt-3">
                                {" "}
                                <Spinner />
                            </div>
                        )}
                    </div>
                    {/* 
                    {Persona.Roll !== 3 ? null : (
                        <div className=" w-full flex flex-col justify-center items-center">
                            <h1 className="block text-2xl font-[Merienda] border-b-4 border-transparent px-3 my-10">
                                Preventista
                            </h1>

                            <div className="flex w-full sm:w-auto sm:h-auto flex-row flex-wrap gap-3 sm:gap-5 justify-center items-center mt-3 mb-10">
                                <Link
                                    href={"/preventista/catalogo"}
                                    className="button w-[85%] sm:w-auto p-2 border-black rounded-xl border-[4px]"
                                >
                                    Catalogo
                                </Link>
                                <Link
                                    href={"/preventista/cliente"}
                                    className="button w-[85%] sm:w-auto p-2 border-black rounded-xl border-[4px]"
                                >
                                    Clientes
                                </Link>
                                <Link
                                    href={"/preventista/comprobante"}
                                    className="button w-[85%] sm:w-auto p-2 border-black rounded-xl border-[4px]"
                                >
                                    Comprobantes
                                </Link>
                            </div>
                        </div>
                    )} */}
                </div>
            </MenuPaginas>
        </div>
    );
}

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

    //#region Obtener todos los datos del rubros y pasarlos por props dependiendo el cliente por Medicamentos o Empleado.

    let Rubros = [];
    if (_persona.Roll === 3) {
        // Preventista
        Rubros = await prisma.rubro.findMany({
            where: {
                EstaEliminado: false,
                Descripcion: { notIn: ["Indefinido"] },
            },
        });
        console.log(Rubros);
    } else {
        // cliente
        Rubros = await prisma.rubro.findMany({
            where: {
                EstaEliminado: false,
                Descripcion: _persona.Persona_Cliente.Medicamento
                    ? { notIn: ["Indefinido"] }
                    : { notIn: ["Medicamentos", "Indefinido"] },
            },
        });
        console.log(Rubros);
    }
    //#endregion

    return {
        props: {
            Persona: eliminarBigIntYDecimal(_persona),
            Rubros: eliminarBigIntYDecimal(Rubros),
        },
    };
}

import React, { useEffect, useState } from "react";
import { getSession } from "next-auth/react";
import MenuPaginas from "components/menu/menuPaginas";
import { useLocalStorage } from "components/prueba/localStorage/hook";
import ArticuloCarrito from "components/articuloCarrito";
import Spinner from "components/Spinner";
import { IoSend } from "react-icons/io5";
import Swal from "sweetalert2";
import {
    useAddPedidos,
    useAddPedidosPreventista,
} from "components/prueba/pedidos/hook";
import { BorrarCookies } from "utils/metodos";
import prisma from "pirsma";
import { IoPersonAdd } from "react-icons/io5";
import { FaSearch } from "react-icons/fa";
import { useCliente } from "components/prueba/clientes/hook";
import { eliminarBigIntYDecimal } from "utils/metodos";
import { IoCloseSharp } from "react-icons/io5";

import Formulario from "components/formulario";

const Carrito = ({ session, persona }) => {
    const [store, setValue] = useLocalStorage("Carrito", []);

    const [loading, setLoading] = useState(true);
    const [total, setTotal] = useState(0);

    const [getData, { loading: cargando, error, data }] = useCliente();

    const [clienteId, setclienteId] = useState(null);

    const [modal, setModal] = useState(null);

    const showError = (error, titulo = "Pedido enviado con éxito..") => {
        if (error) {
            if (error === "Error, En el Servidor") {
                Swal.fire({
                    icon: "error",
                    title: error,
                    text: "Lo sentimos, Intente nuevamente más tarde. ⏱⏱",
                });

                setValue([]);
                setTotal(0);
                return;
            }

            Swal.fire({
                icon: "error",
                title: error,
                text: "¿ Desea modificar el stock ? o Borrar el carrito",
                showCancelButton: true,
                confirmButtonText: "Modificar Stock",
                cancelButtonText: "Borrar el Carrito",
            }).then((result) => {
                if (!result.isConfirmed) {
                    setValue([]);
                    setTotal(0);
                }
            });
        } else {
            Swal.fire({
                icon: "success",
                title: titulo,
                timer: 2500,
            });
        }
    };

    const [crear] = useAddPedidos(showError);

    const [CrearPredidoPreventista] = useAddPedidosPreventista(showError);

    // UseEffect
    useEffect(() => {
        console.log(persona.Roll);
        if (persona.Roll === 3) {
            getData({ variables: { cadena: "", personaId: persona.Id } });
        }
    }, []);

    useEffect(() => {
        if (persona.Roll !== 3) {
            return;
        }
        console.log("Cambiaron los clientes...");
        console.log(data?.GET_Clientes);
        if (data?.GET_Clientes) {
            data.GET_Clientes.length > 0
                ? setclienteId(`${data?.GET_Clientes[0].Id}`)
                : null;
        }
    }, [data]);

    useEffect(() => {
        setLoading(true);

        if (store.length !== 0) {
            const tot = store.reduce(
                (acumulador, item) =>
                    acumulador + item.PrecioVenta * item.Cantidad,
                0
            );
            setTotal(tot);
        } else {
            setTotal(0);
        }

        // Obtener Clientes.

        setLoading(false);
    }, [store]);

    // // bloquear el body para que el menu no se mueva
    useEffect(() => {
        // suba la pantalla
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
        // Cuando el componente se monta
        const bloquearScroll = () => {
            document.body.classList.add("menu-open");
        };

        // Cuando el componente se desmonta
        const habilitarScroll = () => {
            document.body.classList.remove("menu-open");
        };

        if (modal) {
            bloquearScroll();
        } else {
            habilitarScroll();
        }

        // Asegurarse de eliminar la clase cuando el componente se desmonta
        return () => {
            habilitarScroll();
        };
    }, [modal]); // Ejecuta este efecto cuando openMenu cambie

    // Funciones
    const buscarClientes = (e) => {
        e.preventDefault();
        const buscar = e.target.cadena.value;
        console.log(buscar);
        getData({ variables: { cadena: buscar, personaId: persona.Id } });
    };

    const GuardarYenviarPedido = async () => {
        await Swal.fire({
            title: "¿Estás Seguro de que quieres enviar tu pedido?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#86F09B",
            cancelButtonColor: "#F14848",
            confirmButtonText: "Si, Enviar pedido",
            focusCancel: true,
        }).then((result) => {
            if (result.isConfirmed) {
                enviar();
                return;
            }
        });

        async function enviar() {
            try {
                //#region Validar Datos
                // verificar q no sea 0 el carrito
                if (total == 0) {
                    Swal.fire({
                        icon: "error",
                        title: "No hay Productos en el carrito de compras",
                        timer: 2500,
                    });
                    return;
                }
                // Guardar en base de datos
                const Arts = store.map((valor, index, arr) => {
                    return {
                        Id: valor.Id,
                        Cantidad: +valor.Cantidad,
                        Descripcion: valor.Descripcion,
                    };
                });
                //#endregion

                Swal.fire({
                    title: "Enviando pedido...",
                    allowOutsideClick: false,
                    didOpen: () => {
                        Swal.showLoading(); // Mostrar el spinner de carga
                    },
                });

                if (persona.Roll === 3) {
                    if (clienteId === null) {
                        Swal.fire({
                            icon: "error",
                            title: "Primero seleccione un cliente...",
                            timer: 2500,
                        });
                        return;
                    }
                    const datos = {
                        personaId: Number(persona.Id),
                        articulos: Arts,
                        clienteId: Number(clienteId),
                    };
                    console.log(datos);
                    await CrearPredidoPreventista({ variables: datos });
                } else {
                    const datos = {
                        articulos: Arts,
                        usuario: session.user.email,
                    };
                    console.log(datos);
                    await crear({ variables: datos });
                }
            } catch (error) {
                Swal.fire({
                    icon: "error",
                    title: "Se Produjo un error Grave.",
                    timer: 2500,
                });
            }

            // Borrar Carrito
            setValue([]);
            setTotal(0);
        }
    };

    const modificarCantidad = ({ id, cantidad }) => {
        const indice = store.findIndex((art) => art.Id === id);
        const actualizar = [...store];

        if (!actualizar[indice].PermiteStockNegativo) {
            if (actualizar[indice].Stock < cantidad) {
                Swal.fire({
                    icon: "error",
                    title: "Stock Insuficiente.",
                    timer: 2500,
                });
                return;
            }
        }

        actualizar[indice].Cantidad = cantidad;
        setValue(actualizar);
    };

    const eliminarArticulo = (id) => {
        const eliminar = store.filter((art) => art.Id !== id);
        setValue(eliminar);
    };

    return (
        <MenuPaginas preventista={persona.Roll === 3 ? true : false}>
            <div className="mt-[80px] relative ContenedorCarrito bg-[#ffffffb0] h-screen">
                <div className=" bg-white grid grid-cols-1 shadow-xl py-6 px-3 place-items-center gap-2">
                    <h1 className="text-2xl font-[Merienda] hover:text-[#5E69F1] hover:border-b-[#5E69F1] border-b border-b-black w-full text-center">
                        {loading
                            ? "Tu Carrito"
                            : `Tu Carrito (${store.length})`}
                    </h1>

                    {/* Clientes Preventista */}
                    <div className="w-full flex flex-col justify-center items-center gap-5">
                        {/* Obtener Clientes */}
                        {persona.Roll !== 3 && !data ? null : (
                            <div className=" w-full flex flex-col justify-center items-start gap-5 ">
                                <div className=" flex flex-col justify-center items-center gap-2 w-full sm:w-auto sm:p-5 p-0 ">
                                    <h1 className="text-xl font-[Merienda] pt-6 pb-3">
                                        Seleccione un Cliente
                                    </h1>
                                    {/* Buscar */}
                                    <form
                                        onSubmit={(e) => buscarClientes(e)}
                                        className=" w-full flex flex-row border-black border-[2px] rounded-lg p-1"
                                    >
                                        <input
                                            className="w-full bg-transparent outline-none"
                                            type="text"
                                            placeholder="Nombre o Apellido"
                                            name="cadena"
                                        />
                                        <button type="submit">
                                            <FaSearch className=" text-2xl hover:text-[#5F69F2]" />
                                        </button>
                                    </form>
                                    {/* Select */}
                                    <div className=" flex flex-row w-full gap-5 justify-center items-center border-[2px] border-black  rounded-lg p-1">
                                        <select
                                            name="cliente"
                                            className="sm:w-[250px] w-full  outline-none"
                                            onChange={(e) => {
                                                setclienteId(e.target.value);
                                            }}
                                        >
                                            {data?.GET_Clientes.map(
                                                (item, index) => {
                                                    return (
                                                        <option
                                                            key={index}
                                                            value={item.Id}
                                                        >
                                                            {item.Apellido}{" "}
                                                            {item.Nombre}
                                                        </option>
                                                    );
                                                }
                                            )}
                                        </select>

                                        {/* CRUD */}
                                        <button
                                            onClick={() => setModal(!modal)}
                                        >
                                            <IoPersonAdd className=" text-2xl hover:text-[#5F69F2]" />
                                        </button>
                                        {/* <Link
                                            href={"/cliente"}
                                            onClick={() => {}}
                                        >
                                            <FaArrowRight className=" text-2xl hover:text-[#5F69F2]" />
                                        </Link> */}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                    {/* Carrito items */}
                    {loading ? (
                        <div className="w-full flex flex-col items-center">
                            <Spinner />
                        </div>
                    ) : (
                        store.map((item, index) => {
                            return (
                                <ArticuloCarrito
                                    key={index}
                                    item={item}
                                    modificar={modificarCantidad}
                                    eliminar={eliminarArticulo}
                                />
                            );
                        })
                    )}
                    {/* Boton enviar y total */}
                    <div className="w-full flex flex-col justify-end items-end">
                        <div
                            className={`filtro3 border-[2px] overflow-hidden flex justify-between  my-1 border-[#EBEBEB] w-[200px] `}
                        >
                            <h1 className="Degradado py-2 px-4 text-xl">
                                Total
                            </h1>

                            <input
                                className={`bg-[#ffffff] w-full focus:outline-none border-none px-3  text-2xl`}
                                type={"text"}
                                name={"keyword"}
                                value={`$${total}`}
                                onChange={() => {}}
                            />
                        </div>

                        <button
                            onClick={() => GuardarYenviarPedido()}
                            type="submit"
                            className="Degradado w-[200px] h-[3rem] p-4 mb-4 group flex items-center overflow-hidden rounded text-white justify-center"
                        >
                            <div className="text-sm ml-4 font-medium font-[Merienda] transition-all group-hover:mr-1">
                                Enviar Pedido
                            </div>

                            <div className=" translate-x-[8rem] transition-transform duration-300 group-hover:-translate-x-0 group-hover:mr-2 ">
                                <IoSend className="h-5 w-5" />
                            </div>
                        </button>
                    </div>
                </div>

                {/* Texto */}
                <div className="mt-[10px] bg-white grid grid-cols-1 shadow-xl py-6 px-3 place-items-center gap-2">
                    <h1>
                        Una vez enviado el pedido, Estaremos en contacto para
                        coordinar la entrega en un plazo de 24 hs.
                    </h1>
                </div>

                {/* ADD Cliente */}
                <section
                    className={`absolute bg-white w-full top-0 h-[100%] ${
                        modal ? " openmodal " : "   closedmodal"
                    } ${modal === null ? "hidden" : null}`}
                >
                    <div className="relative flex flex-col justify-center items-center">
                        <button
                            className=" top-0 right-0 absolute"
                            onClick={() => setModal(!modal)}
                        >
                            <IoCloseSharp className=" text-red-400 text-2xl my-2 mx-2" />
                        </button>

                        <h1 className=" my-5 text-2xl font-[Merienda] hover:text-[#5E69F1] hover:border-b-[#5E69F1] border-b border-b-black w-[90%] text-center">
                            Nuevo Cliente
                        </h1>

                        {/* Formulario */}
                        <Formulario persona={persona} />
                    </div>
                </section>
            </div>
        </MenuPaginas>
    );
};

export default Carrito;

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
    //#endregion

    return {
        props: { session, persona: eliminarBigIntYDecimal(_persona) },
    };
}

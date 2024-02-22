import React, { useState } from "react";
import { HiUser } from "react-icons/hi";
import styles from "styles/Login.module.css";
import { useAddCliente } from "components/prueba/clientes/hook";
import Swal from "sweetalert2";

const CarritoFormularioCliente = ({ persona }) => {
    const [cliente, setCliente] = useState({
        nombre: "",
        apellido: "",
        dni: "",
        telefono: "",
        direccion: "",
    });

    const showError = (error, titulo = "Clientes Agregado...") => {
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

    const [CrearCliente] = useAddCliente(showError, persona.Id);

    const onChange = (e) => {
        setCliente({ ...cliente, [e.target.name]: e.target.value });
    };

    const onSubmit = async (e) => {
        e.preventDefault();

        // Mutacion addClientePreventista
        await CrearCliente({
            variables: { ...cliente, empleadoId: persona.Id },
        });

        // Limpiar Campos
        setCliente({
            nombre: "",
            apellido: "",
            dni: "",
            telefono: "",
            direccion: "",
        });
    };

    return (
        <form className="" onSubmit={(e) => onSubmit(e)}>
            <div className="flex flex-col items-center w-full">
                <div className={styles.input_group}>
                    <input
                        className={`${styles.input_text} bg-slate-50`}
                        placeholder="Nombre"
                        type={"text"}
                        name="nombre"
                        onChange={(e) => onChange(e)}
                        value={cliente.nombre}
                    />
                    <span className="flex items-center px-4">
                        <HiUser size={25} />
                    </span>
                </div>

                <div className={styles.input_group}>
                    <input
                        className={`${styles.input_text} bg-slate-50`}
                        placeholder="Apellido"
                        type={"text"}
                        name="apellido"
                        onChange={(e) => onChange(e)}
                        value={cliente.apellido}
                    />
                    <span className="flex items-center px-4">
                        <HiUser size={25} />
                    </span>
                </div>

                <div className={styles.input_group}>
                    <input
                        className={`${styles.input_text} bg-slate-50`}
                        placeholder="DNI"
                        type={"text"}
                        name="dni"
                        onChange={(e) => onChange(e)}
                        value={cliente.dni}
                    />
                    <span className="flex items-center px-4">
                        <HiUser size={25} />
                    </span>
                </div>

                <div className={styles.input_group}>
                    <input
                        className={`${styles.input_text} bg-slate-50`}
                        placeholder="Telefono"
                        type={"text"}
                        name="telefono"
                        onChange={(e) => onChange(e)}
                        value={cliente.telefono}
                    />
                    <span className="flex items-center px-4">
                        <HiUser size={25} />
                    </span>
                </div>

                <div className={styles.input_group}>
                    <input
                        className={`${styles.input_text} bg-slate-50`}
                        placeholder="Direccion"
                        type={"text"}
                        name="direccion"
                        onChange={(e) => onChange(e)}
                        value={cliente.direccion}
                    />
                    <span className="flex items-center px-4">
                        <HiUser size={25} />
                    </span>
                </div>

                <input
                    id={styles.btnLogin}
                    className="Saltar cursor-pointer p-1 m-2 w-80 border-2 border-b-slate-300 rounded-[5px] text-[20px]"
                    type={"submit"}
                    value="Enviar"
                />
            </div>
        </form>
    );
};

export default CarritoFormularioCliente;

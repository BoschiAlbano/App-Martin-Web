import Link from "next/link";
import React from "react";

import { MdDeleteOutline } from "react-icons/md";
import { MdModeEdit } from "react-icons/md";

const Tabla = ({ clientes }) => {
    console.log(clientes);

    const EliminarCliente = (Id) => {
        alert(`Eliminar Cliente id: ${Id}`);
    };

    return (
        <section className="flex justify-center items-center">
            <div className="overflow-x-auto  w-[98%] sm:w-[90%]">
                <table className=" divide-y-2 divide-[#000] bg-[#ffffffc7] text-sm rounded-xl shadow-2xl">
                    <thead className="ltr:text-left rtl:text-right">
                        <tr>
                            <th className="whitespace-nowrap px-4 py-2  font-extrabold text-gray-900">
                                Nombre
                            </th>
                            <th className="whitespace-nowrap px-4 py-2  font-extrabold text-gray-900">
                                Apellido
                            </th>
                            <th className="whitespace-nowrap px-4 py-2  font-extrabold text-gray-900">
                                DNI
                            </th>
                            <th className="whitespace-nowrap px-4 py-2  font-extrabold text-gray-900">
                                Direccion
                            </th>
                            <th className="whitespace-nowrap px-4 py-2  font-extrabold text-gray-900">
                                Modificar
                            </th>
                            <th className="whitespace-nowrap px-4 py-2  font-extrabold text-gray-900">
                                Eliminar
                            </th>
                            {/* <th className="px-4 py-2"></th> */}
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-gray-200">
                        {clientes.map((item, index) => {
                            return (
                                <tr key={index}>
                                    <td className="whitespace-nowrap px-4 py-2 font-medium text-gray-700 text-center">
                                        {item.Nombre || "Sin datos"}
                                    </td>
                                    <td className="whitespace-nowrap px-4 py-2 text-gray-700 text-center">
                                        {item.Apellido || "Sin datos"}
                                    </td>
                                    <td className="whitespace-nowrap px-4 py-2 text-gray-700 text-center ">
                                        {item.Dni || "Sin datos"}
                                    </td>
                                    <td className="whitespace-nowrap px-4 py-2 text-gray-700 text-center">
                                        {item.Direccion || "Sin datos"}
                                    </td>
                                    <td className="whitespace-nowrap px-4 py-2 text-center">
                                        <Link
                                            href={`/preventista/cliente/${item.Id}`}
                                            className="inline-block rounded px-4 py-2 text-xs font-medium   "
                                        >
                                            <MdModeEdit className=" text-2xl text-yellow-400" />
                                        </Link>
                                    </td>

                                    <td className="whitespace-nowrap px-4 py-2 text-center">
                                        <div className="inline-block rounded px-4 py-2 text-xs font-medium cursor-pointer  ">
                                            <MdDeleteOutline
                                                className=" text-2xl text-red-400 "
                                                onClick={() =>
                                                    EliminarCliente(item.Id)
                                                }
                                            />
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </section>
    );
};

export default Tabla;

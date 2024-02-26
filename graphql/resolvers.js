import GraphQLBigInt from "graphql-bigint";

// import { PrismaClient } from '@prisma/client'
// const prisma = new PrismaClient()
import prisma from "pirsma";

// tipos de personas
// ConsumidorFinal = 0,
// Sistema = 1,
// Web = 2,
// Preventista = 3,

export const resolvers = {
    Query: {
        // Rubro ✔
        GET_Rubro: async (root, args) => {
            const { Medicamento } = args;

            // buscar
            return await prisma.rubro.findMany({
                where: {
                    EstaEliminado: false,
                    Descripcion: Medicamento
                        ? { notIn: ["Indefinido"] }
                        : { notIn: ["Medicamentos", "Indefinido"] },
                },
                include: {
                    Articulo: { where: { EstaEliminado: false } },
                },
            });
        },
        // Articulo ✔
        GET_Articulo: async () => {
            return await prisma.articulo.findMany({
                where: {
                    EstaEliminado: false,
                },
                include: {
                    Marca: true,
                    Rubro: true,
                },
                orderBy: {
                    Descripcion: "asc",
                },
            });
        },
        FILTRO_Articulo: async (root, args) => {
            const { keyword, rubro, medicamento } = args;
            let datos;

            // Sin Rubro
            if (rubro == null) {
                // Con medicamentos
                if (medicamento) {
                    datos = await prisma.articulo.findMany({
                        where: {
                            Descripcion: {
                                contains: keyword,
                            },
                            EstaEliminado: false,
                        },
                        include: {
                            Marca: true,
                            Rubro: true,
                        },
                        orderBy: {
                            Descripcion: "asc",
                        },
                    });

                    return datos;
                } // Sin medicamentos
                else {
                    const MedicamentoId = await prisma.rubro.findFirst({
                        where: { Descripcion: "Medicamentos" },
                    });
                    console.log(MedicamentoId);

                    datos = await prisma.articulo.findMany({
                        where: {
                            Descripcion: {
                                contains: keyword,
                            },
                            EstaEliminado: false,
                            RubroId: { not: MedicamentoId.Id },
                        },
                        include: {
                            Marca: true,
                            Rubro: true,
                        },
                        orderBy: {
                            Descripcion: "asc",
                        },
                    });

                    return datos;
                }
            }

            // Por rubro
            datos = await prisma.articulo.findMany({
                where: {
                    Descripcion: {
                        contains: keyword,
                    },
                    RubroId: rubro,
                    EstaEliminado: false,
                },
                include: {
                    Marca: true,
                    Rubro: true,
                },
                orderBy: {
                    Descripcion: "asc",
                },
            });

            return datos;
        },
        GET_Articulos_Oferta: async (root, args) => {
            const { medicamento } = args;

            try {
                if (!medicamento) {
                    const rubro = await prisma.rubro.findFirst({
                        where: { Descripcion: "Medicamentos" },
                    });

                    var data = await prisma.articulo.findMany({
                        where: {
                            EstaEliminado: false,
                            Oferta: true,
                            RubroId: { not: rubro.Id },
                        },
                    });

                    return data;
                }

                var data = await prisma.articulo.findMany({
                    where: {
                        EstaEliminado: false,
                        Oferta: true,
                    },
                });

                return data;
            } catch (error) {
                throw new Error(`${error.message}`);
            }
        },
        // Clientes ✔
        GET_Clientes: async (root, args) => {
            const { cadena, personaId } = args;
            console.log(cadena, personaId);
            // Buscar clientes dependiendo de ( EmpleadoLegajo ) === legajoEmpleado.

            try {
                const empleado = await prisma.persona_Empleado.findUnique({
                    where: { Id: personaId },
                    include: { Persona: true },
                });

                if (!empleado) {
                    throw new Error(`Error, Persona no encontrada`);
                }

                if (empleado.Persona.Roll !== 3) {
                    throw new Error(`Error, No eres preventista`);
                }

                console.log(empleado);

                const clientes = await prisma.persona_Cliente.findMany({
                    where: {
                        EmpleadoLegajo: empleado.Legajo,
                        Persona: { Roll: 2, EstaEliminado: false },
                        ...(cadena
                            ? {
                                  OR: [
                                      {
                                          Persona: {
                                              Nombre: {
                                                  contains: cadena,
                                              },
                                          },
                                      },
                                      {
                                          Persona: {
                                              Apellido: {
                                                  contains: cadena,
                                              },
                                          },
                                      },
                                  ],
                              }
                            : {}),
                    },
                    include: {
                        Persona: true,
                    },
                    orderBy: {
                        Persona: { Apellido: "asc" },
                    },
                });

                console.log(clientes);

                const typeCliente = clientes.map((cliente, index) => {
                    return {
                        Id: cliente.Id,
                        Apellido: cliente.Persona.Apellido,
                        Nombre: cliente.Persona.Nombre,
                        Dni: cliente.Persona.Dni,
                        Direccion: cliente.Persona.Direccion,
                        Telefono: cliente.Persona.Telefono,
                        Mail: cliente.Persona.Mail,
                        EstaEliminado: cliente.Persona.EstaEliminado,
                        Medicamento: cliente.Medicamento,
                    };
                });

                console.log(typeCliente);

                return typeCliente;
            } catch (error) {
                console.log(error.message);
                // return [];
                throw new Error(`${error.message}`);
            }
        },
    },
    Mutation: {
        // Pedidos Clientes Web
        ADD_Pedido: async (root, args, context) => {
            if (context.isAuthenticated === false) {
                throw new Error(`Error: No estas autorizado.`);
            }
            const { articulos, usuario } = args;

            let _ListaArticulos = [];

            //const fecha = Date.now(); // milisegundos
            // formato ISO 8601  La "Z" al final indica que la fecha y hora están en la zona horaria UTC (Tiempo Universal Coordinado). Sql server Guardar
            //const hoy = new Date(fecha).toISOString(); // formato ISO 8601 en UTC

            // Probar -
            const hoy = ObtenerFecha();

            try {
                //#region CLIENTE
                const _Usu = await prisma.persona.findFirst({
                    where: {
                        Mail: usuario,
                    },
                    include: { Persona_Cliente: true },
                });

                if (_Usu === null) {
                    throw {
                        message: `El usuario no Existe: ${usuario}`,
                        bandera: true,
                    };
                }

                //#endregion

                // Creamos los detalles en memoria
                let _DetalleComprobantes = [];
                let _Total = 0;

                // transaccion
                const _Trans = await prisma.$transaction(async (prisma) => {
                    //#region Articulos - Stock - Total - Lista de Detalle Comprobante
                    for (const art of articulos) {
                        // buscar articulo en la base de datos
                        const _ArticuloBD = await prisma.articulo.findUnique({
                            where: { Id: art.Id },
                        });
                        // si no existe error
                        if (_ArticuloBD === null) {
                            throw {
                                message: `Codigo de Articulo no Existe: ${art.Descripcion}`,
                                bandera: true,
                            };
                        }
                        // comprobar si hay stock
                        if (!_ArticuloBD.PermiteStockNegativo) {
                            if (_ArticuloBD.Stock < art.Cantidad) {
                                throw {
                                    message: `Error no hay Stock Para el articulo: ${art.Descripcion} Stock Actual: ${_ArticuloBD.Stock}`,
                                    bandera: true,
                                };
                            } else {
                                // descontar stock - actualizar Cantidad
                                _ArticuloBD.Stock =
                                    _ArticuloBD.Stock - art.Cantidad;

                                await prisma.articulo.update({
                                    where: {
                                        Id: _ArticuloBD.Id,
                                    },
                                    data: {
                                        Stock: _ArticuloBD.Stock,
                                    },
                                });
                            }
                        }

                        // Total
                        const precioConDescuento =
                            _ArticuloBD.Descuento == null
                                ? _ArticuloBD.PrecioVenta
                                : _ArticuloBD.PrecioVenta -
                                  _ArticuloBD.PrecioVenta *
                                      (_ArticuloBD.Descuento / 100);

                        const _SubTotal = art.Cantidad * precioConDescuento;
                        _Total += _SubTotal;

                        // Detalle comprobante lista memoria
                        _DetalleComprobantes.push({
                            ArticuloId: _ArticuloBD.Id,
                            Codigo: _ArticuloBD.Codigo.toString(),
                            Descripcion: _ArticuloBD.Descripcion,
                            Cantidad: art.Cantidad,
                            Precio: precioConDescuento,
                            PrecioCosto: _ArticuloBD.PrecioCosto,
                            SubTotal: _SubTotal,
                            Dto:
                                _ArticuloBD.Descuento === null
                                    ? 0
                                    : _ArticuloBD.Descuento,
                            EstaEliminado: false,
                            PorcentajeGananciaPreventista:
                                _ArticuloBD.PorcentajeGananciaPreventista,
                            TotalGananciaPreventista:
                                _SubTotal *
                                (_ArticuloBD.PorcentajeGananciaPreventista /
                                    100),
                        });

                        // Guardar en lista
                        _ListaArticulos.push(_ArticuloBD);
                    }

                    //#region COMPROBANTE
                    // 1 - Emplreado - el primer empleado es el que factura en el sistema. (modificar en caso que tengas un empreado propio para la web)
                    // const _empleado = await prisma.persona_Empleado.findFirst({
                    //     where: { Legajo: 1 },
                    //     include: { Usuario: true },
                    // });

                    // if (_empleado === null) {
                    //     throw {
                    //         message: `Error, no hay empreado asignado en el sistema...`,
                    //         bandera: true,
                    //     };
                    // }

                    const _empleado = await prisma.persona_Empleado.findFirst({
                        where: {
                            Legajo: _Usu.Persona_Cliente.EmpleadoLegajo,
                        },
                        include: { Usuario: true },
                    });

                    if (_empleado === null) {
                        throw {
                            message: `El usuario ${usuario}, no tiene un Empleado asiganado para facturar`,
                            bandera: true,
                        };
                    }

                    if (_empleado.Usuario.length === 0) {
                        throw {
                            message: `El usuario ${usuario}, no tiene un Empleado asiganado para facturar`,
                            bandera: true,
                        };
                    }

                    // 2 - Obtener Siguiente numero comprobante

                    const Numero = await prisma.comprobante.findFirst({
                        orderBy: { Numero: "desc" },
                    });

                    // fin -
                    const _Comprobante = await prisma.comprobante.create({
                        data: {
                            EmpleadoId: _empleado.Id,
                            UsuarioId: _empleado.Usuario[0].Id,
                            Fecha: hoy,
                            Numero: Numero ? Numero.Numero + 1 : 1,
                            SubTotal: _Total,
                            Descuento: 0,
                            Total: _Total,
                            TipoComprobante: 3,
                            Efectivo: 0,
                            CuentaCorriente: 0,
                            Estado: 1,
                            ClienteId: _Usu.Id,
                            PagoCuentaCorriente: false,
                            EstaEliminado: false,
                        },
                    });
                    //#endregion

                    //#region DETALLE DE PEDIDOS
                    for (const art of _DetalleComprobantes) {
                        // Crear el detalle
                        await prisma.detalleComprobante.create({
                            data: {
                                ...art,
                                ComprobanteId: _Comprobante.Id,
                            },
                        });
                    }
                    //#endregion
                });
            } catch (error) {
                console.log(error.message);
                if (error.bandera) {
                    throw new Error(`${error.message}`);
                }
                throw new Error(`Error, En el Servidor`);
            }

            return _ListaArticulos;
        },
        // Pedidos Comprobantes Web
        ADD_Pedido_Preventista: async (root, args, context) => {
            if (context.isAuthenticated === false) {
                throw new Error(`Error: No estas autorizado.`);
            }

            const { personaId, articulos, clienteId } = args;

            console.log(personaId, articulos, clienteId);

            let _ListaArticulos = [];

            const hoy = ObtenerFecha();

            try {
                //#region CLIENTE
                const _cliente = await prisma.persona_Cliente.findFirst({
                    where: {
                        Id: clienteId,
                    },
                    include: {
                        Persona: true,
                    },
                });

                if (_cliente === null) {
                    throw {
                        message: `El No existe: ${_cliente.Persona.Nombre} ${_cliente.Persona.Apellido}`,
                        bandera: true,
                    };
                }
                //#endregion

                // Creamos los detalles en memoria
                let _DetalleComprobantes = [];
                let _Total = 0;

                // transaccion
                const _Trans = await prisma.$transaction(async (prisma) => {
                    //#region Articulos - Stock - Total - Lista de Detalle Comprobante
                    for (const art of articulos) {
                        // buscar articulo en la base de datos
                        const _ArticuloBD = await prisma.articulo.findUnique({
                            where: { Id: art.Id },
                        });
                        // si no existe error
                        if (_ArticuloBD === null) {
                            throw {
                                message: `Codigo de Articulo no Existe: ${art.Descripcion}`,
                                bandera: true,
                            };
                        }
                        // comprobar si hay stock
                        if (!_ArticuloBD.PermiteStockNegativo) {
                            if (_ArticuloBD.Stock < art.Cantidad) {
                                throw {
                                    message: `Error no hay Stock Para el articulo: ${art.Descripcion} Stock Actual: ${_ArticuloBD.Stock}`,
                                    bandera: true,
                                };
                            } else {
                                // descontar stock - actualizar Cantidad
                                _ArticuloBD.Stock =
                                    _ArticuloBD.Stock - art.Cantidad;

                                await prisma.articulo.update({
                                    where: {
                                        Id: _ArticuloBD.Id,
                                    },
                                    data: {
                                        Stock: _ArticuloBD.Stock,
                                    },
                                });
                            }
                        }

                        // Total
                        const precioConDescuento =
                            _ArticuloBD.Descuento == null
                                ? _ArticuloBD.PrecioVenta
                                : _ArticuloBD.PrecioVenta -
                                  _ArticuloBD.PrecioVenta *
                                      (_ArticuloBD.Descuento / 100);

                        const _SubTotal = art.Cantidad * precioConDescuento;
                        _Total += _SubTotal;

                        // Detalle comprobante lista memoria
                        _DetalleComprobantes.push({
                            ArticuloId: _ArticuloBD.Id,
                            Codigo: _ArticuloBD.Codigo.toString(),
                            Descripcion: _ArticuloBD.Descripcion,
                            Cantidad: art.Cantidad,
                            Precio: precioConDescuento,
                            PrecioCosto: _ArticuloBD.PrecioCosto,
                            SubTotal: _SubTotal,
                            Dto:
                                _ArticuloBD.Descuento === null
                                    ? 0
                                    : _ArticuloBD.Descuento,
                            EstaEliminado: false,
                            PorcentajeGananciaPreventista:
                                _ArticuloBD.PorcentajeGananciaPreventista,
                            TotalGananciaPreventista:
                                _SubTotal *
                                (_ArticuloBD.PorcentajeGananciaPreventista /
                                    100),
                        });

                        // Guardar en lista
                        _ListaArticulos.push(_ArticuloBD);
                    }

                    //#region COMPROBANTE
                    // 1 - Emplreado - el primer empleado es el que factura en el sistema. (modificar en caso que tengas un empreado propio para la web)
                    const _empleado = await prisma.persona_Empleado.findFirst({
                        where: { Id: personaId },
                        include: { Usuario: true },
                    });

                    if (_empleado === null) {
                        throw {
                            message: `Error, preventista no encontrado...`,
                            bandera: true,
                        };
                    }

                    if (_empleado.Usuario.length === 0) {
                        throw {
                            message: `Error, preventista tiene usuario...`,
                            bandera: true,
                        };
                    }
                    // 2 - Obtener Siguiente numero comprobante

                    const Numero = await prisma.comprobante.findFirst({
                        orderBy: { Numero: "desc" },
                    });

                    // fin -
                    const _Comprobante = await prisma.comprobante.create({
                        data: {
                            EmpleadoId: _empleado.Id,
                            UsuarioId: _empleado.Usuario[0].Id,
                            Fecha: hoy,
                            Numero: Numero ? Numero.Numero + 1 : 1,
                            SubTotal: _Total,
                            Descuento: 0,
                            Total: _Total,
                            TipoComprobante: 3,
                            Efectivo: 0,
                            CuentaCorriente: 0,
                            Estado: 1,
                            ClienteId: _cliente.Id,
                            PagoCuentaCorriente: false,
                            EstaEliminado: false,
                        },
                    });
                    //#endregion

                    //#region DETALLE DE PEDIDOS
                    for (const art of _DetalleComprobantes) {
                        // Crear el detalle
                        await prisma.detalleComprobante.create({
                            data: {
                                ...art,
                                ComprobanteId: _Comprobante.Id,
                            },
                        });
                    }
                    //#endregion
                });
            } catch (error) {
                console.log("entras aqui");
                console.log(error);
                console.log(error.message);

                if (error.bandera) {
                    throw new Error(`${error.message}`);
                }
                throw new Error(`Error, En el Servidor`);
            }

            return _ListaArticulos;
        },
        // Agregar Clientes desde web Preventistas
        ADD_Cliente: async (root, args, context) => {
            if (context.isAuthenticated === false) {
                throw new Error(`Error: No estas autorizado.`);
            }
            const {
                Apellido,
                Nombre,
                Dni,
                Direccion,
                Telefono,
                Mail,
                empleadoId,
            } = args;

            console.log(
                Apellido,
                Nombre,
                Dni,
                Direccion,
                Telefono,
                Mail,
                empleadoId
            );

            try {
                // comprobar que empleadoId sea preveentista
                const _empleado = await prisma.persona_Empleado.findUnique({
                    where: { Id: empleadoId },
                    include: { Persona: true, Usuario: true },
                });

                if (_empleado === null) {
                    throw {
                        message: `Error, Preventista no encontrado...`,
                        bandera: true,
                    };
                }

                if (_empleado.Persona.Roll !== 3) {
                    throw {
                        message: `Error, no eres un Preventista`,
                        bandera: true,
                    };
                }

                if (_empleado.Usuario === null) {
                    throw {
                        message: `Error, Preventista no tiene usuario`,
                        bandera: true,
                    };
                }

                // Agregar persona Cliente y persona
                const _Trans = await prisma.$transaction(async (prisma) => {
                    const _persona = await prisma.persona.create({
                        data: {
                            Apellido,
                            Nombre,
                            Dni,
                            Direccion,
                            Telefono,
                            Mail: "",
                            LocalidadId: 12,
                            EstaEliminado: false,
                            Roll: 2,
                        },
                    });

                    const _personaCliente = await prisma.persona_Cliente.create(
                        {
                            data: {
                                Id: _persona.Id,
                                ActivarCtaCte: true,
                                TieneLimiteCompra: false,
                                MontoMaximoCtaCte: 0,
                                Deuda: 0,
                                Medicamento: false,
                                EmpleadoLegajo: _empleado.Legajo,
                            },
                        }
                    );
                });

                console.log("Termina");
                // retornar persona agregada
                return [];
            } catch (error) {
                console.log(error.message);
                if (error.bandera) {
                    throw new Error(`${error.message}`);
                }
                throw new Error(`Error, En el Servidor`);
            }
        },
    },
    BigInt: GraphQLBigInt,
    // Pedido: {
    //     Fecha: (root) => formatDate(root.Fecha), // cuando sale para c#
    // },
    // Articulo: {
    //     id: (root) => root.Id
    //     //Foto: (root) => Buffer.from(root.Foto).toString('base64')
    // }
    // Nota: {
    //     Compuesto: (root) => `${root.title}, ${root.description}`,
    //     CompuestoStatico: () => 'Dato Estatico no calculado'
    // }
};

function formatDate(date) {
    var d = new Date(date),
        month = "" + (d.getMonth() + 1),
        day = "" + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) month = "0" + month;
    if (day.length < 2) day = "0" + day;

    const options = { timeZone: "America/Argentina/Buenos_Aires" }; // Establece la zona horaria de Argentina
    const hora = d.toLocaleTimeString("es-ES", options);
    const fecha = `${[year, month, day].join("-")} ${hora}`;

    return fecha;
}

function ObtenerFecha() {
    const fechaHoraActual = new Date();

    // Ajustar la zona horaria a Argentina (UTC-3)
    fechaHoraActual.setUTCHours(fechaHoraActual.getUTCHours() - 3);

    // Formatear la fecha y hora en formato ISO
    const fechaHoraFormateada =
        fechaHoraActual.toISOString().slice(0, -1) + "Z";

    return fechaHoraFormateada;
}

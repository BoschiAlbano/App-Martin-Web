import GraphQLBigInt from "graphql-bigint";

// import { PrismaClient } from '@prisma/client'
// const prisma = new PrismaClient()
import prisma from "pirsma";

export const resolvers = {
    Query: {
        GetUser: async (root, args) => {
            const usuarios = await prisma.user.findFirst({
                where: {
                    email: {
                        contains: args.email,
                    },
                },
            });

            return usuarios;
        },
        GetUsers: async (root, args, context) => {
            if (context.isAuthenticated === false) {
                throw new Error(`Error: No estas autorizado.`);
            }

            try {
                const UsuariosVerificados = await prisma.user.findMany();

                if (UsuariosVerificados.length === 0) {
                    throw new Error("No hay Usuarios Registrados");
                }

                return UsuariosVerificados;
            } catch (error) {
                throw new Error(`${error.message}`);
            }
        },
        // Marca
        GET_Marca: async () => {
            const Marca = await prisma.marca.findMany({
                where: {
                    EstaEliminado: false,
                },
                include: {
                    Articulo: true,
                },
            });

            return Marca;
        },
        GET_Marcaid: async (root, args) => {
            const Marca = await prisma.marca.findFirst({
                where: {
                    Id: args.id,
                    EstaEliminado: false,
                },
                include: {
                    Articulo: {
                        include: {
                            Marca: true,
                        },
                    },
                },
            });

            return Marca;
        },
        // Rubro
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
                    Articulo: true,
                },
            });
        },
        GET_Rubroid: async (root, args) => {
            return await prisma.rubro.findFirst({
                where: {
                    Id: args.id,
                    EstaEliminado: false,
                },
                include: {
                    Articulo: true,
                },
            });
        },
        // Articulo
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
        GET_Articuloid: async (root, args) => {
            return await prisma.articulo.findFirst({
                where: {
                    Id: args.id,
                    EstaEliminado: false,
                },
                include: {
                    Rubro: true,
                    Marca: true,
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
        // Pedidos
        GET_Pedidos: async (root, args) => {
            const _get = await prisma.pedido.findMany({
                where: { Estado: false },
                include: {
                    User: true,
                    DetallePedido: true,
                },
            });

            return _get;
        },
        GET_Pedido_Usuario: async (root, args) => {
            const { email } = args;

            try {
                // buscar el usuario
                const _usu = await prisma.user.findUnique({ where: { email } });
                if (!_usu) {
                    throw { message: `El usuario ${email} no esta registrado` };
                }

                const _get = await prisma.pedido.findMany({
                    where: { UserId: _usu.id },
                    include: {
                        DetallePedido: true,
                    },
                });

                return _get;
            } catch (error) {
                throw new Error(`${error.message}`);
            }
        },
    },
    Mutation: {
        // usar en js ✔
        ADD_Pedido: async (root, args, context) => {
            const { articulos, usuario } = args;

            let _ListaArticulos = [];

            const fecha = Date.now(); // milisegundos
            const hoy = new Date(fecha); // formato ISO 8601  La "Z" al final indica que la fecha y hora están en la zona horaria UTC (Tiempo Universal Coordinado). Sql server Guardar

            try {
                // 😭 Modificar para guardar un comprobrante y detalle de comprobante en estado pendiende de pago. descontar el stock

                // Buscar el cliente.
                // Crear Comprobrante. (Obtener siguiente numero de comprobante)
                // Crear el detalle de comprobante (Descontar stock)

                //#region CLIENTE
                const _Usu = await prisma.persona.findFirst({
                    where: {
                        Mail: usuario,
                    },
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

                        _Total += art.Cantidad * precioConDescuento;

                        // Detalle comprobante lista memoria
                        _DetalleComprobantes.push({
                            ArticuloId: _ArticuloBD.Id,
                            Codigo: _ArticuloBD.Codigo.toString(),
                            Descripcion: _ArticuloBD.Descripcion,
                            Cantidad: art.Cantidad,
                            Precio: precioConDescuento,
                            PrecioCosto: _ArticuloBD.PrecioCosto,
                            SubTotal: art.Cantidad * precioConDescuento,
                            Dto: 0,
                            EstaEliminado: false,
                        });

                        // Guardar en lista
                        _ListaArticulos.push(_ArticuloBD);
                    }

                    //#region COMPROBANTE
                    // 1 - Emplreado - el primer empleado es el que factura en el sistema. (modificar en caso que tengas un empreado propio para la web)
                    const _empleado = await prisma.persona_Empleado.findFirst({
                        where: { Legajo: 1 },
                        include: { Usuario: true },
                    });

                    if (_empleado === null) {
                        throw {
                            message: `Error, no hay empreado asignado en el sistema...`,
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
        // usar en C# ✔
        ADD_Articulo: async (root, args, context) => {
            if (context.isAuthenticated === false) {
                throw new Error(`Error: No estas autorizado.`);
            }

            const { articulo } = args;

            try {
                // Marca
                const _marca = await prisma.marca.findFirst({
                    where: {
                        Descripcion: articulo.marca,
                    },
                });
                if (!_marca) {
                    throw {
                        message: `Error, La Marca ${articulo.marca} no existe`,
                    };
                }

                // Rubro
                const _rubro = await prisma.rubro.findFirst({
                    where: {
                        Descripcion: articulo.rubro,
                    },
                });
                if (!_rubro) {
                    throw {
                        message: `Error, El Rubro ${articulo.Rubro} no existe`,
                    };
                }

                const NewArticulo = await prisma.articulo.create({
                    data: {
                        MarcaId: _marca.Id,
                        RubroId: _rubro.Id,
                        Codigo: articulo.codigo,
                        Descripcion: articulo.descripcion,
                        Stock: articulo.stock,
                        EstaEliminado: articulo.estaEliminado,
                        Oferta: articulo.oferta,
                        FotoUrl:
                            articulo.fotoUrl != "" ? articulo.fotoUrl : null,
                        PrecioVenta: articulo.precioVenta,
                        PermiteStockNegativo: articulo.permiteStockNegativo,
                        Descuento: articulo.descuento,
                    },
                });

                return NewArticulo;
            } catch (error) {
                throw new Error(`${error.message}`);
            }
        },
        Update_Articulo: async (root, args, context) => {
            if (context.isAuthenticated === false) {
                throw new Error(`Error: No estas autorizado.`);
            }

            const { articulo } = args;

            // marca y rubro -> MarcaId y RubroId

            try {
                // Marca
                const _marca = await prisma.marca.findFirst({
                    where: {
                        Descripcion: articulo.marca,
                    },
                });
                if (!_marca) {
                    throw {
                        message: `Error, La Marca ${articulo.marca} no existe`,
                    };
                }

                // Rubro
                const _rubro = await prisma.rubro.findFirst({
                    where: {
                        Descripcion: articulo.rubro,
                    },
                });
                if (!_rubro) {
                    throw {
                        message: `Error, El Rubro ${articulo.rubro} no existe`,
                    };
                }

                const cod = await prisma.articulo.findUnique({
                    where: { Codigo: articulo.codigo },
                });

                console.table(articulo);

                if (!cod) {
                    // Articulo no existe lo creo
                    const NewArticulo = await prisma.articulo.create({
                        data: {
                            MarcaId: _marca.Id,
                            RubroId: _rubro.Id,
                            Codigo: articulo.codigo,
                            Descripcion: articulo.descripcion,
                            Stock: articulo.stock,
                            EstaEliminado: articulo.estaEliminado,
                            Oferta: articulo.oferta,
                            FotoUrl:
                                articulo.fotoUrl != ""
                                    ? articulo.fotoUrl
                                    : null,
                            PrecioVenta: articulo.precioVenta,
                            PermiteStockNegativo: articulo.permiteStockNegativo,
                            Descuento: articulo.descuento,
                        },
                    });

                    return NewArticulo;
                }

                // Actualizo
                const _update = await prisma.articulo.update({
                    where: {
                        Codigo: articulo.codigo,
                    },
                    data: {
                        MarcaId: _marca.Id,
                        RubroId: _rubro.Id,
                        Codigo: articulo.codigo,
                        Descripcion: articulo.descripcion,
                        Stock: articulo.stock,
                        EstaEliminado: articulo.estaEliminado,
                        Oferta: articulo.oferta,
                        FotoUrl:
                            articulo.fotoUrl != "" ? articulo.fotoUrl : null,
                        PrecioVenta: articulo.precioVenta,
                        PermiteStockNegativo: articulo.permiteStockNegativo,
                        Descuento: articulo.descuento,
                    },
                });

                return _update;
            } catch (error) {
                throw new Error(`${error.message}`);
            }
        },
        Delete_Articulo: async (root, args, context) => {
            if (context.isAuthenticated === false) {
                throw new Error(`Error: No estas autorizado.`);
            }

            const { codigo, EstaEliminado } = args;

            try {
                const _delete = await prisma.articulo.update({
                    where: {
                        Codigo: codigo,
                    },
                    data: { EstaEliminado },
                });

                return _delete;
            } catch (error) {
                throw new Error(`${error.message}`);
            }
        },
        ADD_Stock_Articulo: async (root, args, context) => {
            if (context.isAuthenticated === false) {
                throw new Error(`Error: No estas autorizado.`);
            }

            // desde c# mandar el total de stock
            const update = await prisma.articulo.update({
                where: {
                    Codigo: args.codigo,
                },
                data: { Stock: args.cantidad },
            });

            return update;
        },
        Update_Stock_Articulos: async (root, args, context) => {
            if (context.isAuthenticated === false) {
                throw new Error(`Error: No estas autorizado.`);
            }

            const { lista } = args;

            console.table(lista);

            try {
                // transaccion
                const _Trans = await prisma.$transaction(async (prisma) => {
                    for (const art of lista) {
                        // Crear el detalle
                        await prisma.articulo.update({
                            where: {
                                Codigo: art.codigo,
                            },
                            data: {
                                Stock: art.stock,
                            },
                        });
                    }
                });

                console.log(_Trans);

                return true;
            } catch (error) {
                throw new Error(`${error.message}`);
            }
        },
        Update_PrecioVenta_Articulos: async (root, args, context) => {
            if (context.isAuthenticated === false) {
                throw new Error(`Error: No estas autorizado.`);
            }

            const { lista } = args;

            console.table(lista);

            try {
                // transaccion
                const _Trans = await prisma.$transaction(async (prisma) => {
                    for (const art of lista) {
                        // Crear el detalle
                        await prisma.articulo.update({
                            where: {
                                Codigo: art.codigo,
                            },
                            data: {
                                PrecioVenta: art.precioVenta,
                            },
                        });
                    }
                });

                console.log(_Trans);

                return true;
            } catch (error) {
                throw new Error(`${error.message}`);
            }
        },
        UsuarioMedicamento: async (root, args, context) => {
            if (context.isAuthenticated === false) {
                throw new Error(`Error: No estas autorizado.`);
            }

            const { id } = args;

            try {
                const _usuario = await prisma.user.findUnique({
                    where: { id },
                });

                const actualizar = await prisma.user.update({
                    where: { id },
                    data: {
                        medicamento: !_usuario.medicamento,
                    },
                });

                if (actualizar) {
                    return true;
                }

                return false;
            } catch (error) {
                throw new Error(`${error.message}`);
            }
        },
        Delete_User: async (root, args, context) => {
            if (context.isAuthenticated === false) {
                throw new Error(`Error: No estas autorizado.`);
            }

            const { id } = args;

            try {
                // const _usuario = await prisma.user.findUnique({
                //     where: { id },
                // });

                const actualizar = await prisma.user.delete({ where: { id } });

                if (actualizar) {
                    return true;
                }

                return false;
            } catch (error) {
                throw new Error(`${error.message}`);
            }
        },
        // Marca ✔
        ADD_Marca: async (root, args, context) => {
            if (context.isAuthenticated === false) {
                throw new Error(`Error: No estas autorizado.`);
            }

            const { Codigo, Descripcion } = args;

            console.log(Codigo);
            console.log(Descripcion);

            try {
                const _add = await prisma.marca.create({
                    data: {
                        Codigo,
                        Descripcion,
                        EstaEliminado: false,
                    },
                });

                return _add;
            } catch (error) {
                throw new Error(`${error.message}`);
            }
        },
        Update_Marca: async (root, args, context) => {
            if (context.isAuthenticated === false) {
                throw new Error(`Error: No estas autorizado.`);
            }

            const { Codigo, Descripcion } = args;

            try {
                const _marca = await prisma.marca.findUnique({
                    where: { Codigo },
                });

                if (_marca == null) {
                    // no existe - la creo
                    const _add = await prisma.marca.create({
                        data: {
                            Codigo,
                            Descripcion,
                            EstaEliminado: false,
                        },
                    });

                    return _add;
                }

                if (Descripcion == _marca.Descripcion) return _marca;

                const _update = await prisma.marca.update({
                    where: {
                        Id: _marca.Id,
                    },
                    data: { Descripcion },
                });

                return _update;
            } catch (error) {
                throw new Error(`${error.message}`);
            }
        },
        Delete_Marca: async (root, args, context) => {
            if (context.isAuthenticated === false) {
                throw new Error(`Error: No estas autorizado.`);
            }

            const { Codigo, EstaEliminado } = args;

            try {
                const _update = await prisma.marca.update({
                    where: {
                        Codigo,
                    },
                    data: { EstaEliminado },
                });

                return _update;
            } catch (error) {
                throw new Error(`${error.message}`);
            }
        },
        // Rubro ✔
        ADD_Rubro: async (root, args, context) => {
            if (context.isAuthenticated === false) {
                throw new Error(`Error: No estas autorizado.`);
            }

            const { Codigo, Descripcion } = args;

            try {
                const _add = await prisma.rubro.create({
                    data: {
                        Codigo,
                        Descripcion,
                        EstaEliminado: false,
                    },
                });

                return _add;
            } catch (error) {
                throw new Error(`${error.message}`);
            }
        },
        Update_Rubro: async (root, args, context) => {
            if (context.isAuthenticated === false) {
                throw new Error(`Error: No estas autorizado.`);
            }

            const { Codigo, Descripcion } = args;

            try {
                const _rubro = await prisma.rubro.findUnique({
                    where: { Codigo },
                });

                if (!_rubro) {
                    // no existe - lo creo
                    const _add = await prisma.rubro.create({
                        data: {
                            Codigo,
                            Descripcion,
                            EstaEliminado: false,
                        },
                    });

                    return _add;
                }

                if (Descripcion == _rubro.Descripcion) return _rubro;

                const _update = await prisma.rubro.update({
                    where: {
                        Id: _rubro.Id,
                    },
                    data: { Descripcion },
                });

                return _update;
            } catch (error) {
                throw new Error(`${error.message}`);
            }
        },
        Delete_Rubro: async (root, args, context) => {
            if (context.isAuthenticated === false) {
                throw new Error(`Error: No estas autorizado.`);
            }

            const { Codigo, EstaEliminado } = args;

            try {
                const _update = await prisma.rubro.update({
                    where: {
                        Codigo,
                    },
                    data: { EstaEliminado },
                });

                return _update;
            } catch (error) {
                throw new Error(`${error.message}`);
            }
        },
    },
    BigInt: GraphQLBigInt,
    Pedido: {
        Fecha: (root) => formatDate(root.Fecha), // cuando sale para c#
    },
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

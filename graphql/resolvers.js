import GraphQLBigInt from 'graphql-bigint'

// import { PrismaClient } from '@prisma/client'
// const prisma = new PrismaClient()
import prisma from 'pirsma'

export const resolvers = {
    Query: {
        GetUser: async (root, args) => {

            const usuarios = await prisma.user.findFirst({
                where: {
                    email: {
                        contains: args.email
                    }
                },
            })

            return usuarios
        },
        GetUsers: async (root, args) => {

            try {

                const UsuariosVerificados = await prisma.user.findMany()

                if (UsuariosVerificados.length === 0) {
                    throw new Error("No hay Usuarios Registrados")
                }

                return UsuariosVerificados

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
                }
            })

            return Marca
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
                            Marca: true
                        }
                    },
                }
            })

            return Marca
        },
        // Rubro
        GET_Rubro: async (root, args) => {

            const { Medicamento } = args;

            // buscar            
            return await prisma.rubro.findMany({
                where: {
                    EstaEliminado: false,
                    Descripcion: Medicamento ? { notIn: ["Indefinido"] } : { notIn: ["Medicamentos", "Indefinido"] }
                },
                include: {
                    Articulo: true,
                }
            })
        },
        GET_Rubroid: async (root, args) => {
            return await prisma.rubro.findFirst({
                where: {
                    Id: args.id,
                    EstaEliminado: false,
                },
                include: {
                    Articulo: true
                }
            })
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
                }
            })
        },
        GET_Articuloid: async (root, args) => {
            return await prisma.articulo.findFirst({
                where: {
                    Id: args.id,
                    EstaEliminado: false,
                },
                include: {
                    Rubro: true,
                    Marca: true
                }
            })
        },
        FILTRO_Articulo: async (root, args) => {
            const { keyword, rubro } = args
            let datos;
            console.log(rubro)

            if (rubro == null) {
                datos = await prisma.articulo.findMany({
                    where: {
                        Descripcion: {
                            contains: keyword
                        },
                        EstaEliminado: false,
                    },
                    include: {
                        Marca: true,
                        Rubro: true
                    }
                })

                return datos
            }

            datos = await prisma.articulo.findMany({
                where: {
                    Descripcion: {
                        contains: keyword
                    },
                    RubroId: rubro
                },
                include: {
                    Marca: true,
                    Rubro: true
                }
            })

            return datos
        },
        GET_Articulos_Oferta: async (root, args) => {

            const { medicamento } = args;

            try {
                
                if (!medicamento) {

                    const rubro = await prisma.rubro.findFirst({where: { Descripcion: "Medicamentos"}})
                    
                    console.table(rubro)

                    return await prisma.articulo.findMany({
                        where: {
                            EstaEliminado: false,
                            Oferta: true,
                            RubroId: {not: rubro.Id}
                        }
                    })
                }
    
                return await prisma.articulo.findMany({
                    where: {
                        EstaEliminado: false,
                        Oferta: true,
                    }
                })

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
                    DetallePedido: true
                }
            })

            return _get
        },
        GET_Pedido_Usuario: async (root, args) => {

            const { email } = args

            try {

                // buscar el usuario
                const _usu = await prisma.user.findUnique({ where: { email } })
                if (!_usu) { throw { message: `El usuario ${email} no esta registrado` } }

                const _get = await prisma.pedido.findMany({
                    where: { UserId: _usu.id },
                    include: {
                        DetallePedido: true
                    }
                })

                return _get

            } catch (error) {
                throw new Error(`${error.message}`);
            }

        }
    },
    Mutation: {
        // usar en js ✔
        ADD_Pedido: async (root, args, context) => {

            const { articulos, usuario } = args

            let _ListaArticulos = []



            const fecha = Date.now(); // milisegundos
            const hoy = new Date(fecha); // formato ISO 8601  La "Z" al final indica que la fecha y hora están en la zona horaria UTC (Tiempo Universal Coordinado). Sql server Guardar

            let _pedido
            try {
                // Buscar Otra vez el usu para asociar al pedido - tengo email i es unico
                const _Usu = await prisma.user.findUnique({ where: { email: usuario } })
                if (_Usu === null){
                    throw {
                        message: `El usuario no Existe: ${usuario}`,
                        bandera: true
                    }
                } 

                // Creamos los detalles en memoria
                let _DetallePedidos = []
                let _Total = 0

                // transaccion
                const _Trans = await prisma.$transaction(async (prisma) => {
                    // Recorrer los pedidos art
                    for (const art of articulos) {

                        // buscar en bd
                        const _ArticuloBD = await prisma.articulo.findUnique({ where: { Id: art.Id } })
                        if (_ArticuloBD === null){
                            throw{
                                message: `Codigo de Articulo no Existe: ${art.Descripcion}`,
                                bandera: true
                            }
                        }

                        // comprobar si hay stock
                        if (!_ArticuloBD.PermiteStockNegativo) {

                            if (_ArticuloBD.Stock < art.Cantidad) {
                                throw {
                                    message: `Error no hay Stock Para el articulo: ${art.Descripcion} Stock Actual: ${_ArticuloBD.Stock}`,
                                    bandera: true
                                };
                            } else {
                                // descontar stock - actualizar Cantidad 
                                _ArticuloBD.Stock = _ArticuloBD.Stock - art.Cantidad

                                await prisma.articulo.update({
                                    where: {
                                        Id: _ArticuloBD.Id
                                    },
                                    data: {
                                        Stock: _ArticuloBD.Stock
                                    }
                                })
                            }
                        }

                        // total y detalle
                        _Total += art.Cantidad * _ArticuloBD.PrecioVenta

                        _DetallePedidos.push({
                            ArticuloId: _ArticuloBD.Id,
                            Codigo: _ArticuloBD.Codigo.toString(),
                            Descripcion: _ArticuloBD.Descripcion,
                            Cantidad: art.Cantidad,
                            Precio: _ArticuloBD.PrecioVenta,
                            SubTotal: art.Cantidad * _ArticuloBD.PrecioVenta,
                            EstaEliminado: false,
                        })

                        _ListaArticulos.push(_ArticuloBD)
                    };

                    // Crear el pedido
                    _pedido = await prisma.pedido.create({
                        data: {
                            UserId: _Usu.id,
                            Fecha: hoy,
                            SubTotal: _Total,
                            Descuento: 0,
                            Total: _Total,
                            Estado: false
                        }
                    })

                    for (const art of _DetallePedidos) {
                        // Crear el detalle
                        await prisma.detallePedido.create({
                            data: {
                                ...art,
                                PedidoId: _pedido.Id,
                            }
                        })
                    }

                })

            } catch (error) {
                
                if (error.bandera) {
                    throw new Error(`${error.message}`);
                }
                throw new Error(`Error, En el Servidor`);
            }

            return _ListaArticulos

        },
        Delete_Pedido: async (root, args, context) => {

            if (context.isAuthenticated === false) {
                throw new Error(`Error: No estas autorizado.`)
            }

            const { Id } = args;

            try {

                const _pedido = await prisma.pedido.findUnique({
                    where: { Id },
                    include: {
                        DetallePedido: true
                    }
                })

                if (!_pedido) { throw { message: `Error, El pedido con Codigo ${Id} no existe`, } }

                const _Trans = await prisma.$transaction(async (prisma) => {

                    // delete el detalle
                    const detalle = await prisma.detallePedido.deleteMany({
                        where: {
                            PedidoId: Id
                        }
                    })
                    // delete el pedido
                    const pedido = await prisma.pedido.delete({ where: { Id } })
                })

                return _pedido

            } catch (error) {
                throw new Error(`${error.message}`);
            }


        },
        Cancelar_Pedido: async (root, args, context) => {

            if (context.isAuthenticated === false) {
                throw new Error(`Error: No estas autorizado.`)
            }

            const { Id } = args;

            // eliminar - detalle de pedido - pedido - articulos actualizar stock (sumar)

            try {

                const _pedido = await prisma.pedido.findUnique({
                    where: {
                        Id
                    },
                    include: {
                        DetallePedido: true
                    }
                })

                if (!_pedido) { throw { message: `Error, El pedido con Codigo ${Id} no existe`, } }


                const _Trans = await prisma.$transaction(async (prisma) => {

                    await prisma.detallePedido.deleteMany({
                        where: {
                            PedidoId: _pedido.Id
                        }
                    })
                    // Aqui Terminar de hacer el cancelar pedido.... y depues ponerlo en c#
                    await prisma.pedido.delete({ where: { Id: _pedido.Id } })

                    for (const art of _pedido.DetallePedido) {

                        await prisma.articulo.update({
                            where: {
                                Id: art.ArticuloId
                            },
                            data: {
                                Stock: {
                                    increment: art.Cantidad
                                }
                            }
                        })

                    }
                })

                console.log("Sin Errores")

                return true;
            } catch (error) {
                console.log("Error")
                throw new Error(`${error.message}`);
            }

        },
        // usar en C# ✔
        ADD_Articulo: async (root, args, context) => {

            if (context.isAuthenticated === false) {
                throw new Error(`Error: No estas autorizado.`)
            }

            const { articulo } = args

            try {
                // Marca
                const _marca = await prisma.marca.findFirst({
                    where: {
                        Descripcion: articulo.marca,
                    },
                });
                if (!_marca) { throw { message: `Error, La Marca ${articulo.marca} no existe`, } }

                // Rubro
                const _rubro = await prisma.rubro.findFirst({
                    where: {
                        Descripcion: articulo.rubro,
                    },
                });
                if (!_rubro) { throw { message: `Error, El Rubro ${articulo.Rubro} no existe`, } }

                const NewArticulo = await prisma.articulo.create({
                    data: {
                        MarcaId: _marca.Id,
                        RubroId: _rubro.Id,
                        Codigo: articulo.codigo,
                        Descripcion: articulo.descripcion,
                        Stock: articulo.stock,
                        EstaEliminado: articulo.estaEliminado,
                        Oferta: articulo.oferta,
                        FotoUrl: articulo.fotoUrl != "" ? articulo.fotoUrl : null,
                        PrecioVenta: articulo.precioVenta,
                        PermiteStockNegativo: articulo.permiteStockNegativo,
                    }
                })

                return NewArticulo

            } catch (error) {
                throw new Error(`${error.message}`);
            }

        },
        Update_Articulo: async (root, args, context) => {

            if (context.isAuthenticated === false) {
                throw new Error(`Error: No estas autorizado.`)
            }

            const { articulo } = args

            // marca y rubro -> MarcaId y RubroId

            try {

                // Marca
                const _marca = await prisma.marca.findFirst({
                    where: {
                        Descripcion: articulo.marca,
                    },
                });
                if (!_marca) { throw { message: `Error, La Marca ${articulo.marca} no existe`, } }

                // Rubro
                const _rubro = await prisma.rubro.findFirst({
                    where: {
                        Descripcion: articulo.rubro,
                    },
                });
                if (!_rubro) { throw { message: `Error, El Rubro ${articulo.rubro} no existe`, } }

                const cod = await prisma.articulo.findUnique({ where: { Codigo: articulo.codigo } })

                console.table(articulo)


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
                            FotoUrl: articulo.fotoUrl != "" ? articulo.fotoUrl : null,
                            PrecioVenta: articulo.precioVenta,
                            PermiteStockNegativo: articulo.permiteStockNegativo,
                        }
                    })

                    return NewArticulo

                }

                // Actualizo
                const _update = await prisma.articulo.update({
                    where: {
                        Codigo: articulo.codigo
                    },
                    data: {
                        MarcaId: _marca.Id,
                        RubroId: _rubro.Id,
                        Codigo: articulo.codigo,
                        Descripcion: articulo.descripcion,
                        Stock: articulo.stock,
                        EstaEliminado: articulo.estaEliminado,
                        Oferta: articulo.oferta,
                        FotoUrl: articulo.fotoUrl != "" ? articulo.fotoUrl : null,
                        PrecioVenta: articulo.precioVenta,
                        PermiteStockNegativo: articulo.permiteStockNegativo,
                    }
                })

                return _update

            } catch (error) {
                throw new Error(`${error.message}`);
            }
        },
        Delete_Articulo: async (root, args, context) => {
            if (context.isAuthenticated === false) {
                throw new Error(`Error: No estas autorizado.`)
            }

            const { codigo, EstaEliminado } = args

            try {

                const _delete = await prisma.articulo.update({
                    where: {
                        Codigo: codigo
                    },
                    data: { EstaEliminado },
                })

                return _delete

            } catch (error) {
                throw new Error(`${error.message}`);
            }

        },
        ADD_Stock_Articulo: async (root, args, context) => {

            if (context.isAuthenticated === false) {
                throw new Error(`Error: No estas autorizado.`)
            }

            // desde c# mandar el total de stock
            const update = await prisma.articulo.update({
                where: {
                    Codigo: args.codigo
                },
                data: { Stock: args.cantidad },
            })

            return update
        },
        Update_Stock_Articulos: async (root, args, context) => {

            if (context.isAuthenticated === false) {
                throw new Error(`Error: No estas autorizado.`)
            }

            const { lista } = args

            console.table(lista)

            try {
                // transaccion
                const _Trans = await prisma.$transaction(async (prisma) => {

                    for (const art of lista) {
                        // Crear el detalle
                        await prisma.articulo.update({
                            where: {
                                Codigo: art.codigo
                            },
                            data: {
                                Stock: art.stock
                            }
                        })
                    }

                })

                console.log(_Trans)

                return true

            } catch (error) {
                throw new Error(`${error.message}`);
            }

        },
        Update_PrecioVenta_Articulos: async (root, args, context) => {

            if (context.isAuthenticated === false) {
                throw new Error(`Error: No estas autorizado.`)
            }

            const { lista } = args

            console.table(lista)

            try {
                // transaccion
                const _Trans = await prisma.$transaction(async (prisma) => {

                    for (const art of lista) {
                        // Crear el detalle
                        await prisma.articulo.update({
                            where: {
                                Codigo: art.codigo
                            },
                            data: {
                                PrecioVenta: art.precioVenta
                            }
                        })
                    }

                })

                console.log(_Trans)

                return true

            } catch (error) {
                throw new Error(`${error.message}`);
            }

        },
        UsuarioMedicamento: async (root, args, context) => {

            if (context.isAuthenticated === false) {
                throw new Error(`Error: No estas autorizado.`)
            }

            const { id } = args;

            try {

                const _usuario = await prisma.user.findUnique({where: {id}})

                const actualizar = await prisma.user.update({
                    where: { id },
                    data: {
                        medicamento: !_usuario.medicamento
                    }
                })

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
                throw new Error(`Error: No estas autorizado.`)
            }

            const { Codigo, Descripcion } = args

            console.log(Codigo)
            console.log(Descripcion)

            try {

                const _add = await prisma.marca.create({
                    data: {
                        Codigo,
                        Descripcion,
                        EstaEliminado: false
                    }
                })

                return _add

            } catch (error) {
                throw new Error(`${error.message}`);
            }
        },
        Update_Marca: async (root, args, context) => {

            if (context.isAuthenticated === false) {
                throw new Error(`Error: No estas autorizado.`)
            }

            const { Codigo, Descripcion } = args

            try {

                const _marca = await prisma.marca.findUnique({
                    where: { Codigo }
                })

                if (_marca == null) {
                    // no existe - la creo
                    const _add = await prisma.marca.create({
                        data: {
                            Codigo,
                            Descripcion,
                            EstaEliminado: false
                        }
                    })

                    return _add
                }


                if (Descripcion == _marca.Descripcion) return _marca

                const _update = await prisma.marca.update({
                    where: {
                        Id: _marca.Id
                    },
                    data: { Descripcion },
                })

                return _update

            } catch (error) {
                throw new Error(`${error.message}`);
            }

        },
        Delete_Marca: async (root, args, context) => {

            if (context.isAuthenticated === false) {
                throw new Error(`Error: No estas autorizado.`)
            }

            const { Codigo, EstaEliminado } = args

            try {

                const _update = await prisma.marca.update({
                    where: {
                        Codigo
                    },
                    data: { EstaEliminado },
                })

                return _update

            } catch (error) {
                throw new Error(`${error.message}`);
            }

        },
        // Rubro ✔
        ADD_Rubro: async (root, args, context) => {

            if (context.isAuthenticated === false) {
                throw new Error(`Error: No estas autorizado.`)
            }

            const { Codigo, Descripcion } = args

            try {

                const _add = await prisma.rubro.create({
                    data: {
                        Codigo,
                        Descripcion,
                        EstaEliminado: false
                    }
                })

                return _add

            } catch (error) {
                throw new Error(`${error.message}`);
            }

        },
        Update_Rubro: async (root, args, context) => {

            if (context.isAuthenticated === false) {
                throw new Error(`Error: No estas autorizado.`)
            }

            const { Codigo, Descripcion } = args

            try {

                const _rubro = await prisma.rubro.findUnique({
                    where: { Codigo }
                })

                if (!_rubro) {
                    // no existe - lo creo
                    const _add = await prisma.rubro.create({
                        data: {
                            Codigo,
                            Descripcion,
                            EstaEliminado: false
                        }
                    })

                    return _add
                }

                if (Descripcion == _rubro.Descripcion) return _rubro

                const _update = await prisma.rubro.update({
                    where: {
                        Id: _rubro.Id
                    },
                    data: { Descripcion },
                })

                return _update

            } catch (error) {
                throw new Error(`${error.message}`);
            }
        },
        Delete_Rubro: async (root, args, context) => {
            if (context.isAuthenticated === false) {
                throw new Error(`Error: No estas autorizado.`)
            }

            const { Codigo, EstaEliminado } = args

            try {

                const _update = await prisma.rubro.update({
                    where: {
                        Codigo
                    },
                    data: { EstaEliminado },
                })

                return _update

            } catch (error) {
                throw new Error(`${error.message}`);
            }

        },

    },
    BigInt: GraphQLBigInt,
    Pedido: {
        Fecha: (root) => formatDate(root.Fecha) // cuando sale para c#
    },
    // Articulo: {
    //     id: (root) => root.Id
    //     //Foto: (root) => Buffer.from(root.Foto).toString('base64')
    // }
    // Nota: {
    //     Compuesto: (root) => `${root.title}, ${root.description}`,
    //     CompuestoStatico: () => 'Dato Estatico no calculado'
    // }
}


function formatDate(date) {

    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2)
        month = '0' + month;
    if (day.length < 2)
        day = '0' + day;

    const options = { timeZone: 'America/Argentina/Buenos_Aires' }; // Establece la zona horaria de Argentina
    const hora = d.toLocaleTimeString('es-ES', options);
    const fecha = `${[year, month, day].join('-')} ${hora}`;


    return fecha;
}

import { PrismaClient } from '@prisma/client'
import GraphQLBigInt from 'graphql-bigint'

const prisma = new PrismaClient()

export const resolvers = {
    Query: {
        GetUser: async (root, args) => {

            const usuarios = await prisma.user.findFirst({
                where: {
                    name: {
                        contains: args.name
                    }
                },
                include: { accounts: true }
            })

            console.log(usuarios)

            return usuarios
        },
        GetUsers: async (root, args) => {

            let UsuariosVerificados;

            try {

                UsuariosVerificados = await prisma.user.findMany({
                    where: {
                        emailVerified: args.Isverificado === "Si" ? { not: null } : null
                    }
                })

                if (UsuariosVerificados.length === 0) {
                    throw new Error("No hay Usuarios Registrados")
                }

            } catch (error) {
                throw new Error(`${error.message}`);
            }

            return UsuariosVerificados
        },
        // Marca
        GET_Marca: async () => {
            const Marca = await prisma.marca.findMany({
                include: {
                    Articulo: true
                }
            })

            return Marca
        },
        GET_Marcaid: async (root, args) => {

            const Marca = await prisma.marca.findFirst({
                where: {
                    Id: args.id
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
        GET_Rubro: async () => {
            return await prisma.rubro.findMany({
                include: {
                    Articulo: true
                }
            })
        },
        GET_Rubroid: async (root, args) => {
            return await prisma.rubro.findFirst({
                where: {
                    Id: args.id
                },
                include: {
                    Articulo: true
                }
            })
        },
        // Articulo
        GET_Articulo: async () => {
            return await prisma.articulo.findMany({
                include: {
                    Marca: true,
                    Rubro: true
                }
            })
        },
        GET_Articuloid: async (root, args) => {
            return await prisma.articulo.findFirst({
                where: {
                    Id: args.id
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
        // Pedidos
        GET_Pedidos: async (root, args) => {

            const _get = await prisma.pedido.findMany({
                where: {Estado: false},
                include: {
                    User: true,
                    DetallePedido: true
                }
            })

            return _get
        },
        GET_Pedido_Usuario: async (root, args) => {

            const {email} = args

            try {

                // buscar el usuario
                const _usu = await prisma.user.findUnique({where: {email}})
                if (!_usu) {throw { message: `El usuario ${email} no esta registrado`}}
                
                const _get = await prisma.pedido.findMany({
                    where: {UserId: _usu.id},
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
        // usar en js
        ADD_Pedido: async (root, args) => {

            const { articulos, usuario } = args

            const tiempoTranscurrido = Date.now();
            const hoy = new Date(tiempoTranscurrido);
            console.log(hoy.toISOString());// ISO 8601 - formato para sql srver dateTime
            
            let _pedido
            try {

                // Buscar Otra vez el usu para asociar al pedido - tengo email i es unico
                const _Usu = await prisma.user.findUnique({ where: { email: usuario } })
                if (_Usu === null) throw new Error(`El usuario no Existe: ${usuario}`)

                // Creamos los detalles en memoria
                let _DetallePedidos = []
                let _Total = 0

                // Recorrer los pedidos art
                for (const art of articulos) {

                    // buscar en bd
                    const _ArticuloBD = await prisma.articulo.findUnique({ where: { Id: art.Id } })
                    if (_ArticuloBD === null) throw new Error(`Codigo de Articulo no Existe: ${art.Descripcion}`)

                    // comprobar si hay stock
                    if (!_ArticuloBD.PermiteStockNegativo) {
                        if (_ArticuloBD.Stock < art.Cantidad) {
                            console.log("No hay stock")
                            throw {
                                message: `Error no hay Stock Para el articulo: ${art.Descripcion}`,
                            };
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

                };

                // transaccion
                const _Trans = await prisma.$transaction(async (prisma) => {

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
                throw new Error(`${error.message}`);
            }

            const _nuevoPedido = await prisma.pedido.findUnique({
                where: { Id: _pedido.Id },
                include: {
                    User: true,
                    DetallePedido: true
                }
            })

            return _nuevoPedido
        },
        DELETE_Pedido: async (root, args) => {
            const borrar = await prisma.pedido.delete({ where: { Id: args.id } })
            return borrar
        },
        // usar en C#
        ADD_Articulo: async (root, args) => {

            const { articulo } = args

            try {
                // Marca
                const _marca = await prisma.marca.findFirst({
                    where: {
                        Descripcion: articulo.Marca,
                    },
                });
                if (!_marca) { throw { message: `Error, La Marca ${articulo.Marca} no existe`, } }

                // Rubro
                const _rubro = await prisma.rubro.findFirst({
                    where: {
                        Descripcion: articulo.Rubro,
                    },
                });
                if (!_rubro) { throw { message: `Error, El Rubro ${articulo.Rubro} no existe`, } }

                // creamos el articulo
                const { Marca, Rubro, ...datosSinMarcaRubro } = articulo;

                const NewArticulo = await prisma.articulo.create({
                    data: {
                        MarcaId: _marca.Id,
                        RubroId: _rubro.Id,
                        ...datosSinMarcaRubro
                    }
                })

                return NewArticulo

            } catch (error) {
                throw new Error(`${error.message}`);
            }

        },
        UPDATE_Articulo: async (root, args) => {

            const { articulo } = args

            // marca y rubro -> MarcaId y RubroId

            try {

                // Marca
                const _marca = await prisma.marca.findFirst({
                    where: {
                        Descripcion: articulo.Marca,
                    },
                });
                if (!_marca) { throw { message: `Error, La Marca ${articulo.Marca} no existe`, } }

                // Rubro
                const _rubro = await prisma.rubro.findFirst({
                    where: {
                        Descripcion: articulo.Rubro,
                    },
                });
                if (!_rubro) { throw { message: `Error, El Rubro ${articulo.Rubro} no existe`, } }

                const { Marca, Rubro, ...datosSinMarcaRubro } = articulo;

                const cod = await prisma.articulo.findUnique({where: {Codigo: articulo.Codigo}})
                if (!cod) throw new Error(`El Articulo Codigo: ${articulo.Codigo} No Existe`)


                const _update = await prisma.articulo.update({
                    where: {
                        Codigo: articulo.Codigo
                    },
                    data: {
                        MarcaId: _marca.Id,
                        RubroId: _rubro.Id,
                        ...datosSinMarcaRubro
                    }
                })

                return _update

            } catch (error) {
                throw new Error(`${error.message}`);
            }
        },
        ADD_Stock_Articulo: async (root, args) => {

            // desde c# mandar el total de stock
            const update = await prisma.articulo.update({
                where: {
                    Codigo: args.codigo
                },
                data: { Stock: args.cantidad },
            })

            return update
        },
        ADD_Marca: async (root, args) => {
            
            const {Descripcion} = args

            try {
                
                const _add = await prisma.marca.create({
                    data: {
                        Descripcion,
                        EstaEliminado: false
                    }
                })

                return _add

            } catch (error) {
                throw new Error(`${error.message}`);
            }
        },
        Update_Marca: async (root, args) => {

            const {Descripcion, EstaEliminado, NewDescripcion} = args

            try {

                const _marca = await prisma.marca.findFirst({
                    where: {Descripcion}
                })

                if (!_marca) {throw { message: `La marca ${Descripcion} no existe`}}

                const _update = await prisma.marca.update({
                    where: {
                        Id: _marca.Id
                    },
                    data: { Descripcion: NewDescripcion, EstaEliminado },
                })

                return _update

            } catch (error) {
                throw new Error(`${error.message}`);
            }

        },
        ADD_Rubro: async (root, args) => {

            const {Descripcion} = args

            try {
                
                const _add = await prisma.rubro.create({
                    data: {
                        Descripcion,
                        EstaEliminado: false
                    }
                })

                return _add
                
            } catch (error) {
                throw new Error(`${error.message}`);
            }

        },
        Update_Rubro: async (root, args) => {
            const {Descripcion, EstaEliminado, NewDescripcion} = args

            try {

                const _rubro = await prisma.rubro.findFirst({
                    where: {Descripcion}
                })

                if (!_rubro) {throw { message: `La rubro ${Descripcion} no existe`}}

                const _update = await prisma.rubro.update({
                    where: {
                        Id: _rubro.Id
                    },
                    data: { Descripcion: NewDescripcion, EstaEliminado },
                })

                return _update

            } catch (error) {
                throw new Error(`${error.message}`);
            }
        },
    },
    BigInt: GraphQLBigInt,
    // Articulo: {
    //     Foto: (root) => Buffer.from(root.Foto).toString('base64')
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

    return `${[year, month, day].join('-')} ${d.toLocaleTimeString()}`;
}
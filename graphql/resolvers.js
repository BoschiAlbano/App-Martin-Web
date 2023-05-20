import { PrismaClient } from '@prisma/client'
import GraphQLBigInt  from 'graphql-bigint'

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
                include: {accounts: true}
            })

            console.log(usuarios)

            return usuarios
        },
        GetUsers: async (root, args) => {

            let UsuariosVerificados;

            try {

                UsuariosVerificados = await prisma.user.findMany({
                    where: {
                        emailVerified: args.Isverificado === "Si" ? { not: null} : null
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
            const Marca =  await prisma.marca.findMany({
                include: {
                    Articulo: true
                }
            })

            return Marca
        },
        GET_Marcaid: async (root, args) => {
            
            const Marca =  await prisma.marca.findFirst({
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
                include:{
                    Rubro: true,
                    Marca: true
                }
            })
        },
        FILTRO_Articulo: async (root, args) => {
            const {keyword, rubro} = args
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
    },
    Mutation:{
        // Pedidos
        ADD_Pedido: async(root, args) => {
        
            const {articulos, usuario} = args

            const tiempoTranscurrido = Date.now();
            const hoy = new Date(tiempoTranscurrido);
            console.log(hoy.toISOString());// ISO 8601 - formato para sql srver dateTime

            let _pedido
            try {

                // Buscar Otra vez el usu para asociar al pedido - tengo email i es unico
                const _Usu = await prisma.user.findUnique({where: {email: usuario}})
                if(_Usu === null ) throw new Error(`El usuario no Existe: ${usuario}`)

                // Creamos los detalles en memoria
                let _DetallePedidos = []
                let _Total = 0

                // Recorrer los pedidos art
                for (const art of articulos){

                    // buscar en bd
                    const _ArticuloBD = await prisma.articulo.findUnique({where: {Id: art.Id}})
                    if(_ArticuloBD === null ) throw new Error(`Codigo de Articulo no Existe: ${art.Descripcion}`)

                    // comprobar si hay stock
                    if (!_ArticuloBD.PermiteStockNegativo) {
                        if(_ArticuloBD.Stock < art.Cantidad ){
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
                        Dto: 0,
                        SubTotal: art.Cantidad * _ArticuloBD.PrecioVenta,
                        PrecioCosto: _ArticuloBD.PrecioCosto,
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
                            SubTotal: 0,
                            Descuento: 0,
                            Total: _Total,
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
                where: {Id: _pedido.Id},
                include: {
                    User: true, 
                    DetallePedido: true
                }
            })

            return _nuevoPedido
        },
        DELETE_Pedido: async(root, args) => {
            const borrar = await Pedidos_Model.findByIdAndDelete(args.id)
            return borrar
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
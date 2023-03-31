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
            const {keyword, marca, rubro} = args

            console.log("datos")
            console.log(marca)

            //Problemas con bigInt 

            // const datos = await prisma.articulo.findMany({
            //     where: {
            //         Descripcion: {
            //             contains: keyword
            //         },
            //         MarcaId: marca  ? {not: null} : marca,
            //         // RubroId: rubro ? rubro : {not: null}
            //     },
            //     include: {
            //         Marca: true,
            //         Rubro: true
            //     }
            // })

            // let datos = await Articulo_Model.find(keyword ? {descripcion: new RegExp(keyword,'i')} : null).populate('Marca').populate('Rubro')

            // if(marca) datos = await datos.filter(((item) => {
            //     return item.Marca._id.toString() === marca
            // }))

            // if(rubro) datos = await datos.filter(((item) => {
            //     return item.Rubro._id.toString() === rubro
            // }))

            return null
        },
        // Pedidos
        GET_Pedidos: async () => {
            return 'Los pedidos deben inpactar en comprobante y detalle de comprobante'
        },
        GET_Pedidoid: async (root, args) => {
            return 'Los pedidos deben inpactar en comprobante y detalle de comprobante'
        }
    },
    Mutation:{
        //Marca
        ADD_Marca: async(root, args) => {
            const {descripcion} = args
            const nueva = new Marca_Model({descripcion})
            return await nueva.save()
        },
        UPDATE_Marca: async(root, args) => {
            const update = await Marca_Model.findByIdAndUpdate(args.id, args, {new: true})
            return update
        },
        DELETE_Marca: async(root, args) => {
            const borrar = await Marca_Model.findByIdAndDelete(args.id)
            return borrar
        },
        //Rubro
        ADD_Rubro: async(root, args) => {
            const {descripcion} = args
            const nueva = new Rubro_Model({descripcion})
            return await nueva.save()
        },
        UPDATE_Rubro: async(root, args) => {
            const update = await Rubro_Model.findByIdAndUpdate(args.id, args, {new: true})
            return update
        },
        DELETE_Rubro: async(root, args) => {
            const borrar = await Rubro_Model.findByIdAndDelete(args.id)
            return borrar
        },
        //Articulo
        ADD_Articulo: async(root, args) => {
            // Fecha
            if(args.fecha != undefined) {
                const fecha = new Date(args.fecha)
                args.fecha = fecha
                console.log(fecha)
            }

            // Comprobar Marca y Rubro
            const marca = await Marca_Model.findById(args.Marca)
            if(marca === null) return null
            const rubro = await Rubro_Model.findById(args.Rubro)
            if(rubro === null) return null

            // Crear Art}
            const nuevoArt = new Articulo_Model(args)
            await nuevoArt.save()

            // Guardar id articulo en marca y rubro
            marca.articulo = marca.articulo.concat(nuevoArt._id)
            await marca.save()
            rubro.articulo = rubro.articulo.concat(nuevoArt._id)
            await rubro.save()

            // retornamos el nuevo Art
            nuevoArt.Marca = marca
            nuevoArt.Rubro = rubro

            console.log('Retorno...')
            console.log(nuevoArt)

            return nuevoArt
        },
        UPDATE_Articulo: async(root, args) => {
            const update = await Articulo_Model.findByIdAndUpdate(args.id, args, {new: true}).populate('Rubro').populate('Marca')
            return update
        },
        DELETE_Articulo: async(root, args) => {
            const borrar = await Articulo_Model.findByIdAndDelete(args.id).populate('Rubro').populate('Marca')
            return borrar
        },
        // Pedidos
        ADD_Pedido: async(root, args) => {
        
            const UltimoCodigo = await Pedidos_Model.findOne().sort({codigo: -1}).limit(1)

            const codigo = UltimoCodigo.codigo + 1
            // buscamos el usuario exista con email y obtenemos el id
            const usuario = await Usuario_Model.findOne({email: args.usuario})

            if(usuario === null ) return null
            
            // Creamos el pedido
            const nueva = new Pedidos_Model({codigo, Articulos: args.articulosId, user: usuario._id})
            const pedido = await nueva.save()

            // actualizamos - concatenamos el id del pedido en usuario
            usuario.Pedidos = usuario.Pedidos.concat(pedido._id)
            await usuario.save()

            const ObneterUltimo = await Pedidos_Model.findById(pedido._id).populate('Articulos').populate('user')

            return ObneterUltimo
        },
        DELETE_Pedido: async(root, args) => {
            const borrar = await Pedidos_Model.findByIdAndDelete(args.id)
            return borrar
        },
    },
    BigInt: GraphQLBigInt,
    Articulo: {
        Foto: (root) => Buffer.from(root.Foto).toString('base64')
    }
    // Nota: {
    //     Compuesto: (root) => `${root.title}, ${root.description}`,
    //     CompuestoStatico: () => 'Dato Estatico no calculado'
    // }
}
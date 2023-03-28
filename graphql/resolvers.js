import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export const resolvers = {
    Query: {
        GetUser: async (root, args) => {

            const usuarios = await prisma.user.findFirst({
                where: {
                    name: {
                      contains: args.name
                    }
                }
            })

            console.log(usuarios)

            return usuarios
        },
        GetUsers: async (root, args) => {

            if(!args.Isverificado) return await Usuario_Model.find().populate('notas').populate('Pedidos')

            // return Usuario_Model.find({emailVerified: { $exists: args.Isverificado === 'Si'}}).populate('notas')

            if(args.Isverificado === 'Si'){
                const users = await Usuario_Model.find().populate('notas').populate('Pedidos')
                // FILTRAR -> nose como hacer una consulta distinda te null
                const byEmail = u => u.emailVerified != null
                return users.filter(byEmail)

            }else{
                return await Usuario_Model.find({emailVerified: null}).populate('notas').populate('Pedidos')
            }
        },
        // Marca
        GET_Marca: async () => {
            return Marca_Model.find().populate('articulo')
        },
        GET_Marcaid: async (root, args) => {
            return Marca_Model.findById(args.id).populate('articulo')
        },
        // Rubro
        GET_Rubro: async () => {
            return Rubro_Model.find().populate('articulo')
        },
        GET_Rubroid: async (root, args) => {
            return Rubro_Model.findById(args.id).populate('articulo')
        },
        // Articulo
        GET_Articulo: async () => {
            return await Articulo_Model.find().populate('Rubro').populate('Marca')
        },
        GET_Articuloid: async (root, args) => {
            return await Articulo_Model.findById(args.id).populate('Rubro').populate('Marca')
        },
        // Pedidos
        GET_Pedidos: async () => {
            return await Pedidos_Model.find().populate('user').populate('Articulos')
        },
        GET_Pedidoid: async (root, args) => {
            return await Pedidos_Model.findById(args.id).populate('user').populate('Articulos')
        },
        FILTRO_Articulo: async (root, args) => {
            const {keyword, marca, rubro} = args
            
            let datos = await Articulo_Model.find(keyword ? {descripcion: new RegExp(keyword,'i')} : null).populate('Marca').populate('Rubro')

            if(marca) datos = await datos.filter(((item) => {
                return item.Marca._id.toString() === marca
            }))

            if(rubro) datos = await datos.filter(((item) => {
                return item.Rubro._id.toString() === rubro
            }))

            return datos
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
    // Nota: {
    //     Compuesto: (root) => `${root.title}, ${root.description}`,
    //     CompuestoStatico: () => 'Dato Estatico no calculado'
    // }
}
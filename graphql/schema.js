import { gql } from "apollo-server-micro";

export const typeDefs = gql`
    scalar BigInt

    # enum Verificado {
    #     Si
    #     No
    # }

    # type User {
    #     id: String!
    #     name: String!
    #     apellido: String
    #     DNI: String
    #     telefono: String
    #     direccion: String
    #     medicamento: Boolean
    #     email: String
    #     Pedido: [Pedido]
    # }

    type Marca {
        Id: BigInt!
        Codigo: Int!
        Descripcion: String!
        EstaEliminado: Boolean
        Articulo: [Articulo]
    }

    type Rubro {
        Id: BigInt!
        Codigo: Int!
        Descripcion: String!
        EstaEliminado: Boolean
        Articulo: [Articulo]
    }

    type Articulo {
        Id: BigInt!
        MarcaId: BigInt!
        RubroId: BigInt!
        Codigo: Int!
        Descripcion: String
        Stock: Int
        EstaEliminado: Boolean
        URL: String
        PrecioVenta: Float
        Oferta: Boolean
        Descuento: Float
        PermiteStockNegativo: Boolean
        Rubro: Rubro
        Marca: Marca
    }

    # type Pedido {
    #     Id: BigInt!
    #     Fecha: String
    #     SubTotal: Float
    #     Descuento: Float
    #     Total: Float
    #     User: User
    #     Estado: Boolean
    #     DetallePedido: [DetallePedido]
    # }

    # type DetallePedido {
    #     Id: BigInt
    #     Codigo: String
    #     Descripcion: String
    #     Cantidad: Int
    #     Precio: Float
    #     SubTotal: Float
    #     EstaEliminado: Boolean
    #     Articulo: Articulo
    #     Pedido: Pedido
    # }

    type Cliente {
        Id: BigInt
        Apellido: String
        Nombre: String
        Dni: String
        Direccion: String
        Telefono: String
        Mail: String
        EstaEliminado: Boolean
        Medicamento: Boolean
    }

    type Query {
        # Usuario
        # GetUser(email: String!): User
        # GetUsers: [User]
        # Marca
        # GET_Marca: [Marca]
        # GET_Marcaid(id: BigInt!): Marca
        # Rubro
        GET_Rubro(Medicamento: Boolean!): [Rubro]
        # GET_Rubroid(id: BigInt!): Rubro
        # Articulo
        GET_Articulo: [Articulo]
        # GET_Articuloid(id: BigInt!): Articulo
        FILTRO_Articulo(
            rubro: BigInt
            keyword: String
            medicamento: Boolean!
        ): [Articulo]
        GET_Articulos_Oferta(medicamento: Boolean!): [Articulo]
        # Pedidos
        # GET_Pedidos: [Pedido]
        # GET_Pedido_Usuario(email: String!): [Pedido]
        # Clientes
        GET_Clientes(cadena: String, personaId: BigInt): [Cliente]
    }

    input ArticuloPedido {
        Id: BigInt!
        Cantidad: Int!
        Descripcion: String
    }

    # Problema de Mayusculas ⛔ en c# la libreria manda todo como minusculas las propiedades ya esta resuelto ✔
    # input ArticuloInput {
    #     marca: String!
    #     rubro: String!
    #     codigo: Int!
    #     descripcion: String!
    #     stock: Int!
    #     estaEliminado: Boolean
    #     URL: String
    #     precioVenta: Float!
    #     permiteStockNegativo: Boolean
    #     oferta: Boolean
    #     descuento: Float
    # }

    # input Stock_Articulos {
    #     codigo: Int!
    #     stock: Int!
    # }

    # input PrecioVenta_Articulos {
    #     codigo: Int!
    #     precioVenta: Float!
    # }

    type Mutation {
        # Pedidos de cleintes
        ADD_Pedido(usuario: String!, articulos: [ArticuloPedido!]!): [Articulo]
        # Pedido de Preventistas
        ADD_Pedido_Preventista(
            personaId: BigInt!
            articulos: [ArticuloPedido!]!
            clienteId: BigInt!
        ): [Articulo]
        # New Cliente de preventista
        ADD_Cliente(
            Apellido: String!
            Nombre: String!
            Dni: String!
            Direccion: String!
            Telefono: String!
            Mail: String
            empleadoId: BigInt!
        ): [Cliente]
        # Articulo
        # ADD_Articulo(articulo: ArticuloInput): Articulo
        # Update_Articulo(articulo: ArticuloInput!): Articulo
        # Delete_Articulo(codigo: Int!, EstaEliminado: Boolean!): Articulo
        # ADD_Stock_Articulo(codigo: Int!, cantidad: Int!): Articulo
        # Update_Stock_Articulos(lista: [Stock_Articulos!]!): Boolean
        # Update_PrecioVenta_Articulos(lista: [PrecioVenta_Articulos!]!): Boolean
        # Marca
        # ADD_Marca(Codigo: Int!, Descripcion: String!): Marca
        # Update_Marca(Codigo: Int!, Descripcion: String!): Marca
        # Delete_Marca(Codigo: Int!, EstaEliminado: Boolean!): Marca
        # Rubro
        # ADD_Rubro(Codigo: Int!, Descripcion: String!): Rubro
        # Update_Rubro(Codigo: Int!, Descripcion: String!): Rubro
        # Delete_Rubro(Codigo: Int!, EstaEliminado: Boolean!): Rubro

        # Usuario
        # UsuarioMedicamento(id: String!): Boolean
        # Delete_User(id: String!): Boolean
    }
`;

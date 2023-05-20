import { gql } from "apollo-server-micro"

export const typeDefs = gql`
 
  scalar BigInt
 
  enum Verificado{
    Si
    No
  }

  type User {
    id: String!,
    name: String!,
    Pedido: [Pedido]
  }

  type Marca {
    Id: BigInt!,
    Descripcion: String!,
    EstaEliminado: Boolean,
    Articulo: [Articulo]
  }

  type Rubro {
    Id: BigInt!,
    Descripcion: String!,
    EstaEliminado: Boolean
    Articulo: [Articulo]
  }

  type Articulo {
    Id: BigInt!,
    Codigo: Int!,
    CodigoBarra: String,
    Descripcion: String,
    Stock: Int,
    Detalle: String,
    EstaEliminado: Boolean,
    FotoUrl: String,
    PrecioVenta: Float,
    PermiteStockNegativo: Boolean,
    Rubro: Rubro,
    Marca: Marca,
  }

  type Pedido {
    Id: BigInt!,
    Fecha: String,
    SubTotal: Float,
    Descuento: Float,
    Total: Float,
    User: User,
    DetallePedido: [DetallePedido]
  }

  type DetallePedido {
    Id: BigInt,
    Codigo: String,
    Descripcion: String,
    Cantidad: Int,
    Precio: Float,
    SubTotal: Float,
    EstaEliminado: Boolean,
    PrecioCosto: Float,
    Dto: Float
    Articulo: Articulo,
    Pedido: Pedido,
  }

  type Query {
    # Usuario
    GetUser(name: String!): User,
    GetUsers(Isverificado: Verificado): [User],
    # Marca 
    GET_Marca: [Marca],
    GET_Marcaid(id: BigInt!): Marca,
    # Rubro 
    GET_Rubro: [Rubro],
    GET_Rubroid(id: BigInt!): Rubro ,
    # Rubro 
    GET_Articulo: [Articulo],
    GET_Articuloid(id: BigInt!): Articulo,
    FILTRO_Articulo(rubro: BigInt, keyword: String): [Articulo]
    # Pedidos 
    GET_Pedidos: [Pedido],
    GET_Pedidoid(id: BigInt!): Pedido
  }

  input ArticuloInput{
    Id: BigInt!,
    Cantidad: Int!,
    Descripcion: String
  }


  type Mutation {
    # Pedidos 
    ADD_Pedido(usuario: String!, articulos: [ArticuloInput!]!): Pedido,
    DELETE_Pedido(Id: String!): Pedido,
  }

`;
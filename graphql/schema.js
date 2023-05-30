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
    apellido: String,
    DNI: String,
    telefono: String,
    direccion: String,
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
    MarcaId: BigInt!,
    RubroId: BigInt!,
    Codigo: Int!,
    Descripcion: String,
    Stock: Int,
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
    Estado: Boolean,
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
    # Articulo 
    GET_Articulo: [Articulo],
    GET_Articuloid(id: BigInt!): Articulo,
    FILTRO_Articulo(rubro: BigInt, keyword: String): [Articulo]
    # Pedidos 
    GET_Pedidos: [Pedido],
    GET_Pedido_Usuario(email: String!, ): [Pedido]
  }

  input ArticuloPedido{
    Id: BigInt!,
    Cantidad: Int!,
    Descripcion: String
  }

  input ArticuloInput {
    Marca: String!,
    Rubro: String!,
    Codigo: Int!,
    Descripcion: String!,
    Stock: Int!,
    EstaEliminado: Boolean,
    FotoUrl: String,
    PrecioVenta: Float!,
    PermiteStockNegativo: Boolean,
  }

  type Mutation {
    # Pedidos 
    ADD_Pedido(usuario: String!, articulos: [ArticuloPedido!]!): Pedido,
    DELETE_Pedido(Id: String!): Pedido,
    # Articulo
    ADD_Articulo(articulo: ArticuloInput!): Articulo,
    UPDATE_Articulo(articulo: ArticuloInput!): Articulo,
    ADD_Stock_Articulo(codigo: Int!, cantidad: Int!): Articulo,
    # Marca
    ADD_Marca(Descripcion: String!): Marca,
    Update_Marca(Descripcion: String!, EstaEliminado: Boolean!, NewDescripcion: String!): Marca,
    # Rubro
    ADD_Rubro(Descripcion: String!): Rubro,
    Update_Rubro(Descripcion: String!, EstaEliminado: Boolean!, NewDescripcion: String!): Rubro,
  }

`;
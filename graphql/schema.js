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
    Codigo: Int!,
    Descripcion: String!,
    EstaEliminado: Boolean,
    Articulo: [Articulo]
  }

  type Rubro {
    Id: BigInt!,
    Codigo: Int!,
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
    Oferta: Boolean,
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

  # Problema de Mayusculas ⛔ en c# la libreria manda todo como minusculas las propiedades ya esta resuelto ✔
  input ArticuloInput {
    marca: String!,
    rubro: String!,
    codigo: Int!,
    descripcion: String!,
    stock: Int!,
    estaEliminado: Boolean,
    fotoUrl: String,
    precioVenta: Float!,
    permiteStockNegativo: Boolean,
    oferta: Boolean,
  }


  input Stock_Articulos {
    codigo: Int!,
    stock: Int!,
  }

  input PrecioVenta_Articulos {
    codigo: Int!,
    precioVenta: Float!,
  }

  type Mutation {
    # Pedidos 
    ADD_Pedido(usuario: String!, articulos: [ArticuloPedido!]!): [Articulo],
    Delete_Pedido(Id: Int!): Pedido,
    Cancelar_Pedido(Id: Int!): Boolean,
    # Articulo
    ADD_Articulo(articulo: ArticuloInput): Articulo,
    Update_Articulo(articulo: ArticuloInput!): Articulo,
    Delete_Articulo(codigo: Int!, EstaEliminado: Boolean!): Articulo,
    ADD_Stock_Articulo(codigo: Int!, cantidad: Int!): Articulo,
    Update_Stock_Articulos(lista: [Stock_Articulos!]!): Boolean,
    Update_PrecioVenta_Articulos(lista: [PrecioVenta_Articulos!]!): Boolean,
    
    # Marca
    ADD_Marca(Codigo: Int!, Descripcion: String!): Marca,
    Update_Marca(Codigo: Int!, Descripcion: String!): Marca,
    Delete_Marca(Codigo: Int!, EstaEliminado: Boolean!): Marca,
    # Rubro
    ADD_Rubro(Codigo: Int!, Descripcion: String!): Rubro,
    Update_Rubro(Codigo: Int!, Descripcion: String!): Rubro,
    Delete_Rubro(Codigo: Int!, EstaEliminado: Boolean!): Rubro,
  }

`;
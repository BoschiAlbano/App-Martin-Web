import { gql } from "apollo-server-micro"

import { GraphQLScalarType } from 'graphql';
import { Kind } from 'graphql/language';

const BigInt = new GraphQLScalarType({
  name: 'BigInt',
  description:
    'The `BigInt` scalar type represents non-fractional signed whole numeric ' +
    'values. BigInt can represent values between -(2^63) and 2^63 - 1',
  serialize: value => value.toString(),
  parseValue: value => BigInt(value),
  parseLiteral: ast => ast.kind === Kind.INT ? BigInt(ast.value) : null
});

export const typeDefs = gql`
 
  scalar BigInt
 
  enum Verificado{
    Si
    No
  }

  type User {
    id: String!,
    name: String!,
    pedidos: [Pedidos]
  }

  type Marca {
    Id: BigInt!,
    Descripcion: String!,
    EstaEliminado: Boolean,
    articulo: [Articulo]
  }

  type Rubro {
    Id: String!,
    Descripcion: String!,
    EstaEliminado: Boolean
    articulo: [Articulo]
  }

  type Articulo {
    id: String!,
    codigo: Int!,
    descripcion: String,
    eliminado: Boolean,
    fecha: String,
    imagen: String,
    precio: Int,
    Rubro: Rubro,
    Marca: Marca
  }

  type Pedidos {
    id: String!,
    codigo: Int!,
    fecha: String,
    eliminado: Boolean,
    Articulos: [Articulo],
    user: User
  }

  type Query {
    # Usuario
    GetUser(name: String!): User,
    GetUsers(Isverificado: Verificado): [User],
    # Marca 
    GET_Marca: [Marca],
    GET_Marcaid(id: String!): Marca,
    # Rubro 
    GET_Rubro: [Rubro],
    GET_Rubroid(id: String!): Rubro ,
    # Rubro 
    GET_Articulo: [Articulo],
    GET_Articuloid(id: String!): Articulo,
    FILTRO_Articulo(marca: String, rubro: String, keyword: String): [Articulo]
    # Pedidos 
    GET_Pedidos: [Pedidos],
    GET_Pedidoid(id: String!): Pedidos 
  }

  type Mutation {
    # Marca 
    ADD_Marca(descripcion: String!): Marca,
    UPDATE_Marca(id: String!, descripcion: String, eliminado: Boolean): Marca,
    DELETE_Marca(id: String!): Marca,
    # Rubro 
    ADD_Rubro(descripcion: String!): Rubro,
    UPDATE_Rubro(id: String!, descripcion: String, eliminado: Boolean): Rubro,
    DELETE_Rubro(id: String!): Rubro,
    # Articulo 
    ADD_Articulo( codigo: Int!, descripcion: String!, eliminado: Boolean, fecha: String, imagen: String, precio: Int, Rubro: String!, Marca: String!): Articulo,
    UPDATE_Articulo(id: String!, codigo: Int, descripcion: String, eliminado: Boolean, fecha: String, imagen: String, precio: Int, Rubro: String, Marca: String): Articulo,
    DELETE_Articulo(id: String!): Articulo,
    # Pedidos 
    ADD_Pedido(eliminado: Boolean, articulosId: [String], usuario: String!): Pedidos,
    DELETE_Pedido(id: String!): Pedidos,

  }

`;
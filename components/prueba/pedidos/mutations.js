import { gql } from '@apollo/client'


export const NUEVA_PEDIDO = gql`
mutation Mutation($articulos: [ArticuloInput!]!, $usuario: String!) {
  ADD_Pedido(articulos: $articulos, usuario: $usuario) {
    Id
    Fecha
    SubTotal
    Descuento
    Total
    User {
      id
      name
    }
    DetallePedido {
      Id
      Codigo
      Descripcion
      Cantidad
      Precio
      SubTotal
      EstaEliminado
      PrecioCosto
      Dto
    }
  }
}
`

export const DELETE_PEDIDO = gql`
    mutation Mutation($deletePedidoId: String!) {
        DELETE_Pedido(id: $deletePedidoId) {
            id
            codigo
            fecha
        }
    }
`


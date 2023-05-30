import { gql } from '@apollo/client'


export const NUEVA_PEDIDO = gql`
mutation Mutation($usuario: String!, $articulos: [ArticuloPedido!]!) {
  ADD_Pedido(usuario: $usuario, articulos: $articulos) {
    Id
    Fecha
    SubTotal
    Descuento
    Total
    User {
      id
      name
      apellido
      DNI
      telefono
      direccion
    }
    DetallePedido {
      Id
      Codigo
      Descripcion
      Cantidad
      Precio
      SubTotal
      EstaEliminado
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


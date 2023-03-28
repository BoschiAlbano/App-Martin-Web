import { gql } from '@apollo/client'


export const NUEVA_PEDIDO = gql`
    mutation Mutation($usuario: String!, $eliminado: Boolean, $articulosId: [String]) {
        ADD_Pedido(usuario: $usuario, eliminado: $eliminado, articulosId: $articulosId) {
        id
        codigo
        fecha
        eliminado
        Articulos {
            id
            codigo
            descripcion
        }
        user {
            id
            name
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


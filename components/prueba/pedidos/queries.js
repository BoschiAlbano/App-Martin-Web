import { gql } from '@apollo/client'

// Query Sin parametros
export const Get_Pedidos = gql`
query Query {
  GET_Pedidos {
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

// Query con parametros
export const Get_Pedido_By_Id = gql`
query BuscarPorTitulo_Pedido ($getPedidoidId: String!) {
  GetById_Pedido(id: $getPedidoidId) {
    id
    codigo
    fecha
    eliminado
    articulos{
      id
      codigo
      descripcion
      precio
    }
    user{
      id
      name
    }
  }
}
`
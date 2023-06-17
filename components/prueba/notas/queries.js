import { gql } from '@apollo/client'

// Query Sin parametros
export const Get_Notas = gql`
query {
  GET_Articulo {
            Id
            Codigo
            Descripcion
            EstaEliminado
            FotoUrl
            PrecioVenta
            Rubro {
                Id
                Descripcion
            }
            Marca {
                Id
                Descripcion
            }
  }
}
`
// Query con parametros
export const Get_Notas_By_Title = gql`
  query Query($getArticuloidId: BigInt!) {
    GET_Articuloid(id: $getArticuloidId) {
      Id
      Codigo
      Stock
      Descripcion
    }
  }
`
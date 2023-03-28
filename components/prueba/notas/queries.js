import { gql } from '@apollo/client'

// Query Sin parametros
export const Get_Notas = gql`
query {
  Get_Notas {
    id
    title
    description
  }
}
`
// Query con parametros
export const Get_Notas_By_Title = gql`
query BuscarPorTitulo_Nota ($title: String!) {
  GetByTitle_Notas(title: $title) {
    id
    title
    description
    url
    category
    imageUrl
    Compuesto
    CompuestoStatico
    user {
      name
    }
  }
}
`
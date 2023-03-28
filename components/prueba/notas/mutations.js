import { gql } from '@apollo/client'

export const NUEVA_NOTA = gql`
    mutation nueva_nota($title: String!, $description: String!, $url: String!, $user: String!) {
  addNota(title: $title, description: $description, url: $url, user: $user) {
    id
    title
    description
  }
}
`

export const UPDATE_NOTA = gql`
  mutation update_Nota($id: String!, $title: String, $description: String) {
  updateNota(id: $id, title: $title, description: $description) {
    id
    title
    description
  }
}
`
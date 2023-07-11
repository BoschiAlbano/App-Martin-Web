import { gql } from '@apollo/client'

export const GET_Usuario =gql`
    query GetUser($email: String!) {
  GetUser(email: $email) {
    id
    name
    apellido
    DNI
    telefono
    direccion
  }
}
`
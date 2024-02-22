import { gql } from "@apollo/client";

export const NUEVA_CLIENTE = gql`
    mutation ADD_Cliente(
        $apellido: String!
        $nombre: String!
        $dni: String!
        $direccion: String!
        $telefono: String!
        $mail: String
        $empleadoId: BigInt!
    ) {
        ADD_Cliente(
            Apellido: $apellido
            Nombre: $nombre
            Dni: $dni
            Direccion: $direccion
            Telefono: $telefono
            Mail: $mail
            empleadoId: $empleadoId
        ) {
            Id
            Apellido
            Direccion
            Dni
            Nombre
        }
    }
`;

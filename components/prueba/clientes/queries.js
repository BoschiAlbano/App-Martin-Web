import { gql } from "@apollo/client";

export const GET_Clientes = gql`
    query Query($cadena: String, $personaId: BigInt) {
        GET_Clientes(cadena: $cadena, personaId: $personaId) {
            Id
            Apellido
            Direccion
            Dni
            Nombre
        }
    }
`;

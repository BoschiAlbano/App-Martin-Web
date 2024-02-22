import { gql } from "@apollo/client";

export const NUEVA_PEDIDO = gql`
    mutation ADD_Pedido($usuario: String!, $articulos: [ArticuloPedido!]!) {
        ADD_Pedido(usuario: $usuario, articulos: $articulos) {
            Id
            Stock
        }
    }
`;
export const NUEVA_PEDIDO_PREVENTISTA = gql`
    mutation Mutation(
        $personaId: BigInt!
        $articulos: [ArticuloPedido!]!
        $clienteId: BigInt!
    ) {
        ADD_Pedido_Preventista(
            personaId: $personaId
            articulos: $articulos
            clienteId: $clienteId
        ) {
            Id
            Stock
        }
    }
`;

export const DELETE_PEDIDO = gql`
    mutation Mutation($deletePedidoId: String!) {
        DELETE_Pedido(id: $deletePedidoId) {
            id
            codigo
            fecha
        }
    }
`;

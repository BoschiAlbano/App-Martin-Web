import { useMutation } from "@apollo/client";
import {
    NUEVA_PEDIDO,
    NUEVA_PEDIDO_PREVENTISTA,
} from "components/prueba/pedidos/mutations";
import { GET_ARTICULOS_Filtro_Todo } from "components/prueba/articulos/queries";

// Mutation
export const useAddPedidos = (showError) => {
    const result = useMutation(NUEVA_PEDIDO, {
        refetchQueries: [{ query: GET_ARTICULOS_Filtro_Todo }],
        onCompleted: (completed) => {
            showError(null);
        },
        onError: (error) => {
            showError(error.graphQLErrors[0].message);
        },
        context: {
            headers: { Authorization: "AppMartin" },
        },
    });

    return result;
};

export const useAddPedidosPreventista = (showError) => {
    const result = useMutation(NUEVA_PEDIDO_PREVENTISTA, {
        refetchQueries: [{ query: GET_ARTICULOS_Filtro_Todo }],
        onCompleted: (completed) => {
            showError(null);
        },
        onError: (error) => {
            showError(error.graphQLErrors[0].message);
        },
        context: {
            headers: { Authorization: "AppMartin" },
        },
    });

    return result;
};

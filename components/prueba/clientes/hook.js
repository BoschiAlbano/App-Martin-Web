import { useQuery, useLazyQuery, useMutation } from "@apollo/client";
// Queries
import { GET_Clientes } from "components/prueba/clientes/queries";
// Mutations
import { NUEVA_CLIENTE } from "./mutations";

// Query sin parametro pero lazy
export const useCliente = () => {
    const result = useLazyQuery(GET_Clientes);
    return result;
};

// Mutation
export const useAddCliente = (showError, empleadoId) => {
    const result = useMutation(NUEVA_CLIENTE, {
        refetchQueries: [
            {
                query: GET_Clientes,
                variables: { cadena: "", personaId: empleadoId },
            },
        ],
        onCompleted: (completed) => {
            showError(null, "cliente Agregado");
        },
        onError: (error) => {
            console.log(error);
            showError(error.graphQLErrors[0].message);
        },
        context: {
            headers: { Authorization: "AppMartin" },
        },
    });

    return result;
};

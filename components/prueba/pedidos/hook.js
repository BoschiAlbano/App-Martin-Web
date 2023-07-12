import { useQuery, useLazyQuery, useMutation } from "@apollo/client";
import {Get_Pedido_By_Id, Get_Pedidos} from 'components/prueba/pedidos/queries'
import {NUEVA_PEDIDO, DELETE_PEDIDO} from 'components/prueba/pedidos/mutations'
import { useState } from "react";

import {GET_ARTICULOS_Filtro_Todo} from 'components/prueba/articulos/queries'

export const usePedidos = () => {
    const result = useQuery(Get_Pedidos)
    return result
}

export const usePedidosById = () => {
    const result = useLazyQuery(Get_Pedido_By_Id)
    return result
}

// Mutation
export const useAddPedidos = (showError) => {

    const result = useMutation(NUEVA_PEDIDO, {
        refetchQueries: [ { query: GET_ARTICULOS_Filtro_Todo } ],
        onCompleted: (completed) => {
            console.log(completed)
            showError(null)
        },
        onError: (error) => {
            // showError("Error, en el servidor.")
            showError(error.graphQLErrors[0].message)
            // console.log(error)
        }
    })

    return result
}

// export const useAddPedidos = (showError) => {
//     const [cargando, setLoading] = useState(true); // Agregar estado loading
  
//     setLoading(true);

//     const result = useMutation(NUEVA_PEDIDO, {
//       refetchQueries: [{ query: GET_ARTICULOS_Filtro_Todo }],
//       onCompleted: (completed) => {
//         // console.log(completed);
//         setLoading(false); // Establecer loading en false al completar
//         showError(null);
//       },
//       onError: (error) => {
//         setLoading(false); // Establecer loading en false en caso de error
//         showError(error.graphQLErrors[0].message);
//         // console.table(error);
//       }
//     });
  
//     return {cargando, crear: result[0]}; // Retornar loading junto con el resultado del hook
// };
  

export const useDeletePedido = (showError) => {
    const result = useMutation(DELETE_PEDIDO, {
        onError: (error) => {
            console.log(error.graphQLErrors[0].message)
            showError(error.graphQLErrors[0].message)
        }
    })

    return result
}

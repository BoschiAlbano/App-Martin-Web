import { useQuery, useLazyQuery, useMutation } from "@apollo/client";
import {Get_Pedido_By_Id, Get_Pedidos} from 'components/prueba/pedidos/queries'
import {NUEVA_PEDIDO, DELETE_PEDIDO} from 'components/prueba/pedidos/mutations'
import { useState } from "react";

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
        refetchQueries: [ { query: Get_Pedidos } ],
        onCompleted: (completed) => {
            console.log(completed)
            showError(null)
        },
        onError: (error) => {
            showError(error.graphQLErrors[0].message)
        }
    })

    return result
}


export const useDeletePedido = (showError) => {
    const result = useMutation(DELETE_PEDIDO, {
        onError: (error) => {
            console.log(error.graphQLErrors[0].message)
            showError(error.graphQLErrors[0].message)
        }
    })

    return result
}

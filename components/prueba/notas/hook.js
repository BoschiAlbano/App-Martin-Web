import { useQuery, useLazyQuery, useMutation } from '@apollo/client'
// Queries
import { Get_Notas, Get_Notas_By_Title } from 'components/prueba/notas/queries'
// mutations
import { NUEVA_NOTA, UPDATE_NOTA } from './mutations'
// Query Sin parametros
export const useNotas = () => {
    const result = useQuery(Get_Notas) //  { pollInterval: 2000 } NO ANDA
    return result // devuelve un objeto
}

// Query con parametros
export const useNotaByTitle = () => {
  const result = useLazyQuery(Get_Notas_By_Title)
  return result // devuelve un array con dos posiciones
}

// Mutation
export const useAddTarea = (showError) => {
    const result = useMutation(NUEVA_NOTA, {
        refetchQueries: [ { query: Get_Notas } ],
        onError: (error) => {
            showError(error.graphQLErrors[0].message)
        }
    })

    return result // devuelve un array con una posicion deonde se le pasa las variables
}

export const useUpdateNota = (showError) => {
    const result = useMutation(UPDATE_NOTA, {
        // refetchQueries: [ { query: Get_Notas } ],
        onError: (error) => {
            showError(error.graphQLErrors[0].message)
        }
    })

    return result
}
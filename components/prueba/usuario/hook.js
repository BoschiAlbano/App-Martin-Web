import { useLazyQuery } from '@apollo/client'
// Queries
import { GET_Usuario } from 'components/prueba/usuario/queries'

// Query con parametros
export const useUsuario = () => {
    const result = useLazyQuery(GET_Usuario)
    return result // devuelve un array con dos posiciones
}
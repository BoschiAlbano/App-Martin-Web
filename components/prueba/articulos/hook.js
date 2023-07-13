import { useQuery, useLazyQuery, useMutation } from '@apollo/client'
// Queries
import { GET_ARTICULOS, GET_ARTICULOS_Filtro, GET_RUBRO, GET_ARTICULOS_Oferta } from 'components/prueba/articulos/queries'


export const useArticulos = () => {
    return useQuery(GET_ARTICULOS)
}

// Query con parametros
export const useRubro = () => {
    const result = useLazyQuery(GET_RUBRO)
    return result // devuelve un array con dos posiciones
}

// Query con parametros
export const useArticuloFiltro = () => {
    const result = useLazyQuery(GET_ARTICULOS_Filtro)
    return result // devuelve un array con dos posiciones
}


// Query con parametros
export const useArticuloOferta = () => {
    const result = useLazyQuery(GET_ARTICULOS_Oferta)
    return result // devuelve un array con dos posiciones
}


// Ejemplo: Hedader
// export const useRubro = () => {
//     return useQuery(GET_RUBRO, {context: {headers: {Authorization: Publicas.NEXT_PUBLIC_CLAVE_APIs}}})
// }
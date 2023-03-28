import { useQuery, useLazyQuery, useMutation } from '@apollo/client'
// Queries
import { GET_ARTICULOS, GET_ARTICULOS_Filtro, GET_RUBRO_MARCA } from 'components/prueba/articulos/queries'
// Mutations


export const useArticulos = () => {
    return useQuery(GET_ARTICULOS)
}

export const useRubroMarca = () => {
    return useQuery(GET_RUBRO_MARCA)
}

export const useArticuloFiltro = () => {
    const result = useLazyQuery(GET_ARTICULOS_Filtro)
    return result // devuelve un array con dos posiciones
  }
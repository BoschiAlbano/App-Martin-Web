import { gql } from '@apollo/client'

export const GET_ARTICULOS = gql`
    query Get_Articulos {
        GET_Articulo {
            id
            codigo
            descripcion
            eliminado
            imagen
            precio
            Rubro {
                id
                descripcion
            }
            Marca {
                id
                descripcion
            }
        }
    }
`

export const GET_RUBRO_MARCA = gql`
    query Get_Rubro_Marca {
    GET_Marca {
        id
        descripcion
    }
    GET_Rubro {
        id
        descripcion
    }
    }
`

export const GET_ARTICULOS_Filtro =gql`
    query Get_Articulos_Filtro($marca: String, $rubro: String, $keyword: String) {
    FILTRO_Articulo(marca: $marca, rubro: $rubro, keyword: $keyword) {
        id
        codigo
        descripcion
        imagen
        precio
        eliminado
        fecha
        Marca {
        id
        descripcion
        }
        Rubro {
        id
        descripcion
        }
    }
    }
`
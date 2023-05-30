import { gql } from '@apollo/client'

export const GET_ARTICULOS = gql`
    query Get_Articulos {
        GET_Articulo {
            Id
            Codigo
            Descripcion
            EstaEliminado
            FotoUrl
            PrecioVenta
            Rubro {
                Id
                Descripcion
            }
            Marca {
                Id
                Descripcion
            }
        }
    }
`

export const GET_RUBRO_MARCA = gql`
    query Get_Rubro_Marca {
    GET_Marca {
        Id
        Descripcion
    }
    GET_Rubro {
        Id
        Descripcion
    }
    }
`

export const GET_ARTICULOS_Filtro =gql`
    query Query($rubro: BigInt, $keyword: String) {
    FILTRO_Articulo(rubro: $rubro, keyword: $keyword) {
        Id
        MarcaId
        RubroId
        Codigo
        Descripcion
        Stock
        EstaEliminado
        FotoUrl
        PrecioVenta
        PermiteStockNegativo
        Rubro {
        Id
        Descripcion
        EstaEliminado
        }
        Marca {
        Id
        Descripcion
        EstaEliminado
        }
    }
}
`
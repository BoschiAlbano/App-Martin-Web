import { gql } from '@apollo/client'

export const GET_ARTICULOS = gql`
    query Get_Articulos {
        GET_Articulo {
            Id
            Codigo
            Descripcion
            EstaEliminado
            FotoUrl
            Oferta
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

export const GET_RUBRO = gql`
    query GetUser($medicamento: Boolean!) {
    GET_Rubro(Medicamento: $medicamento) {
        Id
        Codigo
        Descripcion
        EstaEliminado
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
        Oferta
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
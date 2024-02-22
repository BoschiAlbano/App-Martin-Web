import { gql } from "@apollo/client";

export const GET_ARTICULOS = gql`
    query Query($medicamento: Boolean!) {
        GET_Rubro(Medicamento: $medicamento) {
            Id
            Descripcion
            Articulo {
                Descripcion
                Id
                Oferta
                URL
            }
        }
    }
`;

export const GET_RUBRO = gql`
    query Query($medicamento: Boolean!) {
        GET_Rubro(Medicamento: $medicamento) {
            Codigo
            Descripcion
            EstaEliminado
            Id
        }
    }
`;

export const GET_ARTICULOS_Filtro = gql`
    query Query($rubro: BigInt, $keyword: String, $medicamento: Boolean!) {
        FILTRO_Articulo(
            rubro: $rubro
            keyword: $keyword
            medicamento: $medicamento
        ) {
            Id
            MarcaId
            RubroId
            Codigo
            Descripcion
            Stock
            EstaEliminado
            URL
            PrecioVenta
            Oferta
            Descuento
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
`;

export const GET_ARTICULOS_Oferta = gql`
    query GET_Articulos_Oferta($medicamento: Boolean!) {
        GET_Articulos_Oferta(medicamento: $medicamento) {
            Id
            Descripcion
            Stock
            URL
            PrecioVenta
            PermiteStockNegativo
            Oferta
            MarcaId
            Descuento
        }
    }
`;

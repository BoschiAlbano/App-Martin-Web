import { useQuery, useLazyQuery, useMutation } from "@apollo/client";
// Queries
import {
    GET_ARTICULOS,
    GET_ARTICULOS_Filtro,
    GET_RUBRO,
    GET_ARTICULOS_Oferta,
} from "components/prueba/articulos/queries";

// Query con parametros
export const useArticulos = () => {
    const result = useLazyQuery(GET_ARTICULOS);
    return result; // devuelve un array con dos posiciones
};

// Query con parametros
export const useRubro = () => {
    const result = useLazyQuery(GET_RUBRO);
    return result; // devuelve un array con dos posiciones
};

// Query con parametros
export const useArticuloFiltro = () => {
    const result = useLazyQuery(GET_ARTICULOS_Filtro);
    return result; // devuelve un array con dos posiciones
};

// Query con parametros
export const useArticuloOferta = () => {
    const result = useLazyQuery(GET_ARTICULOS_Oferta);
    return result; // devuelve un array con dos posiciones
};

import { Prisma } from "@prisma/client";

export function BorrarCookies(context) {
    context.res.setHeader("Set-Cookie", [
        "next-auth.session-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT",
        "next-auth.callback-url=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT",
        "next-auth.csrf-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT",
        // Agrega más sentencias 'Set-Cookie' para cada cookie que desees borrar
    ]);
}

// Función para eliminar campos `bigint` y convertir `Decimal` a número
export const eliminarBigIntYDecimal = (objeto) => {
    if (Array.isArray(objeto)) {
        // Si es un array, recursivamente aplicar la función a cada elemento
        return objeto.map((el) => eliminarBigIntYDecimal(el));
    }

    // const nuevoObjeto = { ...objeto };

    for (const clave in objeto) {
        if (Object.prototype.hasOwnProperty.call(objeto, clave)) {
            const valor = objeto[clave];

            if (valor instanceof Prisma.Decimal) {
                // Si es un `Decimal`, convertirlo a número
                objeto[clave] = Number(valor);
            } else if (typeof valor === "object") {
                // Si es un objeto, recursivamente eliminar campos `bigint` y convertir `Decimal`
                objeto[clave] = eliminarBigIntYDecimal(valor);
            } else if (typeof valor === "bigint") {
                // Si es un `bigint`, eliminar el campo => delete objeto[clave];
                objeto[clave] = Number(valor);
            }
        }
    }

    return objeto;
};

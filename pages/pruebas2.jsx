import React, { useEffect, useState } from "react";

import { useRubro } from "components/prueba/articulos/hook";

const ArticulosApi = () => {
    // const { loading, error, data } = useArticulos();
    // const [getData, { loading, error, data: d }] = useArticuloFiltro();

    const [getDataRubro, { loading, error, data: d }] = useRubro();

    const [datos, setdatos] = useState(null);

    useEffect(() => {
        getDataRubro({
            variables: {
                medicamento: false,
            },
        });
    }, []);

    useEffect(() => {
        if (d?.GET_Rubro) {
            setdatos(d.GET_Rubro);
        }
    }, [loading]);

    const Consultar = () => {};

    if (datos) {
        console.log(["Datos: ", d.GET_Rubro]);
    }

    return (
        <div>
            <h1>Probando Hoock de Articulos con filtros</h1>
            <button className=" bg-red-200" onClick={() => Consultar()}>
                Buscar
            </button>
            {datos ? <h1>hay datos</h1> : <h1>No hay datos aun</h1>}
        </div>
    );
};

export default ArticulosApi;

import React from "react";

export default function Spinner() {
    return (
        <div className="loader">
            <span className="loader-text">Cargando..</span>
            <span className="load"></span>
        </div>
    );
}

import React, { useEffect, useState } from 'react';
import { HiSearch } from "react-icons/hi";

const FiltroArt = ({ datos, filtro }) => {


    const [DatosFiltro, setDatosFiltro] = useState({ keyword: null, rubro: null, marca: null });

    useEffect(() => {
        console.log(datos)
    }, []);


    const selectChange = (e) => {
        setDatosFiltro({ ...DatosFiltro, [e.target.name]: e.target.value })
    }

    const filtrar = (e) => {
        e.preventDefault();
        filtro(DatosFiltro)
    }

    return (
        <div className="Degradado w-full h-auto p-[3px] text-center mt-5 mb-3 rounded-md ">
            <form onSubmit={(e) => filtrar(e)}>
                <div className="w-full m-0 p-2 bg-[#ffffff] rounded-md filtro">


                    <div className={`filtro1 border-[2px] h-[3rem] overflow-hidden flex justify-between rounded-xl m-1 border-[#EBEBEB] w-full`}>
                        <h1 className="text-sm px-4 text-white flex items-center font-[Merienda] Degradado">Marcas </h1>
                        <select className="rounded-sm w-full text-xl focus:outline-none border-none" name="marca" id="" onChange={(e) => selectChange(e)}>
                            <option value={''}>Todo</option>
                            {
                                datos.GET_Marca.map((item, index) => {
                                    return (
                                        <option key={index} value={item.id}>{item.descripcion}</option>
                                    )
                                })
                            }
                        </select>
                    </div>

                    <div className={`filtro2 border-[2px] h-[3rem] overflow-hidden flex justify-between rounded-xl m-1 border-[#EBEBEB] w-full`}>
                        <h1 className="text-sm px-4 text-white flex items-center font-[Merienda] Degradado">Rubro </h1>
                        <select className="rounded-sm w-full text-xl focus:outline-none border-none" name="rubro" id="" onChange={(e) => selectChange(e)}>
                            <option value={''}>Todo</option>
                            {
                                datos.GET_Rubro.map((item, index) => {
                                    return (
                                        <option key={index} value={item.id}>{item.descripcion}</option>
                                    )
                                })
                            }
                        </select>
                    </div>


                    <div className={`filtro3 border-[2px] overflow-hidden flex justify-between rounded-xl m-1 border-[#EBEBEB] w-full`}>
                        <input className={`bg-[#ffffff] w-full focus:outline-none border-none px-3`} placeholder='Buscar' type={'text'} name={'keyword'} onChange={(e) => selectChange(e)} />

                        <button type={'submit'} className="Degradado w-1/10 h-[3rem] p-4 group flex items-center overflow-hidden rounded-r  text-white justify-center">

                            <span className="text-sm ml-4 font-medium font-[Merienda] transition-all group-hover:mr-1">
                                Buscar
                            </span>

                            <span className=" translate-x-[8rem] transition-transform duration-300 group-hover:-translate-x-0 group-hover:mr-2 ">

                                <HiSearch className="h-5 w-5" />

                            </span>

                        </button>
                    </div>

                </div>
            </form>
        </div>
    );
}

export default FiltroArt;

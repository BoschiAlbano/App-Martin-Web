import { useState } from "react";


export function useLocalStorage(llave, valor) {

    const [store, setstore] = useState( () => {
        try {
            const item = window.localStorage.getItem(llave)
            return item ? JSON.parse(item) : valor
        } catch (error) {
            return valor
        }
    });

    const setValue = value => {
        try {
            setstore(value)
            window.localStorage.setItem(llave, JSON.stringify(value))
        } catch (error) {
        }
    }

    return [store, setValue]

}
import React, {useState} from 'react';
import { useAddTarea, useUpdateNota } from './hook';

const FormNota = () => {

    const [nota, setnota] = useState({id:'', title: '', description: '', url: '', user:''});

    const [error, setError] = useState(null);

    const showError = (Error) => {
        setError(Error)
        setTimeout(() => { setError(null) }, 5000);
    }

    const [ crear ] = useAddTarea(showError);
    const [ actializar ] = useUpdateNota(showError);

    const handleChange = (e) => {

        setnota({...nota, [e.target.name]: e.target.value})

    }

    const handleSubmit = (e) => {
        e.preventDefault();

        crear({variables: {...nota}})

        setnota({id:'', title: '', description: '', url: '', user:''})
    }

    const modificar = () => {

        actializar({variables: {...nota}})
        setnota({id:'', title: '', description: '', url: '', user:''})
    }

    return (
        <form className="w-[60%] m-3 p-3 border border-red-400 rounded-lg flex flex-col" onSubmit={(e) => handleSubmit(e)}>
        
            {error ? <label className="text-red-400 text-sm rounded-xl">{error}</label> : null}

            <input className='bg-transparent text-white border border-red-400 m-1 p-1' type={'text'} placeholder={'id'} name={'id'} value={nota.id} onChange={(e) => handleChange(e)}/>
            <input className='bg-transparent text-white border border-red-400 m-1 p-1' type={'text'} placeholder={'title'} name={'title'} value={nota.title} onChange={(e) => handleChange(e)}/>
            <input className='bg-transparent text-white border border-red-400 m-1 p-1' type={'text'} placeholder={'description'} name={'description'} value={nota.description} onChange={(e) => handleChange(e)}/>
            <input className='bg-transparent text-white border border-red-400 m-1 p-1' type={'text'} placeholder={'url'} name={'url'} value={nota.url} onChange={(e) => handleChange(e)}/>
            <input className='bg-transparent text-white border border-red-400 m-1 p-1' type={'text'} placeholder={'userId'} name={'user'} value={nota.user} onChange={(e) => handleChange(e)}/>

            <div className="flex flex-row justify-center items-center">
                <button type={'submit'} className="bg-transparent text-white border border-red-400 rounded-lg px-6 py-1 m-3">Crear</button>
                <button type={'button'} className="bg-transparent text-white border border-red-400 rounded-lg px-6 py-1 m-3" onClick={() => modificar()}>Modificar</button>
            </div>
        </form>
    );
}

export default FormNota;

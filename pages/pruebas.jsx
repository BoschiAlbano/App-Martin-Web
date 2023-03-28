import React, { useState, useEffect } from 'react';
import { getSession } from 'next-auth/react'
import MenuPaginas from 'components/menu/menuPaginas';
import FormNota from 'components/prueba/notas/formNota';

// hook => los componentes no tienen q saber de donde vienen los datos o sea apolloclient
import { useNotas } from 'components/prueba/notas/hook';
import { useNotaByTitle } from 'components/prueba/notas/hook';

const Pruebas = ({ session }) => {
  const { user } = session

  const { data, loading, error } = useNotas()
  
  const [getNota, result] = useNotaByTitle()
  const [nota, setNota] = useState(null);

  if (error) return <span className="text-red-600">{error}</span>


  // Query con parametros
  const showTareas = title => {
    getNota({ variables: { title } })
  }
  useEffect(() => {
    if (result.data) {
      setNota(result.data.GetByTitle_Notas)
    }
  }, [result]);

  return (
    <MenuPaginas user={user}>
      <div className="mt-[80px] h-screen w-full grid grid-cols-2">

        <div className='flex flex-col  items-center'>
          <h1 className="text-white font-normal text-2xl">Notas</h1>

          {
            nota ?
              <div>
                <h1>{nota.id}</h1>
                <h1>{nota.title}</h1>
                <h1>{nota.description}</h1>
                <h1>{nota.user.name}</h1>
                <button onClick={() => setNota(null)}>Cerrar</button>
              </div>
              :
              <div>
                {loading
                  ? <h1>Cargando...</h1>
                  : <ul>
                    {data.Get_Notas.map((item, index) => {
                      return (
                        <li className="text-rose-300 cursor-pointer" key={index} onClick={() => showTareas(item.title)}>{index + ' ' + item.title}</li>
                      )
                    })}
                  </ul>
                }
              </div>
          }
        </div>

        <div className='flex flex-col  items-center'>
          <h1 className="text-white font-normal text-2xl">Add Notas</h1>
          <FormNota></FormNota>
        </div>

      </div>
    </MenuPaginas>
  );
}

export default Pruebas;


export async function getServerSideProps(context) {

  const session = await getSession(context)

  if (!session) {
    return {
      redirect: {
        destination: '/login',
        permanent: false
      }
    }
  }

  if (session?.error) {
    console.log(session.error)
  }

  console.log(session.user)

  return {
    props: { session }
  }
}
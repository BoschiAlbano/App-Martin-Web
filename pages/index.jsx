import Head from 'next/head'
import { getSession } from 'next-auth/react'
import MenuPaginas from 'components/menu/menuPaginas'
import Banner from 'components/banner/banner'
import Rubro from 'components/rubros/index'
import { useEffect, useState} from 'react'
import { useLocalStorage } from 'components/prueba/localStorage/hook';

import Swal from 'sweetalert2';


export default function Home({ session }) {

  const { user } = session

  const [store, setValue] = useLocalStorage('showWelcome', true)


  useEffect(() => {
    if (store) {
      Swal.fire({
        icon: 'info',
        title: 'Distrinova',
        html: `Hola ${user.name} !!! Bienvenido a nuestra pagina web.`,
        allowOutsideClick: false,
        didOpen: () => {
          Swal.hideLoading();
        },
      });

      setValue(false)
    }
  }, []);

  return (
    <div>

      <MenuPaginas user={user}>

      <Banner />

      <Rubro/>


      </MenuPaginas>
    </div>

  )


}

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

  console.log(session)

  return {
    props: { 
      session
    }
  }
}
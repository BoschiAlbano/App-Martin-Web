import { getSession } from 'next-auth/react'
import MenuPaginas from 'components/menu/menuPaginas'
import Banner from 'components/banner/banner'
import Rubro from 'components/rubros/index'
import { useEffect} from 'react'
import { useLocalStorage } from 'components/prueba/localStorage/hook';
import Swal from 'sweetalert2';
import { request } from 'graphql-request' 

import Carousel from 'components/Carrucel'
import { useArticuloOferta } from 'components/prueba/articulos/hook'

export default function Home({ session }) {

  const { name, medicamento } = session

  const [store, setValue] = useLocalStorage('showWelcome', true)


  const [getOfertas, resultOfertas] = useArticuloOferta();


  useEffect(() => {

    getOfertas({ variables: { medicamento: session.medicamento } })
    
    if (store) {
      Swal.fire({
        icon: 'info',
        title: 'Distrinova',
        html: `Hola ${name} !!! Bienvenido a nuestra pagina web.`,
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

      <MenuPaginas user={session}>

        <div className="Degradado_Banner">

          <Banner/>


          {resultOfertas.data ? <Carousel products={resultOfertas.data.GET_Articulos_Oferta}/> : null}

          {
            medicamento ? <Rubro medicamento={true}/> : <Rubro medicamento={false}/>
          }

        </div>

      
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
    return;
  }


  const query = `
  query GetUser($email: String!) {
    GetUser(email: $email) {
      id
      name
      apellido
      DNI
      telefono
      direccion
      medicamento
    }
  }
  `;

  const variables = {
    email: session.user.email,
  };

  const data = await request(`${process.env.NEXTAUTH_URL}/api/graphql`, query, variables);

  // busco el usuario.
  // console.log("Datos de Usuario:")
  // console.log(data.GetUser)

  if (!data.GetUser) {

    context.res.setHeader('Set-Cookie', [
      'next-auth.session-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT',
      'next-auth.callback-url=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT',
      'next-auth.csrf-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT',
      // Agrega más sentencias 'Set-Cookie' para cada cookie que desees borrar
    ]);

    return {
      redirect: {
        destination: '/login',
        permanent: false
      }
    }

  }

  return {
    props: { 
      session: data.GetUser
    }
  }
}
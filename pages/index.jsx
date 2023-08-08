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

import Spinner from 'components/Spinner'
import Link from 'next/link'

export default function Home({ session, rubros }) {

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

        <div className="Degradado_Banner h-full">

          <Banner/>
          {/* {
            medicamento ? <Rubro medicamento={true}/> : <Rubro medicamento={false}/>
          } */}
          {/* <Rubro medicamento={medicamento} /> */}
          


          <div className="flex sm:flex-col-reverse flex-col mt-5">

            {resultOfertas.data
            ? <Carousel products={resultOfertas.data.GET_Articulos_Oferta}/> 
            : <div className="w-full flex flex-col items-center mt-3"> <Spinner/></div>}

            <section>
              {/* <h1 className="text-center sm:text-[3rem] text-[1.5rem] font-[merienda] my-3">Conoce nuestros rubros</h1> */}

              <div className="flex w-full sm:w-auto sm:h-auto flex-row flex-wrap gap-3 sm:gap-5 justify-center items-center mt-3 mb-10">
                {rubros.map((item, index) => (
                    <Link className='button p-2 border-black rounded-xl border-[4px]' href={`articulos/${item.Id}/${item.Descripcion}`} key={index}>{item.Descripcion}</Link>
                ))}
              </div>

            </section>

          </div>



        </div>

      
      </MenuPaginas>
    </div>

  )


}

export async function getServerSideProps(context) {

  //#region Session
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
  //#endregion
  
  //#region GET User
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
 //#endregion
  
  //#region Get Rubros
  const query2 = `
    query GetUser($medicamento: Boolean!) {
      GET_Rubro(Medicamento: $medicamento) {
          Id
          Codigo
          Descripcion
          EstaEliminado
      }
      }
  `

  const variables2 = {
    medicamento: data.GetUser.medicamento,
  };


  const data2 = await request(`${process.env.NEXTAUTH_URL}/api/graphql`, query2, variables2);

  console.log(data2.GET_Rubro)

  //#endregion
 return {
    props: { 
      session: data.GetUser,
      rubros: data2.GET_Rubro
    }
  }
}
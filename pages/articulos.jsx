import React, { useState, useEffect } from 'react';
import MenuPaginas from 'components/menu/menuPaginas';
import { getSession } from 'next-auth/react';
import Spinner from 'components/Spinner';
import { useRubro, useArticuloFiltro } from 'components/prueba/articulos/hook';
import styles from 'styles/ArticuloCard.module.css';
import FiltroArt from 'components/filtroArt';
import { useLocalStorage } from 'components/prueba/localStorage/hook';
import Swal from 'sweetalert2';
import TarjetaPremium from 'components/card/TarjetaPremium';
import { request } from 'graphql-request' 

const Articulos = ({ session }) => {
  const [value, setValue] = useLocalStorage('Carrito', []);
  const [dataArticulos, setDataArticulos] = useState(null);
 
  const [dataRubro, setDataRubro] = useState(null);


  const [getData, result] = useArticuloFiltro();
  const [getRubro, resultRubro] = useRubro();

  useEffect(() => {
    // Aqui
    getData({ variables: { keyword: '', rubro: null } });
    getRubro({ variables: { medicamento: session.medicamento } })
  }, []);

  useEffect(() => {
    if (result.data) {
      setDataArticulos(result.data.FILTRO_Articulo);
    }
    if (resultRubro.data) {
      setDataRubro(resultRubro.data.GET_Rubro)
    }
  }, [result, resultRubro]);

  const filtro = ({ keyword = '', rubro = null }) => {
    //
    getData({ variables: { keyword, rubro: rubro === 'Todo' ? null : rubro } });
  };

  const AgregarCarrito = (articulo) => {

    try {
      const { Stock, PermiteStockNegativo } = articulo;
      const indice = value.findIndex((art) => art.Id === articulo.Id);

      if (indice > 0) {
        return Swal.fire({
          icon: 'success',
          title: 'El Articulo ya esta Agregado al Carrito de compras',
          timer: 2500
        });
      }

      if (!PermiteStockNegativo) {
        if (Stock === 0) {
          return Swal.fire({
            icon: 'error',
            title: 'No hay Stock',
            timer: 2500
          });
        }

        Agregar(articulo)

      }

      Agregar(articulo)

    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Se Produjo un error Grabe.',
        timer: 2500
      });
    }
  };

  const Agregar = (articulo) => {

    const { Id, Descripcion, FotoUrl, PrecioVenta, Stock, PermiteStockNegativo } = articulo;

    const Add = value.concat({ Id, Descripcion, FotoUrl, PrecioVenta, Cantidad: 1, Stock, PermiteStockNegativo });
    setValue(Add);

    return Swal.fire({
      icon: 'success',
      title: 'Agregado al Carrito...',
      timer: 2500
    });
  }



  return (
    <div>
      <MenuPaginas user={session}>
        <div className="w-[90%] ml-[5%] grid grid-cols-1 mt-[60px]">

          {
            dataRubro === null ? 
            <div className="w-full flex flex-col items-center">
              <Spinner />
            </div>
            :
            <FiltroArt datos={dataRubro} filtro={filtro} />
          }

          {dataArticulos === null ? (
            <div className="w-full flex flex-col items-center">
              <Spinner />
            </div>
          ) : (
            <div className={styles.contenedor_Articulos_Card}>
              {dataArticulos.map((item, index) => (
                <TarjetaPremium key={index} articulo={item} AgregarCarrito={AgregarCarrito} />
              ))}
            </div>
          )}
        </div>


      </MenuPaginas>
    </div>
  );
};

export default Articulos;

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
    email: "Boschi.Albano.Jose@gmail.com",
  };

  const data = await request(`${process.env.NEXTAUTH_URL}/api/graphql`, query, variables);

  // busco el usuario.
  console.log("Datos de Usuario:")
  console.log(data.GetUser)

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
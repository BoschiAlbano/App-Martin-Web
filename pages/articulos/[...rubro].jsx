import React, { useState, useEffect } from 'react';
import MenuPaginas from 'components/menu/menuPaginas';
import { getSession } from 'next-auth/react';
import Spinner from 'components/Spinner';
import { useRubro, useArticuloFiltro } from 'components/prueba/articulos/hook';
import FiltroArt from 'components/filtroArt';
import { useLocalStorage } from 'components/prueba/localStorage/hook';
import Swal from 'sweetalert2';
import TarjetaPremium from 'components/card/TarjetaPremium';
import { request } from 'graphql-request' 
import Masonry from 'react-masonry-css';


const Articulos = ({ session, rubro }) => {
  const [value, setValue] = useLocalStorage('Carrito', []);
  const [dataArticulos, setDataArticulos] = useState(null);
 
  const [dataRubro, setDataRubro] = useState(null);

  const [getData, result] = useArticuloFiltro();
  const [getRubro, resultRubro] = useRubro();

  
  useEffect(() => {
    // Aqui
    //getData({ variables: { keyword: '', rubro: null } });
    getData({ variables: { keyword: '', rubro: rubro.id == null || rubro.descripcion === "Todo" ? null : rubro.id } });
    getRubro({ variables: { medicamento: session.medicamento } })
  }, []);

  useEffect(() => {

    if (result.data) {
      setDataArticulos(result.data.FILTRO_Articulo);
    }
    if (resultRubro.data) {
      setDataRubro(resultRubro.data.GET_Rubro)
    }

    if (resultRubro.error?.message || result.error?.message) 
    {
      Swal.fire({
        icon: 'error',
        title: 'Error en el Servidor.',
        timer: 2500
      });
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
  
      if (indice >= 0) {
        return Swal.fire({
          icon: 'success',
          title: 'El Articulo ya esta Agregado al Carrito de compras',
          timer: 2500
        });
      }
  
      if (!PermiteStockNegativo && Stock === 0) {
        return Swal.fire({
          icon: 'error',
          title: 'No hay Stock',
          timer: 2500
        });
      }
  
      if (PermiteStockNegativo || Stock > 0) {
        mostrarAlertaCantidad(articulo); // Llama a la función para ingresar la cantidad
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Se Produjo un error Grave.',
        timer: 2500
      });
    }
  };
  
  const mostrarAlertaCantidad = (articulo) => {
    const { Stock, PermiteStockNegativo } = articulo;
  
    Swal.fire({
      title: 'Ingrese la cantidad',
      input: 'number',
      showCancelButton: true,
      confirmButtonText: 'Agregar',
      cancelButtonText: 'Cancelar',
      inputValidator: (value) => {
        if (!value || value < 1) {
          return 'Por favor, ingrese una cantidad válida.';
        }
        if (!PermiteStockNegativo) {
          if (value > Stock) {
            return 'La cantidad ingresada supera el stock disponible.';
          }
        }

      },
    }).then((result) => {
      if (result.isConfirmed) {

        Agregar(articulo, parseInt(result.value));
      }
    });
  };
  

  
  const Agregar = (articulo, Cantidad ) => {


    const { Id, Descripcion, FotoUrl, PrecioVenta, Stock, PermiteStockNegativo, Descuento } = articulo;

    let _Descuento = PrecioVenta - (PrecioVenta * (Descuento / 100 ))

    const Add = value.concat({ Id, Descripcion, FotoUrl, PrecioVenta: _Descuento, Cantidad, Stock, PermiteStockNegativo });
    setValue(Add);


    // pedir Cantidad: 

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
              <div className="w-full flex flex-col items-center mt-3">
                <Spinner />
              </div>
            :
            <FiltroArt datos={dataRubro} filtro={filtro} rubroSeleccionado={rubro} />
          }
          
            
          {dataArticulos === null ? (
            <div className="w-full flex flex-col items-center">
              <Spinner />
            </div>
          ) : (
            <Masonry
              breakpointCols={{
                default: 5, // Número de columnas en el mosaico por defecto
                1100: 3, // Número de columnas cuando la ventana tiene un ancho de 1100px o menos
                700: 2, // Número de columnas cuando la ventana tiene un ancho de 700px o menos
                500: 1, // Número de columnas cuando la ventana tiene un ancho de 500px o menos
              }}
              className="my-masonry-grid"
              columnClassName="my-masonry-grid_column"
            >
              {dataArticulos.map((item, index) => (
                <TarjetaPremium key={index} articulo={item} AgregarCarrito={AgregarCarrito} />
              ))}
            </Masonry>
          )}
        </div> 


      </MenuPaginas>
    </div>
  );
};

export default Articulos;

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
  }
  //#endregion
  
  //#region Usuario
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

  const { rubro } = context.query;

  const [id = null, descripcion = "Todo"] = rubro || [];

  return {
    props: { 
      session: data.GetUser,
      rubro: { id, descripcion }
    }
  }
}
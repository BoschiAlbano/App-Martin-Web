import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import MenuPaginas from 'components/menu/menuPaginas';
import { getSession } from 'next-auth/react';
import Spinner from 'components/Spinner';
import { useRubro, useArticuloFiltro } from 'components/prueba/articulos/hook';
import styles from 'styles/ArticuloCard.module.css';
import FiltroArt from 'components/filtroArt';
import { useLocalStorage } from 'components/prueba/localStorage/hook';
import Swal from 'sweetalert2';
import { FaArrowCircleUp } from 'react-icons/fa';
import TarjetaPremium from 'components/card/TarjetaPremium';

const Articulos = ({ session }) => {
  const [value, setValue] = useLocalStorage('Carrito', []);
  const [dataArticulos, setDataArticulos] = useState(null);
  const { data, loading, error } = useRubro();
  const [getData, result] = useArticuloFiltro();

  useEffect(() => {
    getData({ variables: { keyword: '', rubro: null } });
  }, []);

  useEffect(() => {
    if (result.data) {
      setDataArticulos(result.data.FILTRO_Articulo);
    }
  }, [result]);

  const filtro = ({ keyword = '', rubro = null }) => {
    getData({ variables: { keyword, rubro: rubro === 'Todo' ? null : rubro } });
  };

  const AgregarCarrito = (articulo) => {

    try {
      const { Id, Descripcion, FotoUrl, PrecioVenta, Stock, PermiteStockNegativo } = articulo;
      const indice = value.findIndex((art) => art.Id === articulo.Id);

      if (indice < 0) {
        if (!PermiteStockNegativo) {
          if (Stock === 0) {
            return Swal.fire({
              icon: 'error',
              title: 'No hay Stock',
              timer: 2500
            });
          }

          const Add = value.concat({ Id, Descripcion, FotoUrl, PrecioVenta, Cantidad: 1, Stock, PermiteStockNegativo });
          setValue(Add);

          return Swal.fire({
            icon: 'success',
            title: 'Agregando al Carrito...',
            timer: 2500
          });
        }

        const Add = value.concat({ Id, Descripcion, FotoUrl, PrecioVenta, Cantidad: 1, Stock, PermiteStockNegativo });
        setValue(Add);

        Swal.fire({
          icon: 'success',
          title: 'Agregando al Carrito...',
          timer: 2500
        });
      } else {
        Swal.fire({
          icon: 'success',
          title: 'El Articulo ya esta Agregado al Carrito de compras',
          timer: 2500
        });
      }
    } catch (error) {
      console.log(error.message);
      Swal.fire({
        icon: 'error',
        title: 'Se Produjo un error Grabe.',
        timer: 2500
      });
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <div>
      <MenuPaginas user={session.user}>
        <div className="w-[90%] ml-[5%] grid grid-cols-1 mt-[60px]">
          {loading ? (
            <div className="w-full flex flex-col items-center">
              <Spinner />
            </div>
          ) : error ? (
            <div className="w-full flex flex-col items-center">
              <Spinner />
              <span className="text-red-600">Error al cargar los filtros</span>
            </div>
          ) : (
            <FiltroArt datos={data} filtro={filtro} />
          )}

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

        <FaArrowCircleUp
          className="Saltar w-[45px] h-[45px] m-2 cursor-pointer rounded-full z-[88] text-[rgb(59,130,246)] fixed bottom-0 right-0 flex justify-center items-center"
          onClick={scrollToTop}
        />
      </MenuPaginas>
    </div>
  );
};

export default Articulos;

export async function getServerSideProps(context) {
  const session = await getSession(context);

  if (!session) {
    return {
      redirect: {
        destination: '/login',
        permanent: false
      }
    };
  }

  if (session?.error) {
    console.log(session.error);
  }

  return {
    props: { session }
  };
}

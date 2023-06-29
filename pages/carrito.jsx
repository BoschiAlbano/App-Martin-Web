import React, { useEffect, useState } from 'react';
import { getSession } from 'next-auth/react';
import MenuPaginas from 'components/menu/menuPaginas';
import { useLocalStorage } from 'components/prueba/localStorage/hook';
import ArticuloCarrito from 'components/articuloCarrito';
import Spinner from 'components/Spinner';
import { IoSend } from 'react-icons/io5'
import Swal from 'sweetalert2';
import Link from 'next/link';
import { useRouter } from 'next/router';
import {useAddPedidos} from 'components/prueba/pedidos/hook'

const Carrito = ({ session }) => {
  const router = useRouter();
  const [store, setValue] = useLocalStorage('Carrito', [])

  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0)

  // const [enviando, setEnviando] = useState(false);

  const showError = (error) => {
    if (error) {

      Swal.fire({
        icon: 'error',
        title: error,
        text: '¿ Desea modificar el stock ? o Borrar el carrito',
        showCancelButton: true,
        confirmButtonText: 'Modificar Stock',
        cancelButtonText: 'Borrar el Carrito'
      }).then((result) => {
        if (!result.isConfirmed) {
          setValue([])
          setTotal(0)
        }
      })

    }else{

      Swal.fire({
        icon: 'success',
        title: 'Pedido enviado exitosamente.',
        timer: 2500
      });

      // Borrar Carrito
      setValue([])
      setTotal(0)
    }
  }

  const [ crear ]= useAddPedidos(showError);


  useEffect(() => {
    setLoading(true);

    if (store.length !== 0) {
      const tot = store.reduce((acumulador, item) => acumulador + (item.PrecioVenta * item.Cantidad), 0);
      setTotal(tot);
    }else{
      setTotal(0);
    }

    setLoading(false)
  }, [store]);

  const GuardarYenviarPedido = async() => {

    try {
      // verificar q no sea 0 el carrito
      if (total == 0) {
        Swal.fire({
          icon: 'error',
          title: 'No hay Productos en el carrito de compras',
          timer: 2500
        })
        return
      }
      // Guardar en base de datos
      const Arts = store.map((valor, index, arr) => {
        return {Id: valor.Id, Cantidad: +valor.Cantidad, Descripcion: valor.Descripcion}
      })

      const datos = {articulos: Arts, usuario: session.user.email}

      Swal.fire({
        title: 'Enviando pedido...',
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading(); // Mostrar el spinner de carga
        }
      });

      await crear({variables: datos})

    } catch (error) {
      console.log(error.message)
        Swal.fire({
          icon: 'error',
          title: 'Se Produjo un error Grabe.',
          timer: 2500
        })
    }
  }

  const modificarCantidad = ({ id, cantidad }) => {

    const indice = store.findIndex(art => art.Id === id);
    const actualizar = [...store];

    if (!actualizar[indice].PermiteStockNegativo) {

      if (actualizar[indice].Stock < cantidad) {
        Swal.fire({
          icon: 'error',
          title: 'Stock Insuficiente.',
          timer: 2500
        })
        return
      }

    }

    actualizar[indice].Cantidad = cantidad;
    setValue(actualizar);

  }

  const eliminarArticulo = (id) => {
    const eliminar = store.filter(art => art.Id !== id);
    setValue(eliminar);
  }
  
  return (
    <MenuPaginas user={session.user}>

      <div className='ContenedorCarrito bg-[#ffffffb0] h-screen'>
        <div className="mt-[80px] bg-white grid grid-cols-1 shadow-xl py-6 px-3 place-items-center gap-2">

          <h1 className="text-2xl font-[Merienda] hover:text-[#5E69F1] hover:border-b-[#5E69F1] border-b border-b-black w-full text-center">{loading ? "Tu Carrito" : `Tu Carrito (${store.length})`}</h1>

          {loading ? <div className="w-full flex flex-col items-center"><Spinner /></div>
            : store.map((item, index) => {
              return (
                <ArticuloCarrito key={index} item={item} modificar={modificarCantidad} eliminar={eliminarArticulo} />
              )
            })
          }
            <div className="w-full flex flex-col justify-end items-end">

              <div className={`filtro3 border-[2px] overflow-hidden flex justify-between rounded-xl m-1 border-[#EBEBEB] w-[200px] `}>

                <h1 className="Degradado py-2 px-4 text-xl">Total</h1>

                <input className={`bg-[#ffffff] w-full focus:outline-none border-none px-3  text-2xl`} type={'text'} name={'keyword'} value={`$${total}`} onChange={() => { }} />

              </div>

              <button onClick={() => GuardarYenviarPedido()} type='submit' className="Degradado w-[200px] h-[3rem] p-4 mb-4 group flex items-center overflow-hidden rounded text-white justify-center">

                <div className="text-sm ml-4 font-medium font-[Merienda] transition-all group-hover:mr-1">
                  Enviar Pedido
                </div>

                <div className=" translate-x-[8rem] transition-transform duration-300 group-hover:-translate-x-0 group-hover:mr-2 ">

                  <IoSend className="h-5 w-5" />

                </div>

              </button>

            </div>

        </div>

        <div className="mt-[10px] bg-white grid grid-cols-1 shadow-xl py-6 px-3 place-items-center gap-2">
          <h1>Una vez enviado el pedido, Estaremos en contacto para coordinar la entrega en un plazo de 24 hs.</h1>
        </div>
      </div>
    </MenuPaginas>
  );
}

export default Carrito;


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

  return {
    props: { session }
  }

}
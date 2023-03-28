import React, { useEffect, useState } from 'react';
import { getSession } from 'next-auth/react';
import MenuPaginas from 'components/menu/menuPaginas';
import { useLocalStorage } from 'components/prueba/localStorage/hook';
import ArticuloCarrito from 'components/articuloCarrito';
import Spinner from 'components/Spinner';
import { IoSend } from 'react-icons/io5'
import Swal from 'sweetalert2';
import Link from 'next/link';

import {useAddPedidos} from 'components/prueba/pedidos/hook'

const Carrito = ({ session }) => {

  const [store, setValue] = useLocalStorage('Carrito', [])
  const [loading, setloading] = useState(true);
  const [total, setTotal] = useState(0)
  const [recargar, setrecargar] = useState(false);
  const [error, setError] = useState(null);
  
  const showError = (Error) => {
    setError(Error)
    setTimeout(() => { setError(null) }, 5000);
  }

  const [ crear ] = useAddPedidos(showError)
  
  useEffect(() => {

    console.log(store)
    setloading(true)

    setloading(false)
    if (store.length != 0) {

      // calcular total
      const tot = store.reduce((acumulador, item) => acumulador + (item.precio * item.cantidad), 0)

      setTotal(tot)
    }

  }, [store, recargar]);
  const modificarCantidad = ({ id, cantidad }) => {
    // buscar si ya existe el art y aumentar la cantidad
    const indice = store.findIndex(art => art.id === id)
    // modificar cantidad
    const actualizar = store
    actualizar[indice].cantidad = cantidad
    setValue(actualizar)
    setrecargar(!recargar)
  }
  const eliminarArticulo = (id) => {
    const indice = store.findIndex(art => art.id === id)

    // Eliminar cantidad
    const eliminar = store
    eliminar.splice(indice, 1)
    setValue(eliminar)
    setrecargar(!recargar)

    store.length == 0 ? setTotal(0) : null
  }
  const GuardarYenviarPedido = async() => {

    // console.log(session)
    // return

    try {
      // verificar q no sea 0 el carrito
      if (total == 0) {
        Swal.fire({
          icon: 'error',
          title: 'No, Hay Productos en el carrito de compras',
          timer: 2500
        })
        return
      }
      // Guardar en base de datos
      const Arts = store.map((valor, index, arr) => {
        return valor.id
      })

      const datos = {
        eliminado: false,
        articulosId: Arts,
        usuario: session.user.email
      }

      crear({variables: {...datos}})

      // Enviar mail o wp
      // let mensaje = 'Buenos dias Albano este es mi Carrito de Compras: \n'
      // store.forEach((item) => {
      //   mensaje += `${item.descripcion} = ${item.cantidad} unidad \n`
      // });
      // mensaje += `Total: ${total}`
      // const numero = "3816206925";
      // const url = `https://api.whatsapp.com/send?phone=${numero}&text=${encodeURIComponent(mensaje)}`;
      // window.open(url, '_system');

      // Borrar Carrito
      setValue([])
      setTotal(0)
      setrecargar(!recargar)

      // Mostrar Alerta
      Swal.fire({
        icon: 'success',
        title: 'Pedido Enviado.',
        timer: 2500
      })

    } catch (error) {
      console.log(error.message)
        Swal.fire({
          icon: 'error',
          title: 'Se Produjo un error Grabe.',
          timer: 2500
        })
    }
  }

  return (
    <MenuPaginas user={session.user}>
      <div className="ContenedorCarrito mt-[80px] bg-white grid grid-cols-1 shadow-xl py-6 px-3 place-items-center gap-2">

        <h1 className="text-2xl font-[Merienda] hover:text-[#5E69F1] hover:border-b-[#5E69F1] border-b border-b-black w-full text-center"> Tu Carrito </h1>

        {loading ? <div className="w-full flex flex-col items-center"><Spinner /></div>
          : store.map((item, index) => {
            return (
              
              <ArticuloCarrito key={index} item={item} modificar={modificarCantidad} eliminar={eliminarArticulo} />
      
            )
          })
        }

        {
          store.length == 0 ? <div> No hay Productos en el Carrito. <Link className="font-[Merienda] text-red-500" href={'/articulos'}>Ver Catalogo</Link></div> : null
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
import React, {useState} from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import Swal from 'sweetalert2';
import { useLocalStorage } from 'components/prueba/localStorage/hook';
import {IoCartOutline} from 'react-icons/io5'

var settings = {
  dots: false,
  infinite: true,
  arrows: false,
  slidesToShow: 5,
  slidesToScroll: 2,
  autoplay: true,
  autoplaySpeed: 2500,
  responsive: [
    {
      breakpoint: 1024,
      settings: {
        slidesToShow: 3,
        slidesToScroll: 1,
        infinite: true,
        dots: false
      }
    },
    {
      breakpoint: 600,
      settings: {
        slidesToShow: 2,// cantidad
        slidesToScroll: 1,// se mueve
        infinite: true,
        dots: false
      }
    },
    {
      breakpoint: 480,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1,
        infinite: true,
        dots: false
      }
    }
  ]
};


const Carousel = ({ products }) => {
  
  const [value, setValue] = useLocalStorage('Carrito', []);

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
    

    <div className=" flex flex-col justify-center">
      {products.length >= 5 ? <div>
      <h1 className="text-center sm:text-[3rem] text-[1.5rem] font-[merienda] my-3">Ofertas del Dia</h1>
      <Slider {...settings}>
        {products.map((articulo) => (
          <div className="" key={articulo.Id}>
            <div className="card_box_Oferta relative mx-3 my-2 mt-3 shadow-2xl Saltar bg-[#FFFFFF]  rounded-lg">
                    
            {
                articulo.Oferta ? <span></span> : null
            }

            <div className='flex flex-col justify-center items-center'>
            {/* className="object-cover w-full h-auto transition duration-500 hover:scale-150" */}
                <img loading="lazy" className="rounded-[0.5rem] h-[200px]  object-contain" src={articulo.FotoUrl ?? "./assets/ProductoSinFoto.png"}alt={articulo.Descripcion}
                />

                <p className="m-1 text-center text-xl font-medium text-gray-900 ">{articulo.Descripcion}</p>

                <p className="mt-1.5 text-center  font-[Merienda]  text-gray-700">{`Precio: $${articulo.PrecioVenta}`}</p>

                

                {
                articulo.Stock ? <p className="text-black ">{`Stock: ${articulo.Stock}`}</p>
                :
                    articulo.PermiteStockNegativo 
                    ? <p className="text-[#2fc4ff]">{`Stock: ${articulo.Stock}`}</p>
                    : <p className="text-[#FF512F]">{`Stock: ${articulo.Stock}`}</p>
                }

                {/* Boton */}
                <div className="mt-4">

                    <button type="button" onClick={() => AgregarCarrito(articulo)} className={`Degradado w-full h-[3rem] p-4 mb-4 group flex items-center overflow-hidden rounded text-white justify-center`}>

                        <div className="text-sm ml-4 font-medium font-[Merienda] transition-all group-hover:mr-1">
                            Agregar
                        </div>

                        <div className=" translate-x-[8rem] transition-transform duration-300 group-hover:-translate-x-0 group-hover:mr-2 ">

                            <IoCartOutline className="h-5 w-5" />

                        </div>

                    </button>

                </div>

            </div>

            </div>
          </div>
        ))}
      </Slider>
      </div>
      : null}
    </div>
  )

};

export default Carousel;

import React, {useState} from 'react';
import Swal from 'sweetalert2';

const ArticuloCarrito = ({item, modificar, eliminar}) => {

  const [cantidad, setcantidad] = useState(item.Cantidad);


  const AumentarCantidad = (e) => {

    if (e.target.value) {
      const parsedValue = parseFloat(e.target.value);
      if (!Number.isInteger(parsedValue)) {
        console.log("Decimal")
        return;
      }
    }

    if (!item.PermiteStockNegativo) {

      if (e.target.value > item.Stock) {
        Swal.fire({
          icon: 'error',
          title: 'Stock Insuficiente.',
          timer: 2500
        })
        return
      }
      
    }


    setcantidad(e.target.value)

    modificar({id: item.Id, cantidad: e.target.value})
  }

    return (
        <div className="ArticuloCarro p-2 justify-items-center items-center hover:bg-slate-200">
    
            {/* Opitimizar imgane cuando tengas host de imgs */}
            <img loading="lazy" src={item.FotoUrl ?? "./assets/ProductoSinFoto.png"} alt={item.Descripcion} className="imagen" />
    
            <p className='descripcion text-2xl text-gray-600'>{item.Descripcion}</p>

            <p className='precio text-2xl text-gray-600'>{`$${item.PrecioVenta}`}</p>
    
    
            <label  className="stock flex items-center gap-2">
              {
                item.PermiteStockNegativo ? <span className="text-xl text-gray-600">Stock: ❗</span>: <span className="text-xl text-gray-600">Stock: {item.Stock}</span>
              }
              
            </label>

            <label  className="w-full cantidad flex flex-row justify-end items-center gap-2">
              <span className="text-xl text-gray-600 ml-3">Cantidad</span>

              <input
                type="number"
                value={cantidad}
                min={1}
                max={item.PermiteStockNegativo ? null : item.Stock}
                onChange={(e) => AumentarCantidad(e)}
                id={`FilterPriceFrom${item.Id}`}
                className="w-full border border-gray-200 pl-3 hover:border-[#5E69F1] rounded-md shadow-sm focus:outline-none h-[2rem]"
              />
            </label>

    
            <button className="eliminar text-gray-600 transition hover:text-red-600" onClick={() => eliminar(item.Id)}>
              <span className="sr-only">Eliminar</span>
      
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                className="w-8 h-8"
              >
                <path
                  d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                />
              </svg>
            </button>
          
        </div>
      )
}

export default ArticuloCarrito;
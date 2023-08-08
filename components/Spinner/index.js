//https://www.youtube.com/watch?v=Id7GbGUOlFs
//npm i react-loader-spinner
//https://mhnpd.github.io/react-loader-spinner/docs/components/infinity-spin
import React from 'react';
import { InfinitySpin } from  'react-loader-spinner'

export default function Spinner(){

  return (
    
    <div className="loader">
      <span className="loader-text">Cargando..</span>
        <span className="load"></span>
    </div>

  )
}

// export default function Spinner(){

//   return(
//     <InfinitySpin 
//       width='150'
//       color="#407FF6"
//     />
//   )
// }

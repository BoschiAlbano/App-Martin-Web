import '../styles/globals.css'
import { ApolloClient, ApolloProvider, InMemoryCache, HttpLink, defaultDataIdFromObject } from '@apollo/client'
import { SessionProvider } from 'next-auth/react'
import Publicas from 'config'

// Función para personalizar el cache key
const customCacheKey = (responseObject) => {
  //return `${object.__typename}:${'Id'}`;
  switch (responseObject.__typename) {
    case 'Articulo': return `Articulo:${responseObject.Id}`;
    default: return defaultDataIdFromObject(responseObject);
  }
};

const cliente = new ApolloClient({
  cache: new InMemoryCache({
    dataIdFromObject: customCacheKey, // Personalización del cache key
  }),
  link: new HttpLink({
    uri: `${Publicas.NEXT_PUBLIC_HOST}/api/graphql`
  })
})

function MyApp({ Component, pageProps }) {
  return (
    <ApolloProvider client={cliente}>
      <SessionProvider>
        <Component {...pageProps} />
      </SessionProvider>
    </ApolloProvider>
  )
}

export default MyApp

// import '../styles/globals.css'
// import { SessionProvider } from 'next-auth/react'

// import { ApolloClient, ApolloProvider, InMemoryCache, HttpLink, gql } from '@apollo/client'

// import Publicas from 'config'

// const cliente = new ApolloClient({
//   cache: new InMemoryCache(),
//   link: new HttpLink({
//     uri: `${Publicas.NEXT_PUBLIC_HOST}/api/graphql`
//   })
// })

// // uri: 'http://localhost:3000/api/graphql'
// function MyApp({ Component, pageProps }) {
//   return <ApolloProvider client={cliente}>
//     <SessionProvider>
//         <Component {...pageProps} />
//     </SessionProvider>
//   </ApolloProvider>
// }

// export default MyApp

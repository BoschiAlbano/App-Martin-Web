import '../styles/globals.css'
import { SessionProvider } from 'next-auth/react'

import { ApolloClient, ApolloProvider, InMemoryCache, HttpLink, gql } from '@apollo/client'

import Publicas from 'config'

const cliente = new ApolloClient({
  cache: new InMemoryCache(),
  link: new HttpLink({
    uri: `${Publicas.NEXT_PUBLIC_HOST}/api/graphql`
  })
})

// uri: 'http://localhost:3000/api/graphql'
function MyApp({ Component, pageProps }) {
  return <ApolloProvider client={cliente}>
    <SessionProvider>
        <Component {...pageProps} />
    </SessionProvider>
  </ApolloProvider>
}

export default MyApp

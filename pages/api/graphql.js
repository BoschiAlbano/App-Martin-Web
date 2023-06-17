import { ApolloServer } from 'apollo-server-micro';
import Cors from 'micro-cors';

import { typeDefs } from 'graphql/schema';
import { resolvers } from 'graphql/resolvers';

const cors = Cors();

const apolloServer = new ApolloServer({typeDefs, resolvers,
  context: ({ req }) => {
    const isAuthenticated = req.headers.authorization || '';

    if (isAuthenticated !== process.env.CLAVE_ACCESO_API_GRAPHQL) {
      return {isAuthenticated: false}
    }
    return {isAuthenticated: true}
  },
  formatError: (error) => {
    console.log(error.message)
    return error;
  }
})
const startServer = apolloServer.start();

export default cors(async function handler(req, res){
    
    if (req.method === 'OPTIONS') {
        res.end();
        return false;
    }
    
    await startServer;

    await apolloServer.createHandler({
        path: '/api/graphql',
    })(req, res);
});

export const config = {
    api:{
        bodyParser: false,
    },
};
import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { supabase } from './supabase';

const httpLink = createHttpLink({
  uri: import.meta.env.VITE_GRAPHQL_URI || 'http://173.212.199.206:5000/graphql',
});

const authLink = setContext(async (_, { headers }) => {
  // get the authentication token from supabase
  const { data: { session } } = await supabase.auth.getSession();
  const token = session?.access_token;

  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    }
  }
});

export const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          activeVehicles: {
            merge(existing, incoming) {
              return incoming;
            },
          },
        },
      },
    },
  }),
});

import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { BaseURL, APIversion } from '../utility/config';

const httpLink = createHttpLink({
  uri: `${BaseURL}${APIversion}`,
});



const AirportAutoCompletegqlApiclient = (authOdetails: { Authorization?: string }) => {
  const authContextLink = setContext((_, { headers }) => {
    return {
      headers: {
        ...headers,
        'Authorization': authOdetails?.Authorization || '',
      }
    };
  });

  return new ApolloClient({
    link: authContextLink.concat(httpLink),
    cache: new InMemoryCache(),
  });
};

export default AirportAutoCompletegqlApiclient; 
import { ApolloClient, InMemoryCache } from '@apollo/client';
import { BaseURL, APIversion } from "../utility/config";
import { getAuthHeader, AuthOdetails } from '../utility/config/oAuth';

const PolicyConstraintSearchApiClient = (authOdetails: AuthOdetails) => {
  const authToken = getAuthHeader('platformsearch', 'POST', authOdetails);
  const client = new ApolloClient({
    uri: `${BaseURL}${APIversion}platformsearch`,
    headers: {
      "Authorization": authToken?.Authorization,
    },
    cache: new InMemoryCache(),
  });

  return client;
};

export default PolicyConstraintSearchApiClient;

 
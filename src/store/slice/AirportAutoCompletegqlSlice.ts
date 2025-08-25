

import { createApi } from '@reduxjs/toolkit/query/react';
import { gql } from '@apollo/client';
import AirportAutoCompletegqlApiclient from '../AutoCompleteApiclient';
import type { AuthOdetails } from '../../utility/config/oAuth';

// Define the state type for loginSlice
interface LoginState {
  loginSlice?: {
    token?: {
      Response?: {
        Auth1dot0?: {
          AccessToken?: string;
          ConsumerKey?: string;
          ConsumerSecret?: string;
        };
      };
    };
  };
} 

// Define the GraphQL query
const AUTO_COMPLETE_GRAPH_QUERY = gql`
  query AutoCompleteGraph($text: String!, $TextSearch: [String!]) {
    AutoCompleteGraph(
      Request: {
        Context: {
          UserAgent: "isfudsvcjdvxjc"
          TrackingId: "siyagsdua"
          TransactionId: "sjhudwsbdx"
          CountryCode: "IN"
          IpAddress: "190.0.0.1"
        }
        Request: {
          Text: $text
          TextSearch: $TextSearch
          Language: "en"
          AirportsSize: 100
          CitiesSize: 100
          CountriesSize: 100
        }
      }
    ) {
      Context {
        StatusCode
        TrackingId
        Message
        Tte
        TransactionId
      }
      Response {
        Airport {
          Code
          Name
          CityName
          CountryName
        }
        City {
          Code
          Name
          CountryName
        }
        Country {
          Code
          Name
        }
      }
    }
  }
`;

// Create API slice using createApi but call Apollo Client manually
export const flightAutoSearchgqlReducerApi = createApi({
  reducerPath: 'flightAutoSearchgqlReducerApi',
   baseQuery: async ({ query, variables, endpoint }, { getState }) => {
    const state = getState() as LoginState;
    const authOdetails = state?.loginSlice?.token?.Response?.Auth1dot0;
    if (!authOdetails) {
      return {
        error: {
          status: 'AUTH_ERROR',
          message: 'Authentication details not found',
        },
      };
    }
    try {
      const { data } = await AirportAutoCompletegqlApiclient(authOdetails as AuthOdetails).query({
       query,
        variables,
      });
      return { data };  // Return data in the format required by RTK Query
    } catch (error) {
      return {
        error: {
          status: 'CUSTOM_GRAPHQL_ERROR',
          message: (error as Error).message,
        },
      };
    }
  },
  endpoints: (builder) => ({
    // Define the query for AutoCompleteGraph
    getAutoCompleteGraph: builder.query({
      query: (args) => ({
        query: AUTO_COMPLETE_GRAPH_QUERY,
        variables: { text: args.text, TextSearch: args.TextSearch }, // Pass dynamic text here
        endpoint: args.endpoint, // Pass dynamic endpoint here
      }),
    }),
  }),
});

// Export the hook for components to use
export const { useGetAutoCompleteGraphQuery, useLazyGetAutoCompleteGraphQuery } = flightAutoSearchgqlReducerApi;

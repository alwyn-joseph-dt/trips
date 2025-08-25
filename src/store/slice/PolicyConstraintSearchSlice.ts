import { gql } from "@apollo/client";
import { createApi } from "@reduxjs/toolkit/query/react";
import AutoCompleteApiclient from "../AutoCompleteApiclient";
import PolicyConstraintSearchApiClient from "../PolicyConstraintSearchApiClient";

// Create API Slice using createApi but call Apollo Client manually
const AUTO_COMPLETE_GRAPH_QUERY = gql`
  query AutoCompletePolicyConstraintSearch($searchKey: String!) {
    AutoCompletePolicyConstraintSearch(
      Request: {
        Context: {
          UserAgent: "Mozilla/5.0"
          TrackingId: "da865192-197d-4c63-aaa6-568f6001abf6"
          TransactionId: "dd2445d9-bfb2-48c6-9311-cfbba3c32375"
          CountryCode: "IN"
          IpAddress: "192.168.1.1"
        }
        Request: { SearchKey: $searchKey, PolicyConstraintCount: 1000 }
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
        Buckets {
          Name
          PolicyConstraints {
            Id
            Name
            Bucket
          }
        }
      }
    }
  }
`;

export const policyConstraintSearchReducerApi = createApi({
  reducerPath: "policyConstraintSearchReducerApi",
  baseQuery: async ({ query, variables }, { getState }) => {
    try {
      const authOdetails = getState()?.loginSlice?.token?.Response?.Auth1dot0;
      const { data } = await PolicyConstraintSearchApiClient(authOdetails).query({
        query,
        variables,
      });
      return { data };
    } catch (error) {
      return {
        error: {
          status: "CUSTOM_GRAPHQL_ERROR 9",
          message: (error as Error).message,
        },
      };
    }
  },
  endpoints: (builder) => ({
    getPolicyConstraintSearch: builder.query({
      query: (args) => ({
        query: AUTO_COMPLETE_GRAPH_QUERY,
        variables: { searchKey: args.text },
      }),
    }),
  }),
});

// Export the hook to call in components
export const {
  useGetPolicyConstraintSearchQuery,
  useLazyGetPolicyConstraintSearchQuery,
} = policyConstraintSearchReducerApi;

import { createApi } from "@reduxjs/toolkit/query/react";
import { gql } from "@apollo/client";
import AutoCompleteApiclient from "../AutoCompleteApiclient";


const AUTO_COMPLETE_TRIP_SEARCH = gql`
  query AutoCompleteTripSearch($searchKey: String!) {
    AutoCompleteTripSearch(
      Request: {
        Context: {
          UserAgent: "Mozilla/5.0"
          TrackingId: "da865192-197d-4c63-aaa6-568f6001abf6"
          TransactionId: "dd2445d9-bfb2-48c6-9311-cfbba3c32375"
          CountryCode: "IN" 
          IpAddress: "192.168.1.1"
        }
        Request: {
          SearchKey: $searchKey
          ProfilesCount: 30
          OrganizationCount: 30
          TripCount: 30
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
        Profiles {
          TotalCount
          Items {
            Id
            Name
          }
        }
        Trips {
          TotalCount
          Items {
            Id
            TripId
            Name
          }
        }
        Organizations {
          TotalCount
          Items {
            Id
            Name
          }
        }
      }
    }
  }
`;

// Create API Slice using createApi but call Apollo Client manually
// const AUTO_COMPLETE_TRIP_SEARCH = gql`
//  query AutoCompleteApproversSearch($searchKey: String!) {
//     AutoCompleteApproversSearch(
//         Request: {
//             Context: {
//                 UserAgent: "Mozilla/5.0",
//                 TrackingId: "de2ade5e6a0b4c75b44ab079f4f0b0cb",
//                 TransactionId: "3ddf1ed3414146e684c236b69a477b7d",
//                 IpAddress: "192.168.1.1",
//                 CountryCode: "IN"
//         }
//         Request: {
//           SearchKey: $searchKey
//           OrganizationCount: 30
//         }
//       }
//     ) 
//       {
//       Context {
//         StatusCode
//         TrackingId
//         Message
//         Tte
//         TransactionId
//       }
//       Response {
//         Profiles {
//           TotalCount
//           Items {
//             Id
//             Name
//           }
//         }
//         Trips {
//           TotalCount
//           Items {
//             Id
//             TripId
//             Name
//           }
//         }
//         Organizations {
//           TotalCount
//           Items {
//             Id
//             Name
//           }
//         }
//       }
//     }
// }
// `;

export const tripReducerApi = createApi({
  reducerPath: "tripReducerApi",
  baseQuery: async ({ query, variables }, { getState }) => {
    const state = getState();
    const authOdetails = state?.loginSlice?.token?.Response?.Auth1dot0;
    try {
      const { data } = await AutoCompleteApiclient(authOdetails).query({
        query,
        variables,
      });
      return { data };
    } catch (error) {
      return { error: { status: "CUSTOM_GRAPHQL_ERROR", message: error.message } };
    }
  },
  endpoints: (builder) => ({
    getAutoCompleteTripSearch: builder.query({
      query: (args) => ({
        query: AUTO_COMPLETE_TRIP_SEARCH,
        variables: { searchKey: args.searchKey  },
      }),
    }),
  }),
});

// Export the hook to call in components
export const { useGetAutoCompleteTripSearchQuery } = tripReducerApi;
 
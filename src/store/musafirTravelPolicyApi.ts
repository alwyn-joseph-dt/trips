;
/* eslint-disable @typescript-eslint/no-explicit-any */
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { APIversion, BaseURL } from "../utility/config";
import { getAuthHeader } from "../utility/config/oAuth";
import { GetRulesByConstraintIdPayload, GetRulesByConstraintIdResponse } from "../utility/types/vouchers/voucher";

export const musafirTravelPolicyApi = createApi({
  reducerPath: "musafirTravelPolicyApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${BaseURL}${APIversion}`,
    /**
     * Prepares the headers for the API requests by checking if the loginSlice
     * contains a valid access token and adding it to the headers if it does.
     * Also sets the Content-Type to application/json.
     * @param {Headers} headers - The headers to be modified.
     * @param {{ getState: () => any }} api - The api object.
     * @returns {Headers} The modified headers.
     */
    prepareHeaders: (headers) => {
      // Set content type
      headers.set("Content-Type", "application/json");
      return headers;
    },
  }),

  /**
   * Defines the endpoints for the Musafir Travel Policy API.
   * Defines the endpoints for the Musafir Travel Policy API.
   *
   * @param {import("@reduxjs/toolkit/query/react").MutationBuilder} builder - The builder for creating mutations.
   * @returns {Record<string, import("@reduxjs/toolkit/query/react").MutationDefinition<any, any, any>>} The object containing defined endpoints.
   *
   * This includes:
   *
   * - fetchTravelPolicyList: A mutation for fetching Travel Policy Listing data by sending a POST request to the '/api/v1/travelpolicy/list' endpoint with a request body.
   *
   * - createTravelPolicy:  A mutation for creating new Travel Policy by sending a POST request to the '/api/v1/travelpolicy/create' endpoint with a request body.
   */

  endpoints: (builder) => ({
    fetchTravelPolicyList: builder.mutation({
      /**
       * Fetch Travel Policy lists.
       *
       * @param {object} patch - The data to be sent in the request body.
       * @returns {import("@reduxjs/toolkit/query/react").QueryDefinition<any, any, any>} The query definition.
       */
      async queryFn(patch, { getState }: any, _extraOptions, fetchWithBQ) {
        const authOdetails = getState()?.loginSlice?.token?.Response?.Auth1dot0;
        const authToken = getAuthHeader('travelpolicy/list', 'POST', authOdetails,);
        const pageNumber = patch.pageNumber ?? 1;
        const pageSize = patch.pageSize ?? 10;
        const searchText = patch.searchText ?? "";
        const payload = {
          Context: {
            UserAgent: "Mozilla/5.0",
            TrackingId: "de2ade5e6a0b4c75b44ab079f4f0b0cb",
            TransactionId: "3ddf1ed3414146e684c236b69a477b7d",
            IpAddress: "192.168.1.1",
            CountryCode: "US",
          },
          Request: {
            Pagination: {
              PageNumber: pageNumber,
              PageSize: pageSize,
            },
            SearchText: searchText,
          },
        };
        const response = await fetchWithBQ({
          url: `travelpolicy/list`,
          method: "POST",
          body: payload,
          headers: {
            "Authorization": authToken?.Authorization,
          },
        });
        return response;
      },
    }),

    createTravelPolicy: builder.mutation({
      /**
       * Create Travel Policy.
       *
       * @param {object} patch - The data to be sent in the request body.
       * @returns {import("@reduxjs/toolkit/query/react").QueryDefinition<any, any, any>} The query definition.
       */

      async queryFn(patch, { getState }: any, _extraOptions, fetchWithBQ) {
        const authOdetails = getState()?.loginSlice?.token?.Response?.Auth1dot0;
        const authToken = getAuthHeader('travelpolicy/create', 'POST', authOdetails,);
        const payload = {
          Context: {
            UserAgent: "Mozilla/5.0",
            TrackingId: "ac38544e-5f95-4c79-bb84-c284e7e3d6a7",
            TransactionId: "ac38544e-5f95-4c79-bb84-c284e7e3d6a7",
            CountryCode: "IN",
            IpAddress: "127.0.0.1",
          },
          Request: patch,
        };
        const response = await fetchWithBQ({
          url: `travelpolicy/create`,
          method: "POST",
          body: payload,
          headers: {
            "Authorization": authToken?.Authorization,
          },
        });
        return response;
      },
    }),

    fetchGroups: builder.mutation({
      /**
       * Fetch Groups.
       *
       * @param {object} patch - The data to be sent in the request body.
       * @returns {import("@reduxjs/toolkit/query/react").QueryDefinition<any, any, any>} The query definition.
       */

      async queryFn(_patch, { getState }: any, _extraOptions, fetchWithBQ) {
        const authOdetails = getState()?.loginSlice?.token?.Response?.Auth1dot0;
        const authToken = getAuthHeader('platformsearch/groups', 'POST', authOdetails,);
        const payload = {
          UserAgent: "Mozilla/5.0",
          TrackingId: "de2ade5e6a0b4c75b44ab079f4f0b0cb",
          TransactionId: "019473a9-5977-761b-b608-11ab070f281a",
          IpAddress: "192.168.1.1",
          CountryCode: "IN",
        };
        const response = await fetchWithBQ({
          url: `platformsearch/groups`,
          method: "POST",
          body: payload,
          headers: {
            "Authorization": authToken?.Authorization,
          },
        });
        return response;
      },
    }),

    getAllUserSegments: builder.mutation({
      /**
       * Get All User Segments.
       *
       * @param {object} patch - The data to be sent in the request body.
       * @returns {import("@reduxjs/toolkit/query/react").QueryDefinition<any, any, any>} The query definition.
       */
      async queryFn(_patch, { getState }: any, _extraOptions, fetchWithBQ) {
        const authOdetails = getState()?.loginSlice?.token?.Response?.Auth1dot0;
        const authToken = getAuthHeader('platformsearch/usersegment/getall', 'POST', authOdetails,);
        const payload = {
          UserAgent: "Mozilla/5.0",
          TrackingId: "de2ade5e6a0b4c75b44ab079f4f0b0cb",
          TransactionId: "019473a9-5977-761b-b608-11ab070f281a",
          IpAddress: "192.168.1.1",
          CountryCode: "IN",
        };
        const response = await fetchWithBQ({
          url: `platformsearch/usersegment/getall`,
          method: "POST",
          body: payload,
          headers: {
            "Authorization": authToken?.Authorization,
          },
        });
        return response;
      },
    }),

    getrulesbyconstraintid: builder.mutation<GetRulesByConstraintIdResponse, GetRulesByConstraintIdPayload>({
      /**
       * Get Rules by Constraint Id.
       *
       * @param {object} id - The PolicyConstraintId to be sent in the request body.
       * @returns {import("@reduxjs/toolkit/query/react").QueryDefinition<any, any, any>} The query definition.
       *
       */
      async queryFn(patch, { getState }: any, _extraOptions, fetchWithBQ) {
        const authOdetails = getState()?.loginSlice?.token?.Response?.Auth1dot0;
        const authToken = getAuthHeader('policyconstraint/getrulesbyconstraintid', 'POST', authOdetails,);
        const payload = {
          Context: {
            UserAgent: "Mozilla/5.0",
            TrackingId: "de2ade5e6a0b4c75b44ab079f4f0b0cb",
            TransactionId: "de2ade5e6a0b4c75b44ab079f4f0b0cb",
            IpAddress: "192.168.1.1",
            CountryCode: "IN",
          },
          Request: {
            PolicyConstraintId: patch,
            Scope: "TravelPolicy",
          },
        };
        const response = await fetchWithBQ({
          url: `policyconstraint/getrulesbyconstraintid`,
          method: "POST",
          body: payload,
          headers: {
            "Authorization": authToken?.Authorization,
          },
        });
        return response;
      },
    }),
    editTravelPolicy: builder.mutation({
      /**
       * Create Travel Policy.
       *
       * @param {object} patch - The data to be sent in the request body.
       * @returns {import("@reduxjs/toolkit/query/react").QueryDefinition<any, any, any>} The query definition.
       */
      async queryFn(patch, { getState }: any, _extraOptions, fetchWithBQ) {
        const authOdetails = getState()?.loginSlice?.token?.Response?.Auth1dot0;
        const authToken = getAuthHeader('travelpolicy/edit', 'POST', authOdetails,);
        const payload = {
          Context: {
            UserAgent: "Mozilla/5.0",
            TrackingId: "ac38544e-5f95-4c79-bb84-c284e7e3d6a7",
            TransactionId: "ac38544e-5f95-4c79-bb84-c284e7e3d6a7",
            CountryCode: "IN",
            IpAddress: "127.0.0.1",
          },
          Request: patch,
        };
        const response = await fetchWithBQ({
          url: `travelpolicy/edit`,
          method: "POST",
          body: payload,
          headers: {
            "Authorization": authToken?.Authorization,
          },
        });
        return response;
      },
    }),
    getTravelPolicyById: builder.mutation({
      /**
       * Create Travel Policy.
       *
       * @param {object} patch - The data to be sent in the request body.
       * @returns {import("@reduxjs/toolkit/query/react").QueryDefinition<any, any, any>} The query definition.
       */

      async queryFn(patch, { getState }: any, _extraOptions, fetchWithBQ) {
        const authOdetails = getState()?.loginSlice?.token?.Response?.Auth1dot0;
        const authToken = getAuthHeader('travelpolicy/get', 'POST', authOdetails,);
        const payload = {
          Context: {
            UserAgent: "Mozilla/5.0",
            TrackingId: "ac38544e-5f95-4c79-bb84-c284e7e3d6a7",
            TransactionId: "ac38544e-5f95-4c79-bb84-c284e7e3d6a7",
            CountryCode: "IN",
            IpAddress: "127.0.0.1",
          },
          Request: patch,
        };
        const response = await fetchWithBQ({
          url: `travelpolicy/get`,
          method: "POST",
          body: payload,
          headers: {
            "Authorization": authToken?.Authorization,
          },
        });
        return response;
      },
    }),
    setAsDefaultPolicy: builder.mutation({
      /**
       * Toggle Travel Policy Status (Enable/Disable).
       *
       * @param {object} patch - The data to be sent in the request body.
       * @returns {import("@reduxjs/toolkit/query/react").QueryDefinition<any, any, any>} The query definition.
       */

      async queryFn(patch, { getState }: any, _extraOptions, fetchWithBQ) {
        const authOdetails = getState()?.loginSlice?.token?.Response?.Auth1dot0;
        const authToken = getAuthHeader('travelpolicy/setdefault', 'POST', authOdetails,);
        const payload = {
          Context: {
            UserAgent: "Mozilla/5.0",
            TrackingId: "de2ade5e6a0b4c75b44ab079f4f0b0cb",
            TransactionId: "3ddf1ed3414146e684c236b69a477b7d",
            IpAddress: "192.168.1.1",
            CountryCode: "US",
          },
          Request: {
            TravelPolicyId: patch,
          },
        };
        const response = await fetchWithBQ({
          url: `travelpolicy/setdefault`,
          method: "POST",
          body: payload,
          headers: {
            "Authorization": authToken?.Authorization,
          },
        });
        return response;
      },
    }),
    createDuplicatePolicy: builder.mutation({
      /**
       * Toggle Travel Policy Status (Enable/Disable).
       *
       * @param {object} patch - The data to be sent in the request body.
       * @returns {import("@reduxjs/toolkit/query/react").QueryDefinition<any, any, any>} The query definition.
       */
      async queryFn(patch, { getState }: any, _extraOptions, fetchWithBQ) {
        const authOdetails = getState()?.loginSlice?.token?.Response?.Auth1dot0;
        const authToken = getAuthHeader('travelpolicy/duplicate', 'POST', authOdetails,);
        const payload = {
          Context: {
            UserAgent: "Mozilla/5.0",
            TrackingId: "de2ade5e6a0b4c75b44ab079f4f0b0cb",
            TransactionId: "3ddf1ed3414146e684c236b69a477b7d",
            IpAddress: "192.168.1.1",
            CountryCode: "US",
          },
          Request: {
            TravelPolicyId: patch,
          },
        };
        const response = await fetchWithBQ({
          url: `travelpolicy/duplicate`,
          method: "POST",
          body: payload,
          headers: {
            "Authorization": authToken?.Authorization,
          },
        });
        return response;
      },
    }),
    policyStatusUpdate: builder.mutation({
      /**
       * Travel Policy Status Update (active/Inactive/Archived).
       *
       * @param {object} patch - The data to be sent in the request body.
       * @returns {import("@reduxjs/toolkit/query/react").QueryDefinition<any, any, any>} The query definition.
       */
      async queryFn(patch, { getState }: any, _extraOptions, fetchWithBQ) {
        const authOdetails = getState()?.loginSlice?.token?.Response?.Auth1dot0;
        const authToken = getAuthHeader('travelpolicy/statusupdate', 'POST', authOdetails,);
        const response = await fetchWithBQ({
          url: `travelpolicy/statusupdate`,
          method: "POST",
          body: patch,
          headers: {
            "Authorization": authToken?.Authorization,
          },
        });
        return response;
      },
    }),
  }),
});

export const {
  useFetchTravelPolicyListMutation,
  useCreateTravelPolicyMutation,
  useFetchGroupsMutation,
  useGetAllUserSegmentsMutation,
  useGetrulesbyconstraintidMutation,
  useEditTravelPolicyMutation,
  useGetTravelPolicyByIdMutation,
  useSetAsDefaultPolicyMutation,
  useCreateDuplicatePolicyMutation,
  usePolicyStatusUpdateMutation,
} = musafirTravelPolicyApi;
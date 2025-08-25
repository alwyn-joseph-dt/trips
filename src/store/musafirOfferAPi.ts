/* eslint-disable @typescript-eslint/no-explicit-any */
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { APIversion, BaseURL } from "../utility/config";
import { getAuthHeader } from "../utility/config/oAuth";
import { debugApiAuthData } from "../utility/debugAuth";
import { CreateOfferPayload, CreateOfferResponse, ErrorResponse, ExportOfferPayload, ExportOfferResponse, FetchOfferPayload, FetchOfferResponse, GeneralLedgerResponse, GenerateCodesPayload, GenerateCodesResponse, GetOfferByIdPayload, GetOfferByIdResponse, ResponseContext, StatusUpdatePayload } from "../utility/types/offer/offer";

export const musafirOfferApi = createApi({

  reducerPath: "musafirOfferApi",
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
      headers.set("Content-Type", "application/json");
      return headers;
    },
  }),

  /**
   * Defines the endpoints for the Musafir User API.
   *
   * @param {import("@reduxjs/toolkit/query/react").MutationBuilder} builder - The builder for creating mutations.
   * @returns {Record<string, import("@reduxjs/toolkit/query/react").MutationDefinition<any, any, any>>}
   *          The object containing defined endpoints.
   *
   * This includes:
   * - fetchUsers: A mutation for fetching user data by sending a POST request to the '/api/v1/user/Users' endpoint with a request body.
   */
  endpoints: (builder) => ({
    generateCodes:
      builder.mutation<GenerateCodesResponse, GenerateCodesPayload>({
      async queryFn(patch, { getState }: any, _extraOptions, fetchWithBQ) {
        const authOdetails = getState()?.loginSlice?.token?.Response?.Auth1dot0;
        debugApiAuthData('platform/generate/couponcodes', 'POST');
        const authToken = getAuthHeader('platform/generate/couponcodes', 'POST', authOdetails,);
        const response = await fetchWithBQ({
          url: `platform/generate/couponcodes`,
          method: "POST",
          body: patch,
          headers: {
            "Authorization": authToken?.Authorization,
          },
        });
        return { data: response.data as GenerateCodesResponse }
      }
    }),
    offerGetById: builder.mutation<GetOfferByIdResponse, GetOfferByIdPayload>({
      async queryFn(patch, { getState }: any, _extraOptions, fetchWithBQ) {
        const authOdetails = getState()?.loginSlice?.token?.Response?.Auth1dot0;
        debugApiAuthData('offer/get', 'POST');
        const authToken = getAuthHeader('offer/get', 'POST', authOdetails,);
        const response = await fetchWithBQ({
          url: `offer/get`,
          method: "POST",
          body: patch,
          headers: {
            "Authorization": authToken?.Authorization,
          },
        });
        return { data: response.data as GetOfferByIdResponse }
      }
    }),
    fetchOfferListing: builder.mutation<FetchOfferResponse, FetchOfferPayload>({
      async queryFn(patch, { getState }: any, _extraOptions, fetchWithBQ) {
        const authOdetails = getState()?.loginSlice?.token?.Response?.Auth1dot0;
        debugApiAuthData('offer/list', 'POST');
        const authToken = getAuthHeader('offer/list', 'POST', authOdetails,);
        const response = await fetchWithBQ({
          url: `offer/list`,
          method: "POST",
          body: patch,
          headers: {
            "Authorization": authToken?.Authorization,
          },
        });
        return { data: response.data as FetchOfferResponse }
      }
    }),
    offerExport: builder.mutation<ExportOfferResponse, ExportOfferPayload>({
      async queryFn(patch, { getState }: any, _extraOptions, fetchWithBQ) {
        const authOdetails = getState()?.loginSlice?.token?.Response?.Auth1dot0;
        debugApiAuthData('offer/export', 'POST');
        const authToken = getAuthHeader('offer/export', 'POST', authOdetails,);
        const response = await fetchWithBQ({
          url: `offer/export`,
          method: "POST",
          body: patch,
          headers: {
            "Authorization": authToken?.Authorization,
          },
        });
        return { data: response.data as ExportOfferResponse }
      }
    }),
    createOffer: builder.mutation<CreateOfferResponse | ErrorResponse, CreateOfferPayload>({
      async queryFn(patch, { getState }: any, _extraOptions, fetchWithBQ) {
        const authOdetails = getState()?.loginSlice?.token?.Response?.Auth1dot0;
        debugApiAuthData('offer/create', 'POST');
        const authToken = getAuthHeader('offer/create', 'POST', authOdetails,);
        const response = await fetchWithBQ({
          url: `offer/create`,
          method: "POST",
          body: patch,
          headers: {
            "Authorization": authToken?.Authorization,
          },
        });
        if (response.error) {
          return {
            data: response.error.data as ErrorResponse,
          };
        }
        return { data: response.data as CreateOfferResponse }
      }
    }),

    editOffer: builder.mutation<CreateOfferResponse | ErrorResponse, CreateOfferPayload>({
      async queryFn(patch, { getState }: any, _extraOptions, fetchWithBQ) {
        const authOdetails = getState()?.loginSlice?.token?.Response?.Auth1dot0;
        debugApiAuthData('offer/edit', 'POST');
        const authToken = getAuthHeader('offer/edit', 'POST', authOdetails,);
        const response = await fetchWithBQ({
          url: `offer/edit`,
          method: "POST",
          body: patch,
          headers: {
            "Authorization": authToken?.Authorization,
          },
        });
        if (response.error) {
          return {
            data: response.error.data as ErrorResponse,
          };
        }
        return { data: response.data as CreateOfferResponse }
      }
    }),

    getGeneralLedger: builder.query<GeneralLedgerResponse, void>({
      async queryFn(_patch, { getState }: any, _extraOptions, fetchWithBQ) {
        const authOdetails = getState()?.loginSlice?.token?.Response?.Auth1dot0;
        debugApiAuthData('generalledger/getall', 'GET');
        const authToken = getAuthHeader('generalledger/getall', 'GET', authOdetails,);
        const response = await fetchWithBQ({
          url: `generalledger/getall`,
          method: "GET",
          headers: {
            "Authorization": authToken?.Authorization,
          },
        });
        return { data: response.data as GeneralLedgerResponse };
      }
    }),

    statusUpdate: builder.mutation<{ Context: ResponseContext }, StatusUpdatePayload>({
      async queryFn(patch, { getState }: any, _extraOptions, fetchWithBQ) {
        const authOdetails = getState()?.loginSlice?.token?.Response?.Auth1dot0;
        const authToken = getAuthHeader('offer/statusupdate', 'POST', authOdetails,);
        const response = await fetchWithBQ({
          url: `offer/statusupdate`,
          method: "POST",
          body: patch,
          headers: {
            "Authorization": authToken?.Authorization,
          },
        });
        return { data: response.data as { Context: ResponseContext } }
      }
    })
  })
});

export const {
  useGenerateCodesMutation,
  useOfferGetByIdMutation,
  useCreateOfferMutation,
  useFetchOfferListingMutation, useOfferExportMutation, useEditOfferMutation,
  useGetGeneralLedgerQuery, useStatusUpdateMutation,
} = musafirOfferApi;

/* eslint-disable @typescript-eslint/no-explicit-any */
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { APIversion, BaseURL } from "../utility/config";
import { getAuthHeader } from "../utility/config/oAuth";
import { CreateVoucherPayload, CreateVoucherResponse, ErrorResponse, FetchVoucherPayload, FetchVoucherResponse, GeneralLedgerResponse, GenerateCodesPayload, GenerateCodesResponse, GetVoucherByIdPayload, GetVoucherByIdResponse, ResponseContext, StatusUpdatePayload } from "../utility/types/vouchers/voucher";

export const musafirVoucherApi = createApi({
  reducerPath: "musafirVoucherApi",
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
    generateCodes: builder.mutation<GenerateCodesResponse, GenerateCodesPayload>({
      async queryFn(patch, { getState }: any, _extraOptions, fetchWithBQ) {
        const authOdetails = getState()?.loginSlice?.token?.Response?.Auth1dot0;
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
    voucherGetById: builder.mutation<GetVoucherByIdResponse, GetVoucherByIdPayload>({
      async queryFn(patch, { getState }: any, _extraOptions, fetchWithBQ) {
        const authOdetails = getState()?.loginSlice?.token?.Response?.Auth1dot0;
        const authToken = getAuthHeader('voucher/get', 'POST', authOdetails,);
        const response = await fetchWithBQ({
          url: `voucher/get`,
          method: "POST",
          body: patch,
          headers: {
            "Authorization": authToken?.Authorization,
          },
        });
        return { data: response.data as GetVoucherByIdResponse }
      }
    }),
    fetchVoucherListing: builder.mutation<FetchVoucherResponse, FetchVoucherPayload>({
      async queryFn(patch, { getState }: any, _extraOptions, fetchWithBQ) {
        const authOdetails = getState()?.loginSlice?.token?.Response?.Auth1dot0;
        const authToken = getAuthHeader('voucher/list', 'POST', authOdetails,);
        const response = await fetchWithBQ({
          url: `voucher/list`,
          method: "POST",
          body: patch,
          headers: {
            "Authorization": authToken?.Authorization,
          },
        });
        return { data: response.data as FetchVoucherResponse }
      }
    }),
    voucherExport: builder.mutation({
      async queryFn(patch, { getState }: any, _extraOptions, fetchWithBQ) {
        const authOdetails = getState()?.loginSlice?.token?.Response?.Auth1dot0;
        const authToken = getAuthHeader('voucher/export', 'POST', authOdetails,);
        const response = await fetchWithBQ({
          url: `voucher/export`,
          method: "POST",
          body: patch,
          headers: {
            "Authorization": authToken?.Authorization,
          },
        });
        return { data: response.data as FetchVoucherResponse }
      }
    }),
    createVoucher: builder.mutation<CreateVoucherResponse | ErrorResponse, CreateVoucherPayload>({
      async queryFn(patch, { getState }: any, _extraOptions, fetchWithBQ) {
        const authOdetails = getState()?.loginSlice?.token?.Response?.Auth1dot0;
        const authToken = getAuthHeader('voucher/create', 'POST', authOdetails,);
        const response = await fetchWithBQ({
          url: `voucher/create`,
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
        return { data: response.data as CreateVoucherResponse }
      }
    }),

    editVoucher: builder.mutation<CreateVoucherResponse | ErrorResponse, CreateVoucherPayload>({
      async queryFn(patch, { getState }: any, _extraOptions, fetchWithBQ) {
        const authOdetails = getState()?.loginSlice?.token?.Response?.Auth1dot0;
        const authToken = getAuthHeader('voucher/edit', 'POST', authOdetails,);
        const response = await fetchWithBQ({
          url: `voucher/edit`,
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
        return { data: response.data as CreateVoucherResponse }
      }
    }),
    getGeneralLedger: builder.query<GeneralLedgerResponse, void>({
      async queryFn(_patch, { getState }: any, _extraOptions, fetchWithBQ) {
        const authOdetails = getState()?.loginSlice?.token?.Response?.Auth1dot0;
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
        const authToken = getAuthHeader('voucher/statusupdate', 'POST', authOdetails,);
        const response = await fetchWithBQ({
          url: `voucher/statusupdate`,
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
  useGenerateCodesMutation, useVoucherGetByIdMutation, useFetchVoucherListingMutation, useVoucherExportMutation, useCreateVoucherMutation, useEditVoucherMutation, useGetGeneralLedgerQuery, useStatusUpdateMutation
} = musafirVoucherApi;
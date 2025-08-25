import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { APIversion, BaseURL } from "../utility/config/index";
import { getAuthHeader } from "../utility/config/oAuth";
import { FetchAirlinePayload, FetchAirlineResponse, FetchCCPayload, FetchCCResponse, FetchMetaDataResponse } from "../utility/types/pricing-policy/PricingPolicy";

export const musafirFlightLookupApi = createApi({
    reducerPath: "musafirFlightLookupApi",
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
      * Defines the endpoints for the API.
      *
      * @param {import("@reduxjs/toolkit/query/react").MutationBuilder} builder - The builder for the mutation.
      * @returns {Record<string, import("@reduxjs/toolkit/query/react").MutationDefinition<any, any, any>>} The endpoints.
      */
    endpoints: (builder) => ({


        // fetchAirport: builder.query({
        //     /**
        //      * Fetches the list of Airports using a POST request with a structured body.
        //      *
        //      * @returns {import("@reduxjs/toolkit/query/react").QueryDefinition<any, any, any>} The query definition.
        //      */
        //     query: ({ context, request }) => ({
        //         url: `flight/search/airports`, // No query parameters
        //         method: 'POST',
        //         body: {
        //             Context: context,
        //             Request: request,
        //         },
        //         headers: {
        //             'Content-Type': 'application/json',
        //         },
        //     }),
        // }),
        fetchAirports: builder.mutation({
            /**
             * Fetches the market data from the server.
             *
             * @param {object} patch - The data to be sent in the request body.
             * @returns {import("@reduxjs/toolkit/query/react").QueryDefinition<any, any, any>} The query definition.
             */
            async queryFn(patch, { getState }: any, _extraOptions, fetchWithBQ) {
                // const authOdetails = getState()?.loginSlice?.token?.Response?.Auth1dot0;
                const authToken = getAuthHeader(`flight/meta/airports`, 'POST',);
                const response = await fetchWithBQ({
                    url: `flight/meta/airports`,
                    method: "POST",
                    body: patch,
                    headers: {
                        "Authorization": authToken?.Authorization,
                    },
                });
                return response;
            }
        }),
        fetchCabinClass: builder.mutation<FetchCCResponse, FetchCCPayload>({
            async queryFn(patch, { getState }: any, _extraOptions, fetchWithBQ) {
                const authOdetails = getState()?.loginSlice?.token?.Response?.Auth1dot0;
                const authToken = getAuthHeader(`flight/meta/cabinclasses`, 'POST', authOdetails,);
                const response = await fetchWithBQ({
                    url: `flight/meta/cabinclasses`,
                    method: "POST",
                    body: patch,
                    headers: {
                        "Authorization": authToken?.Authorization,
                    },
                });
                return response;
            }
        }),
        fetchAirline: builder.mutation<FetchAirlineResponse, FetchAirlinePayload>({

            /**
             * Fetches the list of Airlines from the server.
             *
             * @returns {import("@reduxjs/toolkit/query/react").QueryDefinition<any, any, any>} The query definition.
             */
            async queryFn({ patch, endpoint }, { getState }: any, extraOptions, fetchWithBQ) {
                const authOdetails = getState()?.loginSlice?.token?.Response?.Auth1dot0;
                const authToken = getAuthHeader(endpoint?.startsWith('/') ? endpoint.substring(1) : endpoint, 'POST', authOdetails,);
                const response = await fetchWithBQ({
                    url: endpoint?.startsWith('/') ? endpoint.substring(1) : endpoint,
                    method: "POST",
                    body: patch,
                    headers: {
                        "Authorization": authToken?.Authorization,
                    },
                });
                return response;
            }
        }),
        fetchPax: builder.mutation({
            async queryFn(patch, { getState }: any, _extraOptions, fetchWithBQ) {
                const authOdetails = getState()?.loginSlice?.token?.Response?.Auth1dot0;
                const authToken = getAuthHeader(`flight/meta/paxdetails`, 'POST', authOdetails,);
                const response = await fetchWithBQ({
                    url: `flight/meta/paxdetails`,
                    method: "POST",
                    body: patch,
                    headers: {
                        "Authorization": authToken?.Authorization,
                    },
                });
                return response;
            }
        }),
        fetchflights: builder.query({
            async queryFn(patch, { getState }: any, _extraOptions, fetchWithBQ) {
                const authOdetails = getState()?.loginSlice?.token?.Response?.Auth1dot0;
                const authToken = getAuthHeader(`flight/listing`, 'POST', authOdetails,);
                const response = await fetchWithBQ({
                    url: `flight/listing`,
                    method: "POST",
                    body: patch,
                    headers: {
                        "Authorization": authToken?.Authorization,
                    },
                });
                return response;
            }
        }),
        autoCompleteSearch: builder.mutation({
            async queryFn(patch, { getState }: any, _extraOptions, fetchWithBQ) {
                const authOdetails = getState()?.loginSlice?.token?.Response?.Auth1dot0;
                const authToken = getAuthHeader(`meta/autocomplete/search`, 'POST', authOdetails,);
                const response = await fetchWithBQ({
                    url: `meta/autocomplete/search`,
                    method: "POST",
                    body: patch,
                    headers: {
                        "Authorization": authToken?.Authorization,
                    },
                });
                return response;
            }
        }),
        fetchMetaData: builder.query<FetchMetaDataResponse, void>({
            /**
             * Fetches the metadata from the server.
             *
             * @returns {import("@reduxjs/toolkit/query/react").QueryDefinition<any, any, any>} The query definition.
             */
            async queryFn(_patch, { getState }: any, _extraOptions, fetchWithBQ) {
                const authOdetails = getState()?.loginSlice?.token?.Response?.Auth1dot0;
                const authToken = getAuthHeader(`flight/meta/data`, 'GET', authOdetails,);
                const response = await fetchWithBQ({
                    url: `flight/meta/data`,
                    method: "GET",
                    headers: {
                        "Authorization": authToken?.Authorization,
                    },
                });
                return response;
            }
        })
    }),
});


export const {
    useFetchAirportsMutation,
    useFetchAirlineMutation,
    useFetchCabinClassMutation,
    useFetchPaxMutation,
    useFetchflightsQuery,
    useFetchMetaDataQuery,
    useAutoCompleteSearchMutation
} = musafirFlightLookupApi;
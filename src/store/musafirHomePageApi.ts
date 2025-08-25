import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { APIversion, BaseURL } from "../utility/config/index";
import { getAuthHeader } from "../utility/config/oAuth";
export const musafirHomePageApi = createApi({
    reducerPath: "musafirHomePageApi",
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
        platformSearch: builder.mutation({
            async queryFn(patch, { getState }: any, _extraOptions, fetchWithBQ) {
                const authOdetails = getState()?.loginSlice?.token?.Response?.Auth1dot0;
                const authToken = getAuthHeader('/platform/search', 'POST', authOdetails,);
                const response = await fetchWithBQ({
                    url: `/platform/search`,
                    method: "POST",
                    body: patch,
                    headers: {
                        "Authorization": authToken?.Authorization,
                    },
                });
                return response;
            },
        }),
        countryList: builder.mutation({
            async queryFn(patch, { getState }: any, _extraOptions, fetchWithBQ) {
                const authOdetails = getState()?.loginSlice?.token?.Response?.Auth1dot0;
                const authToken = getAuthHeader('countries/listing', 'POST', authOdetails,);
                const response = await fetchWithBQ({
                    url: `countries/listing`,
                    method: "POST",
                    body: patch,
                    headers: {
                        "Authorization": authToken?.Authorization,
                    },
                });
                return response;
            },
        }),
        menuList: builder.query({
            async queryFn(_patch, { getState }: any, _extraOptions, fetchWithBQ) {
                const authOdetails = getState()?.loginSlice?.token?.Response?.Auth1dot0;
                const authToken = getAuthHeader('home/menu', 'GET', authOdetails,);
                const response = await fetchWithBQ({
                    url: `home/menu`,
                    method: "GET",
                    headers: {
                        "Authorization": authToken?.Authorization,
                    },
                });

                return response;
            },
        }),
        languageList: builder.query({
            async queryFn(_patch, { getState }: any, _extraOptions, fetchWithBQ) {
                const authOdetails = getState()?.loginSlice?.token?.Response?.Auth1dot0;
                const authToken = getAuthHeader('languages/list', 'GET', authOdetails,);
                const response = await fetchWithBQ({
                    url: `languages/list`,
                    method: "GET",
                    headers: {
                        "Authorization": authToken?.Authorization,
                    },
                });
                return response;
            },
        }),
        currencyList: builder.query({
            async queryFn(_patch, { getState }: any, _extraOptions, fetchWithBQ) {
                const authOdetails = getState()?.loginSlice?.token?.Response?.Auth1dot0;
                const authToken = getAuthHeader('currencies/list', 'GET', authOdetails,);
                const response = await fetchWithBQ({
                    url: `currencies/list`,
                    method: "GET",
                    headers: {
                        "Authorization": authToken?.Authorization,
                    },
                });
                if (response?.data?.Response?.Currencies?.length > 0) {
                    localStorage.setItem("currency", JSON.stringify(response?.data?.Response?.Currencies?.[0]));
                }
                return response;
            },
        }),
    })


})
export const {
    usePlatformSearchMutation,
    useCountryListMutation,
    useMenuListQuery,
    useLanguageListQuery,
    useCurrencyListQuery
} = musafirHomePageApi;
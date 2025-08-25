import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { APIversion, BaseURL } from "../utility/config";
import { getAuthHeader } from "../utility/config/oAuth";


export const musafirMyTripsApi = createApi({
    reducerPath: "musafirMyTripsApi",
    baseQuery: fetchBaseQuery({
        baseUrl: `${BaseURL}${APIversion}`,
        prepareHeaders: (headers) => {
            headers.set("Content-Type", "application/json");
            headers.set("ProfileId", "678f8dade615c41c8efda809");
            return headers;
        }
    }),
    endpoints: (builder) => ({
        fetchMyTrips: builder.mutation({
            async queryFn(patch, { getState }: any, _extraOptions, fetchWithBQ) {
                const authOdetails = getState()?.loginSlice?.token?.Response?.Auth1dot0;
                const authToken = getAuthHeader('trip/listing', 'POST', authOdetails,);
                const response = await fetchWithBQ({
                    url: `trip/listing`,
                    method: "POST",
                    body: patch,
                    headers: {
                        "Authorization": authToken?.Authorization,
                    },
                });
                return response;
            },

        }),

        fetchCount: builder.mutation({
            async queryFn(patch, { getState }: any, _extraOptions, fetchWithBQ) {
                const authOdetails = getState()?.loginSlice?.token?.Response?.Auth1dot0;
                const authToken = getAuthHeader('trip/count', 'POST', authOdetails,);
                const response = await fetchWithBQ({
                    url: `trip/count`,
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

export const { useFetchMyTripsMutation, useFetchCountMutation } = musafirMyTripsApi;


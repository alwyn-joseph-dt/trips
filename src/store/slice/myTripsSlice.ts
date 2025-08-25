import { createSlice } from "@reduxjs/toolkit";
import { musafirMyTripsApi } from "../musafirMyTripsApi";

const initialState: any = {
    myTripData: {},
    loading: false,
};

export const myTripsSlice = createSlice({
    name: "myTripsSlice",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addMatcher(musafirMyTripsApi.endpoints.fetchMyTrips.matchPending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addMatcher(musafirMyTripsApi.endpoints.fetchMyTrips.matchFulfilled, (state, { payload }) => {
                state.aclData = payload;
                state.loading = false;
            })
            .addMatcher(musafirMyTripsApi.endpoints.fetchMyTrips.matchRejected, (state, { error }) => {
                state.loading = false;
                state.error = error;
            })
            .addMatcher(musafirMyTripsApi.endpoints.fetchCount.matchPending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addMatcher(musafirMyTripsApi.endpoints.fetchCount.matchFulfilled, (state, { payload }) => {
                state.aclData = payload;
                state.loading = false;
            })
            .addMatcher(musafirMyTripsApi.endpoints.fetchCount.matchRejected, (state, { error }) => {
                state.loading = false;
                state.error = error;
            });
    },
});

export default myTripsSlice.reducer;
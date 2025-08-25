import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {FlightSearchPayload} from "../../utility/types/flights/flight-search/FlightSearch";


const initialState: FlightSearchPayload = {
    currency: "",
    language: "",
    destinationInfo:[],
    pax:{
        adult:0,
        child:0,
        infant:0
    },
    filters: {
        cabinPreference: [""],
        stopOver: [""],
        airlines: [""],
        discountCodes: [
            {
                tmcId: "",
                organizationId:"",  
                supplierCode:  "",
            }
        ],
        recommendedFlights: [],

    },
    tripType: "",
};

export const flightSearchSlice = createSlice({
    name: "flightSearchSlice",
    initialState,
    reducers: {
        setSearchData: (state, action: PayloadAction<FlightSearchPayload>) => {
            return action.payload;
        },
        setFieldData: <T extends keyof FlightSearchPayload>(
            state: FlightSearchPayload,
            action: PayloadAction<{ key: T; value: any }>
          ) => {
            const { key, value } = action.payload;
            state[key] = value; // Dynamically updates the field with new value
          },
          updateDestinationInfo: (state, action: PayloadAction<any[]>) => {
            state.destinationInfo = action.payload; // Dynamically set the destination info
          },
    },

});

export const { setSearchData, setFieldData, updateDestinationInfo } = flightSearchSlice.actions;
export default flightSearchSlice.reducer;
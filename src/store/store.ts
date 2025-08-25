import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";

import { musafirVoucherApi } from "./musafirVoucherApi";
import { policyConstraintSearchReducerApi } from "./slice/PolicyConstraintSearchSlice";
import { musafirTravelPolicyApi } from "./musafirTravelPolicyApi";
import { musafirHomePageApi } from "./musafirHomePageApi";
import { tripReducerApi } from "./slice/AutoCompleteTripSearch";
import { musafirMyTripsApi } from "./musafirMyTripsApi";
import { loginSlice } from "./slice/LoginSlice";
import { musafirFlightLookupApi } from "./musafirFlightLookupApi";

const appReducer = combineReducers({
  [musafirVoucherApi.reducerPath]: musafirVoucherApi.reducer,
    [policyConstraintSearchReducerApi.reducerPath]:
    policyConstraintSearchReducerApi.reducer,
      [musafirTravelPolicyApi.reducerPath]: musafirTravelPolicyApi.reducer,
        [musafirHomePageApi.reducerPath]: musafirHomePageApi.reducer,
          [tripReducerApi.reducerPath]: tripReducerApi.reducer,
            [musafirMyTripsApi.reducerPath]: musafirMyTripsApi.reducer,
              [musafirFlightLookupApi.reducerPath]: musafirFlightLookupApi.reducer,
  loginSlice: loginSlice.reducer,


});

const persistConfig = {
  key: "root",
  storage,
  whitelist: [
    "loginSlice",
    "marketSlice",
    "rolesSlice",
    "userSlice",
    "aclSlice",
    "lookupSlice",
    "orgSlice",
    "notificationSlice",
    "airportSlice",
    "flightLookupSlice",
    "flightListSlice",
    "flightSearchSlice",
    "homePageSlice",
    "flightAutoCompleteSearchSlice",
    "flightCheckoutReserveSlice",
    "flightSelectSlice",
    "flightBookingDetailsSlice",
    "myTripsSlice",
    "approvalWorkFlowSlice",
    "pricingPolicySlice",
    "flightAncillariesBaggageApiSlice",
    "ancillariesSelectionsSlice",
    "FlightAncillariesSeatsApiSlice",
    "FlightAncillariesMealsApiSlice",
    "tagsSlice",
    "tagCreationDataSlice",
    "quotationSlice",
    "selectValueSlice",
    "budgetSlice",
    "menu"
  ],
};

const rootReducer = (state: any, action: any) => {
  if (action.type === "RESET_STATE") {
    state = {};
  }
  return appReducer(state, action);
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  devTools: process.env.NODE_ENV !== 'production',
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }).concat(
      musafirVoucherApi.middleware,
            musafirTravelPolicyApi.middleware,
       policyConstraintSearchReducerApi.middleware,
             musafirHomePageApi.middleware,
                   tripReducerApi.middleware,
                         musafirMyTripsApi.middleware,
   musafirFlightLookupApi.middleware,



    ),
});

export const persistor = persistStore(store);
export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;

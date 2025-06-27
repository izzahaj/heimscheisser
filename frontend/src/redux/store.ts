import { combineReducers, configureStore } from "@reduxjs/toolkit";

import mapReducer from "@/features/ToiletMap/mapSlice";
import { toiletApi } from "@/services/Toilet/ToiletService";

const rootReducer = combineReducers({
  map: mapReducer,
  [toiletApi.reducerPath]: toiletApi.reducer,
});
export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(toiletApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import dbReducer from "./dbSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    db: dbReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;

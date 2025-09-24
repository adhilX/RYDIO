
import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";
import userReducer from "./slice/user/UserSlice";
import tokenReducer from "./slice/user/UserTokenSlice";
import AdminToken from "./slice/admin/AdminTokenSlice";
import locationReducer from './slice/user/locationSlice'
import searchDateReducer from './slice/user/SearchDateSlice';
import notificationReducer from './slice/notification/notificationSlice'

const rootReducer = combineReducers({
  auth: userReducer,
  userToken: tokenReducer,
  location: locationReducer,
  adminToken: AdminToken,
  searchDate:searchDateReducer,
  notification: notificationReducer
});

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["auth", "userToken", 'adminToken','location','searchDate'],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export const persistor = persistStore(store);

// types

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
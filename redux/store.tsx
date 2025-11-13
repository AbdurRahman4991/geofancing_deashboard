import { configureStore } from "@reduxjs/toolkit";
import { api } from "./api/baseApi";


const store = configureStore({
    reducer: {
         [api.reducerPath]: api.reducer,
        // user: userReducer,
    },
     middleware: (getDefaultMiddleware) =>getDefaultMiddleware().concat(api.middleware),
});

export default store;
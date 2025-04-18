import { Provider } from "react-redux";
import { configureStore, combineReducers } from "@reduxjs/toolkit";
import countReducer from "./slices/countSlice";
import productReducer from "./slices/productSlice";
import authReducer from "./slices/authSlice";

const rootReducer = combineReducers({
    count: countReducer,
    product: productReducer,
    auth: authReducer
});

const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            immutableCheck: { warnAfter: 128 },
            serializableCheck: { warnAfter: 128 }
        })
});

export function AppProvider({ children }) {
    return <Provider store={store}>{children}</Provider>;
}

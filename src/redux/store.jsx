import { Provider } from "react-redux";
import { configureStore, combineReducers } from "@reduxjs/toolkit";
import countReducer from "./slices/countSlice";
import productReducer from "./slices/productSlice";
import authReducer from "./slices/authSlice";
import socketReducer from "./slices/socketSlice";
import peerReducer from "./slices/peerSlice";
import callReducer from "./slices/callSlice";
import friendshipReducer from "./slices/friendSlice";
import chatReducer from "./slices/chatSlice";
import aiReducer from "./slices/aiSlice";

const rootReducer = combineReducers({
    count: countReducer,
    product: productReducer,
    auth: authReducer,
    socket: socketReducer,
    peer: peerReducer,
    call: callReducer,
    chat: chatReducer,
    friendship: friendshipReducer,
    ai: aiReducer
});

const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            immutableCheck: { warnAfter: 128 },
            serializableCheck: false
        })
});

export function AppProvider({ children }) {
    return <Provider store={store}>{children}</Provider>;
}

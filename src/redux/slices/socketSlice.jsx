import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    socket: null,
    usersOnline: []
};

const socketSlice = createSlice({
    name: "socket",
    initialState,
    reducers: {
        setSocket(state, action) {
            state.socket = action.payload;
        },
        delSocket(state, action) {
            state.socket = null;
        },
        getUsersOnline(state, action) {
            state.usersOnline = action.payload;
        }
    }
});

export const { setSocket, delSocket, getUsersOnline } = socketSlice.actions;
export default socketSlice.reducer;

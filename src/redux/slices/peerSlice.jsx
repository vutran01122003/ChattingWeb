import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    _id: null
};

const peerSlice = createSlice({
    name: "peer",
    initialState,
    reducers: {
        setPeer(state, action) {
            state._id = action.payload;
        }
    }
});

export const { setPeer } = peerSlice.actions;
export default peerSlice.reducer;

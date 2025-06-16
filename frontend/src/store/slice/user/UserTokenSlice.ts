import { createSlice, type PayloadAction } from "@reduxjs/toolkit";


interface TokenState {
    token: string | null;
}

const initialState:TokenState = {
    token: null
}

export const tokenSlice = createSlice({
    name: 'token',
    initialState,
    reducers: {
        addToken: (state, action:PayloadAction<string>) => {
            state.token = action.payload
        },
        removeToken: (state) => {
            state.token = null
        }
    }
})

export const { addToken, removeToken } = tokenSlice.actions
export default tokenSlice.reducer
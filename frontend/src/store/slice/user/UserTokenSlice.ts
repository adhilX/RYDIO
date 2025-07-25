import { createSlice, type PayloadAction } from "@reduxjs/toolkit";


interface TokenState {
    userToken: string | null;
}

const initialState:TokenState = {
    userToken: null
}

export const tokenSlice = createSlice({
    name: 'userToken',
    initialState,
    reducers: {
        addToken: (state, action:PayloadAction<string>) => {
            state.userToken = action.payload
        },
        removeToken: (state) => {
            state.userToken = null
        }
    }
})

export const { addToken, removeToken } = tokenSlice.actions
export default tokenSlice.reducer
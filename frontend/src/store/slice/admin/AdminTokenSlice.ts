import { createSlice, type PayloadAction } from "@reduxjs/toolkit";


interface AdminTokenState {
    token: string | null;
}

const initialState:AdminTokenState = {
    token: null
}

export const admintokenSlice = createSlice({
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

export const { addToken, removeToken } = admintokenSlice.actions
export default admintokenSlice.reducer
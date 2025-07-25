import { createSlice, type PayloadAction } from "@reduxjs/toolkit";


interface AdminTokenState {
    adminToken: string | null;
}

const initialState:AdminTokenState = {
    adminToken: null
}

export const admintokenSlice = createSlice({
    name: 'adminToken',
    initialState,
    reducers: {
        addToken: (state, action:PayloadAction<string>) => {
            state.adminToken = action.payload
        },
        removeToken: (state) => {
            state.adminToken = null
        }
    }
})

export const { addToken, removeToken } = admintokenSlice.actions
export default admintokenSlice.reducer
import { createSlice } from "@reduxjs/toolkit";

interface User {
    email: string,
    name: string,
    phone: number,
    profileImage?: string,
    _id?: string
    role: 'user',
    is_blocked: boolean,
    googleVerified: boolean
}

const initialState: { user: User | null } = {
    user: null
}

export const userSlice = createSlice({
    name: "userSlice",
    initialState,
    reducers: {
        addUser: (state, action) => {
            state.user = action.payload
        },
        removeUser: (state) => {
            state.user = null
        }
    }
})

export const { addUser, removeUser } = userSlice.actions
export default userSlice.reducer
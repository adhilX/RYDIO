import type { IidProof_id } from "@/Types/User/IidProof";
import { createSlice } from "@reduxjs/toolkit";

interface User {
    _id?: string
    idproof_id?:IidProof_id,
    email: string,
    name: string,
    phone: string,
    profile_image?: string,
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
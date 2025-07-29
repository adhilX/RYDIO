import { createSlice } from "@reduxjs/toolkit";


const initialState: { searchDate: { startDate: string | null; endDate: string | null } } = {
    searchDate: {
        startDate: null,
        endDate: null
    }
}


export const SearchDateSlice = createSlice({
    name: "SearchDateSlice",
    initialState,
    reducers: {
        setSearchDate: (state, action) => {
            state.searchDate = {
                ...state.searchDate,
                ...action.payload,
            };
        },
        resetSearchDate: (state) => {
            state.searchDate = initialState.searchDate;
        }
    }
});

export const { setSearchDate, resetSearchDate } = SearchDateSlice.actions;
export default SearchDateSlice.reducer;
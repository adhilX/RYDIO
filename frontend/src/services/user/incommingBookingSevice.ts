import { userAxios as axiosInstance } from "@/axios/interceptors";
import { isAxiosError } from "axios";

export const getIncomingBooking = async (user_id: string, search : string,status : string, page : number, limit : number) => {
    try {
        const response = await axiosInstance.post(`/incoming-bookings/${user_id}`,{user_id,search,status,page,limit});
        return response?.data;
    } catch (error) {
        console.error('Error while fetching incoming bookings:', error);
        if (isAxiosError(error)) {
        const errorMsg = error.response?.data?.error || error.message || 'An unknown error occurred while fetching incoming bookings';
        throw new Error(errorMsg);
        }
        throw new Error('An unexpected error occurred while fetching incoming bookings');
    }
};



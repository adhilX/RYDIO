import { userAxios as axiosInstance } from "@/axios/interceptors";
import { isAxiosError } from "axios";

export const startEndRide = async (url:string) => {
    try {
        const response = await axiosInstance.get(url);
        return response?.data;
    } catch (error) {
        console.error('Error while starting/ending ride:', error);
        if (isAxiosError(error)) {
        const errorMsg = error.response?.data?.error || error.message || 'An unknown error occurred while starting/ending ride';
        throw new Error(errorMsg);
        }
        throw new Error('An unexpected error occurred while starting/ending ride');
    }
};


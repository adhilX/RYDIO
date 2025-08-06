import axiosInstance from "@/axios/UserInterceptors";
import { isAxiosError } from "axios";

export const getWallet = async (userId: string) => {
  try {
    const response = await axiosInstance.get(`/get-wallet/${userId}`);
    return response.data;
  } catch (error) {
    console.log('error while fetching wallet', error);
    if (isAxiosError(error)) {
      throw new Error(error.response?.data?.error || 'Error while fetching wallet');
    }
    throw new Error('Error while fetching wallet');
  }
}
import { userAxios as axiosInstance } from "@/axios/interceptors";
import { isAxiosError } from "axios";

export const getWallet = async (userId: string, page: number, limit: number) => {
  try {
    const response = await axiosInstance.get(`/get-wallet/${userId}?page=${page}&limit=${limit}`);
    return response.data;
  } catch (error) {
    console.log('error while fetching wallet', error);
    if (isAxiosError(error)) {
      throw new Error(error.response?.data?.error || 'Error while fetching wallet');
    }
    throw new Error('Error while fetching wallet');
  }
}



export const withdrawMoney = async (bookingId:string,userId:string)=>{
  try{
      const response = await axiosInstance.post(`/withdrawal/${bookingId}`,userId)
      return response.data
  }catch(error){

  }

}
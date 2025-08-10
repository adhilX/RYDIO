import axiosInstance from "@/axios/Instance";

export const getwallet = async () => {
    try {
   const response = await axiosInstance.get('/admin/get-wallet');
   
        return response.data;
    } catch (error) {
        console.error('Error fetching wallet:', error);
        throw error;
    }
    }
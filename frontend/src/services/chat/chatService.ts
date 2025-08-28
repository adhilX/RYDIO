import { userAxios as axiosInstance } from "@/axios/interceptors";


export const createChat = async (senderId: string, receiverId: string) => {
    return axiosInstance.post('/create-chat', { senderId, receiverId });
  };
  
  export const getChat = async (senderId: string, receiverId: string) => {
    return axiosInstance.get(`/get-chat/${senderId}/${receiverId}`);
  };
  
  export const getMessages = async (chatId: string) => {
    return axiosInstance.get(`/get-messages/${chatId}`);
  };
  
  export const sendMessage = async (chatId: string, senderId: string, text: string) => {
    return axiosInstance.post(`/send-message/${chatId}`, { senderId, text });
  };
  
import { userAxios as axiosInstance } from "@/axios/interceptors";

export const findOrCreateChat = async (userId: string,ownerId:string) => {
  try {
      const response = await axiosInstance.post('/chat/find-or-create', { 
       userId,
       ownerId 
    });
    return response.data
  } catch (error) {
    console.log('Error while creating chat:', error);
    throw error;
  }
};

export const getChatsOfUser = async (userId: string) => {
  try {
    const response = await axiosInstance.get(`/chat/chats/${userId}`);
    return response.data;
  } catch (error) {
    console.log('Error while getting chat:', error);
    throw error;
  }
};

// Message APIs
export const getMessages = async (chatId: string) => {
  console.log('chatId',chatId)
  try {
    const response = await axiosInstance.get(`/chat/messages/${ chatId}`);
    return response.data;
  } catch (error) {
    console.log('Error while getting messages:', error);
    throw error;
  }
}

export const anableChat = async(userId:string,ownerId:string) => {
  try {
    const response = await axiosInstance.post(`/chat/enable-chat`,{userId,ownerId});
    return response.data;
  } catch (error) {
    console.log('Error while enabling chat:', error);
    throw error;
  }
}
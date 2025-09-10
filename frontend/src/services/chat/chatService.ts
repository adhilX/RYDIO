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
  try {
    const response = await axiosInstance.get(`/chat/messages/${ chatId}`);
    return response.data;
  } catch (error) {
    console.log('Error while getting messages:', error);
    throw error;
  }
};

export const sendMessage = async (chatId: string, senderId: string, senderModel: 'user' | 'owner', messageContent: string) => {
  return axiosInstance.post('/chat/messages', { 
    chatId, 
    senderId, 
    senderModel, 
    messageContent 
  });
};

// Mark messages as seen
export const markMessageAsSeen = async (messageId: string) => {
  return axiosInstance.patch(`/chat/messages/${messageId}/seen`);
};

export const markAllMessagesAsSeenInChat = async (chatId: string) => {
  return axiosInstance.patch(`/chat/chats/${chatId}/messages/seen`);
};
  
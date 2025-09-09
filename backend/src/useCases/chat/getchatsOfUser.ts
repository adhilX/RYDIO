import { IGetChatUsecase } from "../../domain/interface/usecaseInterface/chat/IGetChatUsecase";
import { IChatRepository } from "../../domain/interface/repositoryInterface/IChatRepository";
import { IBaseChatOut } from "../../domain/interface/DTOs/chatDto/chatDto";

export class GetChatUsecase implements IGetChatUsecase {
    private chatRepository: IChatRepository
    constructor(chatRepository: IChatRepository) {
        this.chatRepository = chatRepository
    }
    
    async getchatsOfUser(userId: string): Promise<{chats:IBaseChatOut[]|null}> {
        const result = await this.chatRepository.findChatsOfUser(userId);
        
        if (!result.chats || result.chats.length === 0) {
            return { chats: null };
        }
        const mappedChats = result.chats.map(chat => {
            // Determine which user to show (the other participant)
            const otherUser = chat.senderId._id.toString() === userId ? chat.receiverId : chat.senderId;
            
            return {
                _id:otherUser._id.toString(),
                name: otherUser.name,
                profile_image: otherUser.profile_image || '',
                isOnline: true,
                lastMessage: chat.lastMessage,
                lastMessageAt: chat.lastMessageAt
            };
        });
        
        return { chats: mappedChats };
    }
}

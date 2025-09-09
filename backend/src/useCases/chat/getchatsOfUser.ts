import { IgetChatUsecase } from "../../domain/interface/usecaseInterface/chat/IgetChatUsecase";
import { IchatRepository } from "../../domain/interface/repositoryInterface/IchatRepository";
import { IbaseChatOut } from "../../domain/interface/DTOs/chatDto/chatDto";

export class GetChatUsecase implements IgetChatUsecase {
    private chatRepository: IchatRepository
    constructor(chatRepository: IchatRepository) {
        this.chatRepository = chatRepository
    }
    
    async getchatsOfUser(userId: string): Promise<{chats:IbaseChatOut[]|null}> {
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

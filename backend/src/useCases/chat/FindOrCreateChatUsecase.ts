import { IbaseChatOut, IcreateChatInputDto } from "../../domain/interface/DTOs/chatDto/chatDto"
import { IchatRepository } from "../../domain/interface/repositoryInterface/IchatRepository"
import { Ichat } from "../../domain/entities/chatEntites"
import { IfindOrCreateChatUsecase } from "../../domain/interface/usecaseInterface/chat/IfindOrCreateChatUsercase"

export class FindOrCreateChatUsecase implements IfindOrCreateChatUsecase {
    private chatRepository: IchatRepository
    constructor(chatRepository: IchatRepository) {
        this.chatRepository = chatRepository
    }
    async createChat(input:IcreateChatInputDto): Promise<IbaseChatOut> {
        const {userId,ownerId} = input
    const existingChat = await this.chatRepository.getchatOfUser(userId,ownerId)
        if (existingChat) {
            const otherUser = existingChat.senderId._id.toString() === userId ? existingChat.receiverId : existingChat.senderId;

            return {
                _id:existingChat._id,
                name: otherUser.name,
                profile_image: otherUser.profile_image || '',
                isOnline: true,
                lastMessage: existingChat.lastMessage,
                lastMessageAt: existingChat.lastMessageAt
            }
        }
        
        const newChat: Ichat = {
            senderId:userId,
            receiverId:ownerId,
            senderModel:'user',
            receiverModel:'owner',
            lastMessage: "",
            lastMessageAt: new Date()
        }
        
        const createdChat = await this.chatRepository.createChat(newChat)
        if (!createdChat) throw new Error('Error while creating new chat')
        
            const otherUser = createdChat.senderId._id.toString() === userId ? createdChat.receiverId : createdChat.senderId;

        return {
            _id:createdChat._id,
            name: otherUser.name,
            profile_image: otherUser.profile_image || '',
            isOnline: true,
            lastMessage: createdChat.lastMessage,
            lastMessageAt: createdChat.lastMessageAt
        }
    }
}

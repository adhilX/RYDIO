import { IBaseChatOut, ICreateChatInputDto } from "../../domain/interface/DTOs/chatDto/chatDto"
import { IChatRepository } from "../../domain/interface/repositoryInterface/IChatRepository"
import { IChat } from "../../domain/entities/chatEntites"
import { IFindOrCreateChatUsecase } from "../../domain/interface/usecaseInterface/chat/IFindOrCreateChatUsecase"

export class FindOrCreateChatUsecase implements IFindOrCreateChatUsecase {
    private chatRepository: IChatRepository
    constructor(chatRepository: IChatRepository) {
        this.chatRepository = chatRepository
    }
    async createChat(input:ICreateChatInputDto): Promise<IBaseChatOut> {
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
        
        const newChat: IChat = {
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

import { Ichat } from "../../domain/entities/chatEntites"
import { IchatRepository } from "../../domain/interface/repositoryInterface/IchatRepository"
import { IcreateChatUseCase } from "../../domain/interface/usecaseInterface/chat/IcreateChatUsecase"

export class CreateChatUseCase implements IcreateChatUseCase {
    private chatRepository: IchatRepository
    constructor(chatRepository: IchatRepository) {
        this.chatRepository = chatRepository
    }
    async createChat(chat: Ichat): Promise<Ichat> {
        const existingChat = await this.chatRepository.getChatsOfParticularUsers(chat.senderId, chat.receiverId)
        if (existingChat) return existingChat
        const createdChat = await this.chatRepository.createChat(chat)
        if (!createdChat) throw new Error('Error while creating new chat')
        return createdChat
    }
}
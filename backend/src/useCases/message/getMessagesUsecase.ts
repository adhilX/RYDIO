import { Imessage } from "../../domain/entities/messageEntities";
import { ImessageRepository } from "../../domain/interface/repositoryInterface/ImessageRepository";
import { IgetMessagesUsecase } from "../../domain/interface/usecaseInterface/message/IgetMessagesUsecase";

export class GetMessagesUsecase implements IgetMessagesUsecase {
    private messageRepository: ImessageRepository;
    
    constructor(messageRepository: ImessageRepository) {
        this.messageRepository = messageRepository;
    }
    
    async getMessages(chatId: string): Promise<{ messages: Imessage[]}> {
        return await this.messageRepository.getMessagesOfAChat(chatId);
    }
}

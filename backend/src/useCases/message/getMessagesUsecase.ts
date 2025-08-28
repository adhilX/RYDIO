import { Imessage } from "../../domain/entities/messageEntities";
import { ImessageRepository } from "../../domain/interface/repositoryInterface/ImessageRepository";
import { IgetMessagesUseCase } from "../../domain/interface/usecaseInterface/message/IgetMessagesUsecase";

export class GetMessagesUseCase implements IgetMessagesUseCase {
    private messageRepository: ImessageRepository;
    
    constructor(messageRepository: ImessageRepository) {
        this.messageRepository = messageRepository;
    }
    
    async getMessagesByChatId(chatId: string, pageNo: number): Promise<{ messages: Imessage[], hasMore: boolean }> {
        return await this.messageRepository.getMessagesByChatId(chatId, pageNo);
    }
}

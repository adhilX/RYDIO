import { IMessage } from "../../domain/entities/messageEntities";
import { IMessageRepository } from "../../domain/interface/repositoryInterface/IMessageRepository";
import { IGetMessagesUsecase } from "../../domain/interface/usecaseInterface/message/IGetMessagesUsecase";

export class GetMessagesUsecase implements IGetMessagesUsecase {
    private messageRepository: IMessageRepository;
    
    constructor(messageRepository: IMessageRepository) {
        this.messageRepository = messageRepository;
    }
    
    async getMessages(chatId: string): Promise<{ messages: IMessage[]}> {
        return await this.messageRepository.getMessagesOfAChat(chatId);
    }
}

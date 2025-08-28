import { Imessage } from "../../domain/entities/messageEntities";
import { ImessageRepository } from "../../domain/interface/repositoryInterface/ImessageRepository";
import { IcreateMessageUseCase } from "../../domain/interface/usecaseInterface/message/IcreateMessageUsecase";
import { IchatRepository } from "../../domain/interface/repositoryInterface/IchatRepository";

export class CreateMessageUseCase implements IcreateMessageUseCase {
    private messageRepository: ImessageRepository;
    private chatRepository: IchatRepository;
    
    constructor(messageRepository: ImessageRepository, chatRepository: IchatRepository) {
        this.messageRepository = messageRepository;
        this.chatRepository = chatRepository;
    }
    
    async createMessage(message: Imessage): Promise<Imessage> {
        const createdMessage = await this.messageRepository.createMessage(message);
        if (!createdMessage) throw new Error('Error while creating new message');
        
        // Update chat's last message
        await this.chatRepository.updateLastMessage(createdMessage);
        
        return createdMessage;
    }
}
    
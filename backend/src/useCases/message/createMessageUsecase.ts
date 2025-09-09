import { Imessage } from "../../domain/entities/messageEntities";
import { IMessageRepository } from "../../domain/interface/repositoryInterface/IMessageRepository";
import { ICreateMessageUsecase } from "../../domain/interface/usecaseInterface/message/ICreateMessageUsecase";

export class CreateMessageUseCase implements ICreateMessageUsecase {
    private messageDatabase: IMessageRepository
    constructor(messageDatabase: IMessageRepository) {
        this.messageDatabase = messageDatabase
    }
    async createMessage(message: Imessage): Promise<Imessage> {
        return this.messageDatabase.createMessage(message)
    }
}   
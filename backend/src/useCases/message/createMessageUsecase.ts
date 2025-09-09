import { Imessage } from "../../domain/entities/messageEntities";
import { ImessageRepository } from "../../domain/interface/repositoryInterface/ImessageRepository";
import { IcreateMessageUsecase } from "../../domain/interface/usecaseInterface/message/IcreateMessageUsecase";

export class CreateMessageUseCase implements IcreateMessageUsecase {
    private messageDatabase: ImessageRepository
    constructor(messageDatabase: ImessageRepository) {
        this.messageDatabase = messageDatabase
    }
    async createMessage(message: Imessage): Promise<Imessage> {
        return this.messageDatabase.createMessage(message)
    }
}   
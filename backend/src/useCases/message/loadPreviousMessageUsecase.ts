import { Imessage } from "../../domain/entities/messageEntities";
import { IMessageRepository } from "../../domain/interface/repositoryInterface/IMessageRepository";
import { IloadPreviousChatUseCase } from "../../domain/interface/usecaseInterface/message/IloadPreviousChatUseCase";

export class LoadPreviousChatUseCase implements IloadPreviousChatUseCase{
    private messageDatabase: IMessageRepository
    constructor(messageDatabase: IMessageRepository) {
        this.messageDatabase = messageDatabase
    }
    async loadPreviousChat(chatId: string): Promise<{ messages:Imessage[] }> {
        return await this.messageDatabase.getMessagesOfAChat(chatId)
    }
}
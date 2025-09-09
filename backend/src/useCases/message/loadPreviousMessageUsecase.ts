import { Imessage } from "../../domain/entities/messageEntities";
import { ImessageRepository } from "../../domain/interface/repositoryInterface/ImessageRepository";
import { IloadPreviousChatUseCase } from "../../domain/interface/usecaseInterface/message/IloadPreviousChatUseCase";

export class LoadPreviousChatUseCase implements IloadPreviousChatUseCase{
    private messageDatabase: ImessageRepository
    constructor(messageDatabase: ImessageRepository) {
        this.messageDatabase = messageDatabase
    }
    async loadPreviousChat(chatId: string): Promise<{ messages:Imessage[] }> {
        return await this.messageDatabase.getMessagesOfAChat(chatId)
    }
}
import { Imessage } from "../../domain/entities/messageEntities";
import { ImessageRepository } from "../../domain/interface/repositoryInterface/ImessageRepository";
import { IloadPreviousChatUseCase } from "../../domain/interface/usecaseInterface/message/IloadPreviousChatUseCase";

export class LoadPreviousChatUseCase implements IloadPreviousChatUseCase{
    private messageDatabase: ImessageRepository
    constructor(messageDatabase: ImessageRepository) {
        this.messageDatabase = messageDatabase
    }
    async loadPreviousChat(chatId: string, pageNo: number): Promise<{ messages:Imessage[]; hasMore: boolean; }> {
        return await this.messageDatabase.getMessagesOfAChat(chatId, pageNo)
    }
}
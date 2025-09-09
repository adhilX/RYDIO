import { IMessage } from "../../domain/entities/messageEntities";
import { IMessageRepository } from "../../domain/interface/repositoryInterface/IMessageRepository";
import { ILoadPreviousChatUseCase } from "../../domain/interface/usecaseInterface/message/IloadPreviousChatUseCase";

export class LoadPreviousChatUseCase implements ILoadPreviousChatUseCase{
    private messageDatabase: IMessageRepository
    constructor(messageDatabase: IMessageRepository) {
        this.messageDatabase = messageDatabase
    }
    async loadPreviousChat(chatId: string): Promise<{ messages:IMessage[] }> {
        return await this.messageDatabase.getMessagesOfAChat(chatId)
    }
}
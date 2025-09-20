import { IMessage } from "../../domain/entities/messageEntities";
import { IMessageRepository } from "../../domain/interface/repositoryInterface/IMessageRepository";
import { ILoadPreviousChatUseCase } from "../../domain/interface/usecaseInterface/message/ILoadPreviousChatUseCase";

export class LoadPreviousChatUseCase implements ILoadPreviousChatUseCase{
    private _messageDatabase: IMessageRepository
    constructor(messageDatabase: IMessageRepository) {
        this._messageDatabase = messageDatabase
    }
    async loadPreviousChat(chatId: string): Promise<{ messages:IMessage[] }> {
        return await this._messageDatabase.getMessagesOfAChat(chatId)
    }
}
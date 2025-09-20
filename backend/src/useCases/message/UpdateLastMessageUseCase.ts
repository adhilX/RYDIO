import { IChat } from "../../domain/entities/chatEntites";
import { IMessage } from "../../domain/entities/messageEntities";
import { IChatRepository } from "../../domain/interface/repositoryInterface/IChatRepository";
import { IUpdateLastMessageUseCase } from "../../domain/interface/usecaseInterface/chat/IupdateLastMessageUseCase";

export class UpdateLastMessageUseCase implements IUpdateLastMessageUseCase {

    constructor(
        private _chatRepository: IChatRepository
    ) {}

    async updateLastMessage(message: IMessage): Promise<IChat | null> {
        const actualChatId = message.chatId.slice(0,24); 
        message.chatId = actualChatId;
        const result = await this._chatRepository.updateLastMessage(message)
        console.log(result)
        return result
    }
}

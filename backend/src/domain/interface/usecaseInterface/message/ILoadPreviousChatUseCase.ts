import { IMessage } from "../../../entities/messageEntities";

export interface ILoadPreviousChatUseCase {
    loadPreviousChat(chatId: string): Promise<{ messages: IMessage[] }>
}
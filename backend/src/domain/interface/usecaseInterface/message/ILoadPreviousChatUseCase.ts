import { Imessage } from "../../../entities/messageEntities";

export interface ILoadPreviousChatUseCase {
    loadPreviousChat(chatId: string): Promise<{ messages: Imessage[] }>
}
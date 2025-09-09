import { Imessage } from "../../../entities/messageEntities";

export interface IloadPreviousChatUseCase {
    loadPreviousChat(chatId: string): Promise<{ messages: Imessage[] }>
}
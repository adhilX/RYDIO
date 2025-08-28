import { Imessage } from "../../../entities/messageEntities";

export interface IloadPreviousChatUseCase {
    loadPreviousChat(chatId: string, pageNo: number): Promise<{ messages: Imessage[], hasMore: boolean }>
}
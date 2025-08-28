import { Imessage } from "../../../entities/messageEntities";

export interface IgetMessagesUseCase {
    getMessagesByChatId(chatId: string, pageNo: number): Promise<{ messages: Imessage[], hasMore: boolean }>;
}

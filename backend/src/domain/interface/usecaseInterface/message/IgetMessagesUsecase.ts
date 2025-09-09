import { Imessage } from "../../../entities/messageEntities";

export interface IgetMessagesUsecase {
    getMessages(chatId: string): Promise<{ messages: Imessage[] }>;
}

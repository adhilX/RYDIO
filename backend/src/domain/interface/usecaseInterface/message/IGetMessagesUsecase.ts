import { Imessage } from "../../../entities/messageEntities";

export interface IGetMessagesUsecase {
    getMessages(chatId: string): Promise<{ messages: Imessage[] }>;
}

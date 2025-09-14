import { IMessage } from "../../../entities/messageEntities";

export interface IGetMessagesUsecase {
    getMessages(chatId: string): Promise<{ messages: IMessage[] }>;
}

import { IMessage } from "../../entities/messageEntities"
import { IBaseRepository } from "./IbaseRepo"

export interface IMessageRepository extends IBaseRepository<IMessage>{
    getMessages(senderId: string): Promise<IMessage[] | []>
    getMessagesOfAChat(chatId: string): Promise<{ messages: IMessage[] }>
    markMessageAsSeen(messageId: string): Promise<IMessage | null>
    markAllMessagesAsSeenInChat(chatId: string): Promise<{ modifiedCount: number }>
}
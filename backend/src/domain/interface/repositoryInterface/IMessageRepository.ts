import { Imessage } from "../../entities/messageEntities"

export interface IMessageRepository {
    createMessage(message: Imessage): Promise<Imessage>
    getMessages(senderId: string): Promise<Imessage[] | []>
    getMessagesOfAChat(chatId: string): Promise<{ messages: Imessage[] }>
    markMessageAsSeen(messageId: string): Promise<Imessage | null>
    markAllMessagesAsSeenInChat(chatId: string): Promise<{ modifiedCount: number }>
}
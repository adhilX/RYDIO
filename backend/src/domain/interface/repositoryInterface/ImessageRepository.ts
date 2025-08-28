import { Imessage } from "../../entities/messageEntities"

export interface ImessageRepository {
    createMessage(message: Imessage): Promise<Imessage>
    getMessages(senderId: string): Promise<Imessage[] | []>
    getMessagesOfAChat(chatId: string,pageNo:number): Promise<{ messages: Imessage[], hasMore: boolean }>
}
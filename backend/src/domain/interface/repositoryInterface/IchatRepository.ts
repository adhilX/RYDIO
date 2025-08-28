import { Ichat } from "../../entities/chatEntites"
import { Imessage } from "../../entities/messageEntities"

export interface IchatRepository {
    createChat(chat: Ichat): Promise<Ichat>
    getchatsOfUser(userId: string , pageNo: number): Promise<{ chats: Ichat[], hasMore: boolean }>
    getChatsOfParticularUsers(senderId: string, receiverId: string): Promise<Ichat | null>
    updateLastMessage(message: Imessage): Promise<Ichat | null>
    getChatId(senderId: string, receiverId: string): Promise<Ichat | null>
}
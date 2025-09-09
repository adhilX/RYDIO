import { Ichat, IchatPopulated } from "../../entities/chatEntites"
import { Imessage } from "../../entities/messageEntities"

export interface IChatRepository {
    createChat(chat: Ichat): Promise<IchatPopulated>
    getchatOfUser(userId: string,ownerId:string): Promise<IchatPopulated|null>
    findChatsOfUser(userId:string): Promise<{chats:IchatPopulated[]|null}>
    updateLastMessage(message: Imessage): Promise<Ichat | null>
}
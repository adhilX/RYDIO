import { IChat, IChatPopulated } from "../../entities/chatEntites"
import { IMessage } from "../../entities/messageEntities"

export interface IChatRepository {
    createChat(chat: IChat): Promise<IChatPopulated>
    getchatOfUser(userId: string,ownerId:string): Promise<IChatPopulated|null>
    findChatsOfUser(userId:string): Promise<{chats:IChatPopulated[]|null}>
    updateLastMessage(message: IMessage): Promise<IChat | null>
}
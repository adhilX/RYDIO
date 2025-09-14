import { IMessage } from "../../../entities/messageEntities";
import { IChat } from "../../../entities/chatEntites";

export interface IUpdateLastMessageUseCase {
    updateLastMessage(message: IMessage): Promise<IChat | null>
}

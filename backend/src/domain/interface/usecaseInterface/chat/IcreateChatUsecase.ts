import { Ichat } from "../../../entities/chatEntites";

export interface IcreateChatUseCase {
    createChat(chat: Ichat): Promise<Ichat>
}
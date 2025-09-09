import { IbaseChatOut } from "../../DTOs/chatDto/chatDto";

export interface IgetChatUsecase {
getchatsOfUser(userId: string): Promise<{chats:IbaseChatOut[]|null}>}
import { IBaseChatOut } from "../../DTOs/chatDto/chatDto";

export interface IGetChatUsecase {
getchatsOfUser(userId: string): Promise<{chats:IBaseChatOut[]|null}>}
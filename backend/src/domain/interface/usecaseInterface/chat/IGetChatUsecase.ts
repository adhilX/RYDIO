import { IbaseChatOut } from "../../DTOs/chatDto/chatDto";

export interface IGetChatUsecase {
getchatsOfUser(userId: string): Promise<{chats:IbaseChatOut[]|null}>}
import { IbaseChatOut, IcreateChatInputDto } from "../../DTOs/chatDto/chatDto";

export interface IfindOrCreateChatUsecase {
    createChat(input: IcreateChatInputDto): Promise<IbaseChatOut>
}
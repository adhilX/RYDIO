import { IbaseChatOut, IcreateChatInputDto } from "../../DTOs/chatDto/chatDto";

export interface IFindOrCreateChatUsecase {
    createChat(input: IcreateChatInputDto): Promise<IbaseChatOut>
}
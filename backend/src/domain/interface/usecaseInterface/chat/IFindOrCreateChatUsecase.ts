import { IBaseChatOut, ICreateChatInputDto } from "../../DTOs/chatDto/chatDto";

export interface IFindOrCreateChatUsecase {
    createChat(input: ICreateChatInputDto): Promise<IBaseChatOut>
}
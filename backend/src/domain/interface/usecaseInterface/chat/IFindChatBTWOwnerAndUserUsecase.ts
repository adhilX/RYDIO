import { IChatPopulated } from "../../../entities/chatEntites";

export interface IFindChatBTWOwnerAndUserUsecase {
    findChatBetweenClientAndVendor(senderId: string, receiverId: string): Promise<IChatPopulated | null>
}
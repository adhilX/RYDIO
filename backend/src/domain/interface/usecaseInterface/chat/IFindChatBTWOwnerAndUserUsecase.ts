import { IchatPopulated } from "../../../entities/chatEntites";

export interface IFindChatBTWOwnerAndUserUsecase {
    findChatBetweenClientAndVendor(senderId: string, receiverId: string): Promise<IchatPopulated | null>
}
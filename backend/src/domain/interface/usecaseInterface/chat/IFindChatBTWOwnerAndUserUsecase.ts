import { Ichat } from "../../../entities/chatEntites";

export interface IFindChatBTWOwnerAndUserUsecase {
    findChatBetweenClientAndVendor(senderId: string, receiverId: string): Promise<Ichat | null>
}
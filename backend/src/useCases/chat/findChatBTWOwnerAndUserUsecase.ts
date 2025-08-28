import { IchatRepository } from "../../domain/interface/repositoryInterface/IchatRepository"
import { Ichat } from "../../domain/entities/chatEntites"
import { IFindChatBTWOwnerAndUserUsecase } from "../../domain/interface/usecaseInterface/chat/IFindChatBTWOwnerAndUserUsecase"

export class FindChatBTWOwnerAndUserUsecase implements IFindChatBTWOwnerAndUserUsecase {
    private chatDatabase: IchatRepository
    constructor(chatDatabase: IchatRepository) {
        this.chatDatabase = chatDatabase
    }
    async findChatBetweenClientAndVendor(senderId: string, receiverId: string): Promise<Ichat | null> {
        return await this.chatDatabase.getChatsOfParticularUsers(senderId, receiverId)

    }
}
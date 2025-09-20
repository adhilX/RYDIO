import { IMessage } from "../../domain/entities/messageEntities";
import { IMessageRepository } from "../../domain/interface/repositoryInterface/IMessageRepository";
import { ICreateMessageUsecase } from "../../domain/interface/usecaseInterface/message/ICreateMessageUsecase";

export class CreateMessageUseCase implements ICreateMessageUsecase {
    private _messageRepository: IMessageRepository
    constructor(messageDatabase: IMessageRepository) {
        this._messageRepository = messageDatabase
    }
    async createMessage(message: IMessage): Promise<IMessage> {
        return this._messageRepository.create(message)
    }
}   
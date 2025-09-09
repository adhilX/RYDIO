import { IMessageRepository } from "../../../domain/interface/repositoryInterface/IMessageRepository"
import { messageModel } from "../../../framework/database/models/messageModal"
import { IMessage } from "../../../domain/entities/messageEntities"

export class MessageRepository implements IMessageRepository {
    async createMessage(message: IMessage): Promise<IMessage> {
        return await messageModel.create(message)
    }
    
    async getMessages(senderId: string): Promise<IMessage[] | []> {
        return await messageModel.find({ senderId }).select('-__v -createdAt -updatedAt')
    }
    
    async getMessagesOfAChat(chatId: string): Promise<{ messages: IMessage[] }> {
        const messages = await messageModel.find({ chatId })
            .sort({ sendedTime: -1 })
        return { messages: messages.reverse() }
    }
    
    async markMessageAsSeen(messageId: string): Promise<IMessage | null> {
        return await messageModel.findByIdAndUpdate(
            messageId,
            { seen: true },
            { new: true }
        )
    }
    
    async markAllMessagesAsSeenInChat(chatId: string): Promise<{ modifiedCount: number }> {
        const result = await messageModel.updateMany(
            { chatId, seen: false },
            { seen: true }
        )
        return { modifiedCount: result.modifiedCount }
    }
}
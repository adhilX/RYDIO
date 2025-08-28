import { ImessageRepository } from "../../../domain/interface/repositoryInterface/ImessageRepository"
import { messageModel } from "../../../framework/database/models/messageModal"
import { Imessage } from "../../../domain/entities/messageEntities"

export class MessageRepository implements ImessageRepository {
    async createMessage(message: Imessage): Promise<Imessage> {
        return await messageModel.create(message)
    }
    async getMessages(senderId: string): Promise<Imessage[] | []> {
        return await messageModel.find({ senderId }).select('-__v -createdAt -updatedAt')
    }
    async getMessagesOfAChat(chatId: string, pageNo: number): Promise<{ messages: Imessage[], hasMore: boolean }> {
        const page = Math.max(pageNo, 1)
        const limit = 10
        const skip = (page - 1) * limit
        const messages = await messageModel.find({ chatId }).select('-__v -createdAt -updatedAt').sort({ sendedTime: -1 }).skip(skip).limit(limit)
        const totalMessages = await messageModel.countDocuments({ chatId })
        const hasMore = (skip + messages.length) < totalMessages
        return { messages, hasMore }
    }
}
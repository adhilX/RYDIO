import { Ichat } from "../../../domain/entities/chatEntites"
import { Imessage } from "../../../domain/entities/messageEntities"
import { IchatRepository } from "../../../domain/interface/repositoryInterface/IchatRepository"
import { chatModel } from "../../../framework/database/models/chatModel"

export class ChatRepository implements IchatRepository {
    async createChat(chat: Ichat): Promise<Ichat> {
        return chatModel.create(chat)
    }
    // async getchatsOfUser(userId: string | ObjectId): Promise<ChatEntity[] | []> {
    //     return await chatModel.find({
    //         $or: [
    //             { senderId: userId },
    //             { receiverId: userId }
    //         ]
    //     })
    // }
    async getchatsOfUser(userId: string ,pageNo: number): Promise<{ chats: Ichat[], hasMore: boolean }> {
        const limit = 10
        const page = Math.max(pageNo, 1)
        const skip = (page - 1) * limit
        const chats = await chatModel.find({
            $or: [
                { senderId: userId },
                { receiverId: userId }
            ]
        }).sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .populate('senderId', 'name profileImage') // populate senderId with only name and profileImage fields
            .populate('receiverId', 'name profileImage') // populate receiverId similarly

        const totalChats = await chatModel.countDocuments({
            $or: [
                { senderId: userId },
                { receiverId: userId }
            ]
        });

        const hasMore = (skip + chats.length) < totalChats;
        return { chats, hasMore };

    }
    async getChatsOfParticularUsers(senderId: string, receiverId: string): Promise<Ichat | null> {
        return await chatModel.findOne({
            $or: [
                { senderId: senderId, receiverId: receiverId },
                { senderId: receiverId, receiverId: senderId }
            ]
        });
    }
    async updateLastMessage(message: Imessage): Promise<Ichat | null> {
        return await chatModel.findByIdAndUpdate(message.chatId, { lastMessage: message.messageContent, lastMessageAt: message.sendedTime }, { new: true })
    }
    async getChatId(senderId: string, receiverId: string): Promise<Ichat | null> {
        return await chatModel.findOne({
            $or: [
                { senderId: senderId, receiverId: receiverId },
                { senderId: receiverId, receiverId: senderId }
            ]
        }).select('_id chatId')
    }
}
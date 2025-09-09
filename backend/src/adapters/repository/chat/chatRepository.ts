import { chatModel } from "../../../framework/database/models/chatModel";
import { IChat, IChatPopulated } from "../../../domain/entities/chatEntites";
import { IChatRepository } from "../../../domain/interface/repositoryInterface/IChatRepository";
import { IMessage } from "../../../domain/entities/messageEntities";

export class ChatRepository implements IChatRepository {
  async createChat(chat: IChat): Promise<IChatPopulated> {
    const createdChat = await chatModel.create(chat);
    return await chatModel.findById(createdChat._id)
      .populate('senderId', 'name profile_image')
      .populate('receiverId', 'name profile_image') as any as IChatPopulated;
  }

  async getchatOfUser(userId: string,ownerId:string): Promise<IChatPopulated|null> {
    const chat = await chatModel.findOne({
      $or: [
        { senderId: userId,receiverId:ownerId },
        { receiverId: userId,senderId:ownerId }
      ]
    })
    .sort({ lastMessageAt: -1 })
    .populate('senderId', 'name profile_image')
    .populate('receiverId', 'name profile_image');
    
    return chat as any as IChatPopulated
  }

  async findChatsOfUser(userId:string): Promise<{chats:IChatPopulated[]|null}> {
    const result = await chatModel.find({
      $or: [
        { senderId:userId, },
        {receiverId: userId }
      ]
    })
    .sort({ lastMessageAt: -1 })
    .populate('senderId', 'name profile_image')
    .populate('receiverId', 'name profile_image');
    
    const chats = result as any as IChatPopulated[];
    return { chats }
  }

  async updateLastMessage(message: IMessage): Promise<IChat | null> {
    return await chatModel.findByIdAndUpdate(
      message.chatId,
      {
        lastMessage: message.messageContent,
        lastMessageAt: message.sendedTime
      },
      { new: true }
    );
  }
}

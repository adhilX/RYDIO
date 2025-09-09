import { chatModel } from "../../../framework/database/models/chatModel";
import { Ichat, IchatPopulated } from "../../../domain/entities/chatEntites";
import { IchatRepository } from "../../../domain/interface/repositoryInterface/IchatRepository";
import { Imessage } from "../../../domain/entities/messageEntities";

export class ChatRepository implements IchatRepository {
  async createChat(chat: Ichat): Promise<IchatPopulated> {
    const createdChat = await chatModel.create(chat);
    return await chatModel.findById(createdChat._id)
      .populate('senderId', 'name profile_image')
      .populate('receiverId', 'name profile_image') as any as IchatPopulated;
  }

  async getchatOfUser(userId: string,ownerId:string): Promise<IchatPopulated|null> {
    const chat = await chatModel.findOne({
      $or: [
        { senderId: userId,receiverId:ownerId },
        { receiverId: userId,senderId:ownerId }
      ]
    })
    .sort({ lastMessageAt: -1 })
    .populate('senderId', 'name profile_image')
    .populate('receiverId', 'name profile_image');
    
    return chat as any as IchatPopulated
  }

  async findChatsOfUser(userId:string): Promise<{chats:IchatPopulated[]|null}> {
    const result = await chatModel.find({
      $or: [
        { senderId:userId, },
        {receiverId: userId }
      ]
    })
    .sort({ lastMessageAt: -1 })
    .populate('senderId', 'name profile_image')
    .populate('receiverId', 'name profile_image');
    
    const chats = result as any as IchatPopulated[];
    return { chats }
  }

  async updateLastMessage(message: Imessage): Promise<Ichat | null> {
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

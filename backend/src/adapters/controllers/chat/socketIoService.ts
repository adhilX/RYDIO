import { Server, Socket } from "socket.io";
import { IcreateChatUseCase } from "../../../domain/interface/usecaseInterface/chat/IcreateChatUsecase";
import { IcreateMessageUseCase } from "../../../domain/interface/usecaseInterface/message/IcreateMessageUsecase";
import { Imessage } from "../../../domain/entities/messageEntities";

interface IUser {
  socketId: string;
  name: string;
  userId: string;
  role: "user" | "owner";
}

export class SocketIoController {
  private io: Server;
  private users: Map<string, IUser>; // userId -> IUser
  private createChatUsecase: IcreateChatUseCase;
  private createMessageUsecase: IcreateMessageUseCase;

  constructor(io: Server, createChatUsecase: IcreateChatUseCase, createMessageUsecase: IcreateMessageUseCase) {
    this.io = io;
    this.users = new Map();
    this.createChatUsecase = createChatUsecase;
    this.createMessageUsecase = createMessageUsecase;
    this.setUpListeners();
  }

  private setUpListeners() {
    this.io.on("connection", (socket: Socket) => {
      console.log("User connected:", socket.id);

      // Register user when they join
      socket.on("registerUser", (data: { userId: string; name: string; role: "user" | "owner" }) => {
        this.users.set(data.userId, { socketId: socket.id, ...data });
        console.log("User registered:", data);
      });

      // Handle sending messages
      socket.on("sendMessage", async (data: { chatId: string; messageContent: string; senderId: string; receiverId: string; senderModel: 'user' | 'owner' }, callback: (response: { success: boolean; message?: Imessage; error?: string }) => void) => {
        try {
          // First ensure chat exists
          const chatData = {
            senderId: data.senderId,
            receiverId: data.receiverId,
            senderModel: data.senderModel,
            receiverModel: (data.senderModel === 'user' ? 'owner' : 'user') as 'user' | 'owner',
            lastMessage: data.messageContent,
            lastMessageAt: new Date().toISOString()
          };
          const chat = await this.createChatUsecase.createChat(chatData);

          // Create the message
          const messageData: Imessage = {
            chatId: data.chatId || chat._id!,
            messageContent: data.messageContent,
            senderId: data.senderId,
            senderModel: data.senderModel,
            seen: false,
            sendedTime: new Date()
          };
          
          const message = await this.createMessageUsecase.createMessage(messageData);

          // Emit to receiver if online
          const receiver = this.users.get(data.receiverId);
          if (receiver) {
            this.io.to(receiver.socketId).emit("receiveMessage", message);
          }

          // Emit back to sender also
          socket.emit("messageSent", message);

          callback({ success: true, message });
        } catch (error) {
          console.error("Error sending message:", error);
          callback({ success: false, error: "Failed to send message" });
        }
      });

      // Handle disconnection
      socket.on("disconnect", () => {
        console.log("User disconnected:", socket.id);
        [...this.users.entries()].forEach(([userId, user]) => {
          if (user.socketId === socket.id) {
            this.users.delete(userId);
          }
        });
      });
    });
  }
}

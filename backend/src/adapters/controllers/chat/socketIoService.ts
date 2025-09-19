import { Server } from "socket.io";
import { Server as httpServer } from "http"
import { IMessage } from "../../../domain/entities/messageEntities";
import { IUpdateLastMessageUseCase } from "../../../domain/interface/usecaseInterface/chat/IupdateLastMessageUseCase";
import { ICreateMessageUsecase } from "../../../domain/interface/usecaseInterface/message/ICreateMessageUsecase";
import { ICreateNotificationUsecase } from "../../../domain/interface/usecaseInterface/notification/ICreateNotificationUsecase";
import { IUserRepository } from "../../../domain/interface/repositoryInterface/IUserRepository";
import { INotificationRepository } from "../../../domain/interface/repositoryInterface/INotificationRepository";

export class SocketIoController {
  private io: Server
  private userSockets = new Map<string, string>(); // userId -> socketId

  constructor(
    server: httpServer,
    private createMessage: ICreateMessageUsecase,
    private updateLastMessageUseCase: IUpdateLastMessageUseCase,
    private createNotificationUsecase: ICreateNotificationUsecase,
    private userRepository: IUserRepository,
    private notificationRepository: INotificationRepository
  ) {
      this.io = new Server(server, {
        cors: {
          origin: process.env.ORIGIN,
          credentials: true
        }
      })
      this.setSocketIo()
    }

    private setSocketIo() {
      this.io.on('connect', (socket) => {
        console.log(socket.id, 'socked connected')
        socket.emit('connected', socket.id)
        
        // Handle user going online
        socket.on('user-online', (userId) => {
          this.userSockets.set(userId, socket.id);
          socket.broadcast.emit('user-status-changed', { userId, isOnline: true });
        })
        socket.on('join-room', (data) => {
          console.log('User joined room:', data.roomId)
          socket.join(data.roomId)
        })
        socket.on('send-message', async (data) => {
          try {
            const message : IMessage = {
              chatId: data.chatId,
              messageContent: data.messageContent,
              senderId: data.senderId,
              senderModel: data.senderModel,
              seen: data.seen,
              sendedTime: data.sendedTime,
            }

            const result = await this.createMessage.createMessage(message)
            await this.updateLastMessageUseCase.updateLastMessage(result)
            
            const userIsOnline = this.userSockets.has(data.receiverId)
            console.log(userIsOnline,'user is online ')
            if(!userIsOnline){
              // Create notification for offline user
              const receiverModel = data.senderModel === 'user' ? 'owner' : 'user';
              const notification= await this.createNotificationUsecase.createNotification({
                from: data.senderId,
                senderModel: data.senderModel,
                message: data.messageContent.trim(),
                to: data.receiverId,
                receiverModel: receiverModel,
                read: false
              });
              
              // Fetch sender details
              const sender = await this.userRepository.findById(data.senderId);
              
              // Format notification for frontend
              const formattedNotification = {
                ...notification,
                from: {
                  _id: data.senderId,
                  name: sender?.name || 'Unknown User',
                  profileImage: sender?.profile_image || ''
                }
              };
                this.io.emit('notification', formattedNotification);
            }
            const sortedIds = [data.senderId, data.receiverId].sort();
            const roomId = sortedIds[0] + sortedIds[1];

            console.log('Emitting to room:', roomId)
            socket.to(roomId).emit('recive-message', result)
            
          } catch (error) {
            console.error('Error sending message:', error)
            socket.emit('err', 'Failed to send message')
          }
        })
        
        socket.on('typing', (data) => {
          socket.to(data.roomId).emit('typing')
        })

        socket.on('stop-typing', (data) => {
          socket.to(data.roomId).emit('stop-typing')
        })

        // Handle user disconnect
        socket.on('disconnect', () => {
          for (const [userId, socketId] of this.userSockets.entries()) {
            if (socketId === socket.id) {
              this.userSockets.delete(userId);
              socket.broadcast.emit('user-status-changed', { userId, isOnline: false });
              break;
            }
          }
        })

      })


    }
  }

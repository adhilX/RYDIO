import { IMessage } from "../../../domain/entities/messageEntities";
import { IUpdateLastMessageUseCase } from "../../../domain/interface/usecaseInterface/chat/IupdateLastMessageUseCase";
import { ICreateMessageUsecase } from "../../../domain/interface/usecaseInterface/message/ICreateMessageUsecase";
import { ICreateNotificationUsecase } from "../../../domain/interface/usecaseInterface/notification/ICreateNotificationUsecase";
import { IUserRepository } from "../../../domain/interface/repositoryInterface/IUserRepository";
import { getSocketIoServer, SocketIoServer } from "../../../IO";

export class ChatSocketIOAdapter {
  private socketIoServer: SocketIoServer
  constructor(
    private createMessage: ICreateMessageUsecase,
    private updateLastMessageUseCase: IUpdateLastMessageUseCase,
    private createNotificationUsecase: ICreateNotificationUsecase,
    private userRepository: IUserRepository
  ) {
    this.socketIoServer = getSocketIoServer() 
      this.setSocketIo()
  }

    private setSocketIo() {
      this.socketIoServer.getIO().on('connect', (socket) => {
        console.log(socket.id, 'socked connected')
        socket.emit('connected', socket.id)
        
        // Handle user going online
     console.log(this.socketIoServer.ChatOnline)
        socket.on('join-room', (data) => {
          console.log('User joined room:', data.roomId)
          socket.join(data.roomId)
          this.socketIoServer.ChatOnline.set(data.userId, data.roomId)
        })

        socket.on('leave-room', (data) => {
          console.log('User left room:', data.roomId)
          socket.leave(data.roomId)
          this.socketIoServer.ChatOnline.delete(data.userId) // remove from map
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
            
            const userIsOnline = this.socketIoServer.userSockets.has(data.receiverId)
            const receiverRoom = this.socketIoServer.ChatOnline.get(data.receiverId)
            const senderRoom = this.socketIoServer.ChatOnline.get(data.senderId)

            const inSameRoom = receiverRoom && senderRoom && receiverRoom === senderRoom

            console.log(userIsOnline,'user is online ')
            if (userIsOnline && !inSameRoom) {
              // Create notification for offline user
              const receiverModel = data.senderModel === 'user' ? 'owner' : 'user';
              const notification= await this.createNotificationUsecase.createNotification({
                from: data.senderId,
                senderModel: data.senderModel,
                message: data.messageContent.trim(),
                to: data.receiverId,
                receiverModel: receiverModel,
                read: false,
                type: 'info'
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
              console.log('noticaton started')
                this.socketIoServer.getIO().emit('notification', formattedNotification);
                console.log('notifcation end')
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

      })
    }
  }

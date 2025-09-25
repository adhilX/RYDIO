import { LiveNotificationDto} from "../../../domain/interface/DTOs/notificationDto/notificationDto";
import { INotificationManagerAdapter } from "../../../domain/interface/INotificationManager";
import { getSocketIoServer, SocketIoServer } from "../../../IO";

export class NotificationManagerAdapter implements INotificationManagerAdapter {
private io?: SocketIoServer 
    constructor(socketIoServer?: SocketIoServer) {
        if (socketIoServer) {
            this.io = socketIoServer
        }
        // Don't try to get Socket.IO server in constructor if not provided
        // It will be initialized lazily when first needed
    }
    private getSocketIoServer(): SocketIoServer {
        if (!this.io) {
            try {
                this.io = getSocketIoServer()
            } catch (error) {
                console.warn('Socket.IO server not ready yet, notification will be skipped')
                throw error
            }
        }
        return this.io
    }
    
    async sendLiveNotification(notification:LiveNotificationDto): Promise<void> {
        try {
            const socketIoServer = this.getSocketIoServer()
            console.log(socketIoServer.userSockets,'socketIoServer')
            const userSocket = socketIoServer.userSockets.get(notification.to.toString());
            if (userSocket) {
                socketIoServer.getIO().to(userSocket.id).emit('notification', notification);
            }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error'
            console.warn('Failed to send live notification, Socket.IO not ready:', errorMessage)
            // Gracefully handle the case where Socket.IO is not ready
            // The notification will still be stored in the database by other parts of the system
        }
    }
}

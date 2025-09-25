import { Server, Socket } from "socket.io"
import { Server as httpServer } from "http"


export class SocketIoServer {
    private io: Server
    public userSockets = new Map<string, Socket>() // userId -> socketId
    public ChatOnline = new Map<string,string>() //userId -> roomId

    constructor(server:Server) {
        this.io = server
        this.setupSocket()
    }
    public getIO(): Server {
        return this.io;
    }

    setupSocket(){
    this.io.on('connect', (socket:Socket) => {
            console.log(socket.id, 'socked connected')
            socket.emit('connected', socket.id)
        socket.on('user-online', (userId:string) => {
            this.userSockets.set(userId, socket);
            socket.broadcast.emit('user-status-changed', { userId, isOnline: true });
          })
        })
        
        this.io.on('disconnect', (socket:Socket) => {
            for (const [userId, socketId] of this.userSockets.entries()) {
              if (socketId.id === socket.id) {
                this.userSockets.delete(userId);
                socket.broadcast.emit('user-status-changed', { userId, isOnline: false });
                break;
              }
            }
          })
    } 
}

let socketIOServer:SocketIoServer
export const createSocketIOServer = (server:httpServer) => {
    const io = new Server(server, {
                cors: {
                    origin: process.env.ORIGIN,
                    credentials: true
                }
            })

            socketIOServer = new SocketIoServer(io)
            return socketIOServer
}

export const getSocketIoServer = () => {
    if(!socketIOServer){
        throw new Error("IO not found")
    }
    return socketIOServer
}
import { Server } from "socket.io";
import { CreateMessageUseCase } from "../../../useCases/message/createMessageUsecase";
import { Server as httpServer } from "http"
export class SocketIoController {
  private io: Server

  constructor(
    server: httpServer,
    private createMessage: CreateMessageUseCase
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
      socket.on('join-room', (data) => {
        socket.join(data.roomId)
      })


    })




  }
}

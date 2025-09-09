import { io } from 'socket.io-client'

const socket = io("http://localhost:3003", { withCredentials: true, autoConnect: true });
socket.connect()
socket.on('connect_error', (err)=>{
    console.log(err)
})
console.log(socket)

export default socket   
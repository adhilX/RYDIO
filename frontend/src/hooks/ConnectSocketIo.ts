import { io } from 'socket.io-client'
const url = import.meta.env.VITE_SOCKET_URL
const socket = io(url, { withCredentials: true, autoConnect: true });
socket.connect()
socket.on('connect_error', (err)=>{
    console.log(err)
})
console.log(socket)

export default socket   
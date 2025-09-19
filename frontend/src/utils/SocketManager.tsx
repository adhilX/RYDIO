import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import type { RootState } from "../store/store"
import socket from "../hooks/ConnectSocketIo"
import LiveNotification from "@/components/LiveNotification"
import type { NotificationDTO } from "@/Types/notificationDTO"
import type { Notification } from "@/Types/NotificationType"
import { addNotifications, addSingleNotification } from "@/store/slice/notification/notificationSlice"

const SocketManager = () => {
 const [data,setData] = useState<Notification|null>(null)
 const [notification,setNotification] = useState<boolean>(false)

const dispatch = useDispatch()
 const user = useSelector((state:RootState)=>state.auth.user)
 
 useEffect(()=>{
   if (!user) return
   socket.connect()
   socket.emit('register', { userId: user._id, name: user.name }, (data: NotificationDTO[]) => {
       dispatch(addNotifications(data))
   })

   socket.on('notification', (data) => {
       // Only show notification if current user is the receiver
       if (data.to === user._id) {
           const notification: Notification = {
               from: data.from,
               message: data.message,
               read: data.read,
               type: 'info'
           }
           setData(notification)
           dispatch(addSingleNotification(data))
           setNotification(true)
       }
   })

   return () => {
       socket.disconnect()
       socket.off('notification')
   }},[user])

if (!user) return null

return     ( <>
{notification && (
    <LiveNotification
        notification={data!}
        onClose={() => setNotification(false)}
        duration={5000}
    />
)}
</>
)

}

export default SocketManager
import { useEffect } from "react"
import { useSelector } from "react-redux"
import type { RootState } from "../store/store"
import socket from "../hooks/ConnectSocketIo"

const SocketManager = () => {
//  const [data,setData] = useState<Notification|null>(null)
//  const [notification,setNotification] = useState<boolean>(false)


 const user = useSelector((state:RootState)=>state.auth.user)
 if (!user) return 
useEffect(()=>{
   socket.connect()
},[user])

return <></>


}

export default SocketManager
import { useEffect } from "react"
import { getIncomingBooking } from "@/services/user/incommingBookingSevice"
import type { RootState } from "@/store/store";
import { useSelector } from "react-redux";

function IncomingBookings() {



const user  =  useSelector((state: RootState) => state.auth.user);
  useEffect(()=>{
   getIncomingBooking(user?._id as string,'','all',1,10)
    // console.log(data)
  },[user])
  return (
    <div>
        <h1>incoming bookings</h1>
    </div>
  )
}

export default IncomingBookings
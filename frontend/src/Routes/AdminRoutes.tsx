import Index from "@/pages/Admin/Index"
import AdminLogin from "@/pages/Admin/Login"
import { Route, Routes } from "react-router"

export const AdminRoutes  =()=>{

return(

<Routes>
    <Route path="/login" element={<AdminLogin/>}/>
    <Route path="/" element={<Index/>}/>
    <Route path="/user-managment" element={<Index/>}/>

</Routes>
)
}
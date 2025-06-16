import { Route, Routes } from "react-router"

export const AdminRoutes  =()=>{

return(

<Routes>
    <Route path="/login" element={<><h1>admin login</h1></>}/>
    <Route path="/" element={<><h1>admin home</h1></>}/>
</Routes>
)
}
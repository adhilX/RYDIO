import LandingPage from "@/pages/User/Landing"
import Login from "@/pages/User/Login"
import SignupPage from "@/pages/User/SignUp"
import {Route, Routes } from "react-router"

export const UserRoutes = ()=>{

   
    return (
       
        <Routes>
            <Route path= '/' element={ <LandingPage/> }/>
            <Route path= '/login' element={ <Login/> }/>
            <Route path= '/signup' element={ <SignupPage/> }/>
            <Route path= '/test' element={ <><h1>home</h1></> }/>
        </Routes>

    )
}
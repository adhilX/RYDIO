import ForgotPassword from "@/pages/User/ForgotPassword"
import LandingPage from "@/pages/User/Landing"
import Login from "@/pages/User/Login"
import SignupPage from "@/pages/User/SignUp"
import {Route, Routes } from "react-router"
import ProtectedRoute from "./ProtectedRoutes/ProtectedRoutes"

export const UserRoutes = ()=>{

   
    return (
       
        <Routes>
          
            <Route path= '/login' element={  <ProtectedRoute><Login/></ProtectedRoute>  }/>
            <Route path= '/signup' element={ <ProtectedRoute><SignupPage/></ProtectedRoute>  }/>
            <Route path= '/forgetpassword' element={<ProtectedRoute><ForgotPassword/></ProtectedRoute>  }/>
            
            <Route path= '/' element={ <LandingPage/> }/>
            <Route path= '/test' element={ <><h1>home</h1></> }/>
        </Routes>

    )
}
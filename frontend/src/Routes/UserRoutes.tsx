import UserProfile from "@/components/user/Dashboard/userProfile"
import AddVehicleForm from "@/pages/User/AddVehicleForm"
import ForgotPassword from "@/pages/User/auth/ForgotPassword"
import Login from "@/pages/User/auth/Login"
import SignupPage from "@/pages/User/auth/SignUp"
import LandingPage from "@/pages/User/Landing"
import Layout from "@/pages/User/layout"
import { Route, Routes } from "react-router"


export const UserRoutes = () => {


    return (

        <Routes>

            <Route path='/login' element={<Login />} />
            <Route path='/signup' element={<SignupPage />} />
            <Route path='/forgetpassword' element={<ForgotPassword />} />

            <Route path='/' element={<LandingPage />} />
            <Route path="/userprofile" element={<Layout />}>
                <Route index element={<UserProfile />} /> 
                <Route path="vehicles" element={<AddVehicleForm />} />     
            </Route>   
            <Route path='/test' element={<><h1>home</h1></>} />
        </Routes>

    )
}
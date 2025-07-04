import UserProfile from "@/components/user/Dashboard/userProfile"
import AddVehicleForm from "@/pages/User/AddVehicleForm"
import ForgotPassword from "@/pages/User/auth/ForgotPassword"
import Login from "@/pages/User/auth/Login"
import SignupPage from "@/pages/User/auth/SignUp"
import LandingPage from "@/pages/User/Landing"
import Layout from "@/pages/User/layout"
import { Route, Routes } from "react-router"
import UserProtectedRoute from "./ProtectedRoutes/userProtectedRoute"
import ProtectedRoute from "./ProtectedRoutes/ProtectedRoutes"
import ChangePassword from "@/components/user/Dashboard/ChagePassword"
import Wallet from "@/components/user/Dashboard/Wallet"
import ListVehilce from "@/components/user/Dashboard/ListVehilce"
import UserVehicleList from "@/pages/User/UserVehicleList"
import VehicleDetailPage from "@/pages/User/VehicleDetailPage"


export const UserRoutes = () => {


    return (

        <Routes>
            <Route path='/login' element={<ProtectedRoute><Login /></ProtectedRoute>} />
            <Route path='/signup' element={<ProtectedRoute><SignupPage /></ProtectedRoute>} />
            <Route path='/forgetpassword' element={<ProtectedRoute><ForgotPassword /></ProtectedRoute>} />

            <Route path='/' element={<LandingPage />} />
            <Route path='/vehicle-list' element={<UserVehicleList />} />
            <Route path='/vehicle-details/:id' element={ <VehicleDetailPage/>} />
            <Route
                path="/userprofile"
                element={
                    <UserProtectedRoute>
                        <Layout />
                    </UserProtectedRoute>
                }
            >
                <Route index element={
                    <UserProtectedRoute>
                        <UserProfile />
                    </UserProtectedRoute>
                } />
                <Route
                    path="vehicles"
                    element={
                        <UserProtectedRoute>
                            <ListVehilce />
                        </UserProtectedRoute>
                    }
                />
                <Route
                    path="add-vehicle"
                    element={
                        <UserProtectedRoute>
                            <AddVehicleForm />
                        </UserProtectedRoute>
                    }
                />
                <Route
                    path="change-password"
                    element={
                        <UserProtectedRoute>
                            <ChangePassword />
                        </UserProtectedRoute>
                    }
                />
                <Route
                    path="wallet"
                    element={
                        <UserProtectedRoute>
                            <Wallet />
                        </UserProtectedRoute>
                    }
                />
            </Route>
            <Route path='/test' element={<><h1>home</h1></>} />
        </Routes>

    )
}
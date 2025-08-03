import React, { lazy, Suspense } from "react"
import UserProfile from "@/components/user/Dashboard/userProfile"
import AddVehicleForm from "@/pages/User/AddVehicleForm"
import ForgotPassword from "@/pages/User/auth/ForgotPassword"
import Login from "@/forms/Login"
import LandingPage from "@/pages/User/Landing"
import { Route, Routes } from "react-router"
import UserProtectedRoute from "./ProtectedRoutes/userProtectedRoute"
const Layout = lazy(() => import("@/layout/user/layout"));
import ProtectedRoute from "./ProtectedRoutes/ProtectedRoutes"
import ChangePassword from "@/components/user/Dashboard/ChagePassword"
import Wallet from "@/components/user/Dashboard/Wallet"
import ListVehilce from "@/components/user/Dashboard/MyVehilce"
import UserVehicleList from "@/pages/User/UserVehicleList"
import VehicleDetailPage from "@/pages/User/VehicleDetailPage"
import BookingConfirmation from "@/pages/User/BookingConfirmation"
import SignupPage from "@/forms/SignUp"
import { Elements } from "@stripe/react-stripe-js"
import { loadStripe } from "@stripe/stripe-js"
import PaymentSuccess from "@/pages/User/PaymentSuccess"
import MyBooking from "@/components/user/Dashboard/MyBooking"
const CheckoutForm = React.lazy(() => import("@/pages/User/CheckoutForm"))
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY!);

export const UserRoutes = () => {

    return (
        <Routes>
            <Route path='/login' element={<ProtectedRoute><Login /></ProtectedRoute>} />
            <Route path='/signup' element={<ProtectedRoute><SignupPage /></ProtectedRoute>} />
            <Route path='/forgetpassword' element={<ProtectedRoute><ForgotPassword /></ProtectedRoute>} />
            <Route path='/' element={<LandingPage />} />
            <Route path='/vehicle-list' element={<UserProtectedRoute><UserVehicleList /></UserProtectedRoute>} />
            <Route path='/vehicle-details/:id' element={<UserProtectedRoute><VehicleDetailPage /></UserProtectedRoute>} />
            <Route path="/booking-confirmation" element={<UserProtectedRoute><BookingConfirmation /></UserProtectedRoute>} />
            <Route path="/payment-success" element={<UserProtectedRoute><PaymentSuccess /></UserProtectedRoute>} />
            <Route
                path="/payment"
                element={
                    <Elements stripe={stripePromise}>
                        <UserProtectedRoute>
                            <Suspense fallback={<div>Loading...</div>}>
                                <CheckoutForm />
                            </Suspense>
                        </UserProtectedRoute>
                    </Elements>
                }
            />
            <Route
                path="/userprofile"
                element={
                    <UserProtectedRoute >
                        <Suspense fallback={<div>Loading...</div>}>
                            <Layout />
                        </Suspense>
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
                <Route
                    path="my-bookings"
                    element={
                        <UserProtectedRoute>
                            <MyBooking />
                        </UserProtectedRoute>
                    }
                />
            </Route>

            <Route path='/test' element={<><h1>home</h1></>} />
        </Routes>
    )
}
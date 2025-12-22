import React, { lazy, Suspense } from "react"
import UserProfile from "@/components/user/Dashboard/userProfile"
import AddVehicleForm from "@/pages/User/AddVehicleForm"
import ForgotPassword from "@/pages/User/auth/ForgotPassword"
import Login from "@/forms/Login"
import LandingPage from "@/pages/User/Landing"
import { Route, Routes } from "react-router"
import TokenProtected from "./ProtectedRoutes/tokenProtected"
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
import IncomingBookings from "@/components/user/Dashboard/IncomingBookings"
import LoadingSpinner from "@/components/LoadingSpinner"
const ChatLayout = React.lazy(() => import("@/layout/user/ChatLayout"))
const MessageTemplate = React.lazy(() => import("@/components/chat/MessageTemplate"))
const MessageContainer = React.lazy(() => import("@/components/chat/MessageContainer"))
const CheckoutForm = React.lazy(() => import("@/pages/User/CheckoutForm"))
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY!);

import Particles from "@/components/common/Particles";

const FallbackLoader = () => (
    <div className="min-h-screen bg-black flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-neutral-950/80 z-0" />
        <Particles className="absolute inset-0 z-0 animate-fade-in" quantity={100} ease={80} refresh />
        <div className="relative z-10 text-white">
            <LoadingSpinner />
        </div>
    </div>
);

export const UserRoutes = () => {

    return (
        <Routes>
            <Route path='/login' element={<ProtectedRoute><Login /></ProtectedRoute>} />
            <Route path='/signup' element={<ProtectedRoute><SignupPage /></ProtectedRoute>} />
            <Route path='/forgetpassword' element={<ProtectedRoute><ForgotPassword /></ProtectedRoute>} />
            <Route path='/' element={<LandingPage />} />
            <Route path='/vehicle-list' element={<TokenProtected><UserVehicleList /></TokenProtected>} />
            <Route path='/vehicle-details/:id' element={<TokenProtected><VehicleDetailPage /></TokenProtected>} />
            <Route path="/booking-confirmation" element={<TokenProtected><BookingConfirmation /></TokenProtected>} />
            <Route path="/payment-success" element={<TokenProtected><PaymentSuccess /></TokenProtected>} />
            <Route path="/payment" element={<Elements stripe={stripePromise}><TokenProtected><Suspense
                fallback={<FallbackLoader />}><CheckoutForm /></Suspense></TokenProtected></Elements>} />
            <Route path="/userprofile" element={<TokenProtected><Suspense
                fallback={<FallbackLoader />}><Layout /></Suspense></TokenProtected>}>
                <Route index element={<TokenProtected><UserProfile /></TokenProtected>} />
                <Route path="vehicles" element={<TokenProtected><ListVehilce /></TokenProtected>} />
                <Route path="add-vehicle" element={<TokenProtected><AddVehicleForm /></TokenProtected>} />
                <Route path="change-password" element={<TokenProtected><ChangePassword /></TokenProtected>} />
                <Route path="wallet" element={<TokenProtected><Wallet /></TokenProtected>} />
                <Route path="my-bookings" element={<TokenProtected><MyBooking /></TokenProtected>} />
                <Route path="incoming-bookings" element={<TokenProtected><IncomingBookings /></TokenProtected>} />
            </Route>
            <Route path='/chat' element={<TokenProtected><ChatLayout /></TokenProtected>}>
                <Route index element={<MessageTemplate />} />
                <Route path=':chatId' element={<TokenProtected><MessageContainer /></TokenProtected>} />
            </Route>
            <Route path='/test' element={<><h1>home</h1></>} />
        </Routes>
    )
}
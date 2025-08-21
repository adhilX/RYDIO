import React, { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { ArrowLeft, Car, Fuel, Users, Settings, MapPin, Phone, Mail, CheckCircle, Calendar, CreditCard, Sparkles } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { useNavigate, useLocation } from "react-router-dom"
import toast from "react-hot-toast"
import { getCheckoutSession, getSecurityDeposit } from "@/services/user/bookingService"
import { useSelector } from "react-redux"
import type { RootState } from "@/store/store"
import type { BookingData } from "@/Types/User/Booking/BookingData"
const IMG_URL = import.meta.env.VITE_IMAGE_URL

const BookingConfirmation = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [paymentMethod, setPaymentMethod] = useState<'wallet' | 'stripe'>('stripe')
  const [isProcessing, setIsProcessing] = useState(false)
  const [address, setAddress] = useState('')
  const [city, setCity] = useState('')
  const [securityDeposit, setSecurityDeposit] = useState(0)
  const [errors, setErrors] = useState<{ address?: string; city?: string }>({})

  useEffect(() => {
    const fetchdepostdata = async () => {
     const deposit = await getSecurityDeposit()
     setSecurityDeposit(deposit*days)
    }
    fetchdepostdata()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[])

  const user = useSelector((state: RootState) => state.auth.user)
  if (!user)return 
 
  const bookingData: BookingData = location.state?.bookingData
  console.log(bookingData,"bookingData")

  if (!bookingData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#232b3a] via-[#1a1f2a] to-[#232b3a] flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center text-white bg-black/20 backdrop-blur-xl p-8 rounded-2xl border border-white/10"
        >
          <Sparkles className="w-16 h-16 text-[#6DA5C0] mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-4">No Booking Data Found</h2>
          <p className="text-gray-300 mb-6">Please go back and select your booking details.</p>
          <Button onClick={() => navigate(-1)} className="bg-[#6DA5C0] hover:bg-[#232b3a]">
            Go Back
          </Button>
        </motion.div>
      </div>
    )
  }
  const { vehicle, startDate, endDate,total_amount, days } = bookingData

  const validateForm = () => {
    const newErrors: { address?: string; city?: string } = {}
    if (!address.trim()) {
      newErrors.address = "Address is required"
    } else if (address.trim().length < 5) {
      newErrors.address = "Address must be at least 5 characters long"
    }
    if (!city.trim()) {
      newErrors.city = "City is required"
    } else if (city.trim().length < 2) {
      newErrors.city = "City must be at least 2 characters long"
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const newBookingDate = {
    vehicle_id: vehicle._id,
    total_amount:total_amount+securityDeposit,
    start_date: startDate,
    end_date: endDate,
    user_id: user?._id,
    name: user?.name,
    phone: user?.phone,
    id_proof: user?.idproof_id,
    city,
    address
  }
  const getFuelIcon = (fuel_type: string) => {
    switch (fuel_type) {
      case "petrol":
        return <Fuel className="w-4 h-4 text-orange-400" />;
      case "diesel":
        return <Fuel className="w-4 h-4 text-yellow-400" />;
      case "electric":
        return <Fuel className="w-4 h-4 text-green-400" />;
      default:
        return <Fuel className="w-4 h-4 text-gray-400" />;
    }
  }

  const publishable_key = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY

  const handlePayment = async () => {
    if (!validateForm()) {
      toast.error("Please fix the errors in the form")
      return
    }
    setIsProcessing(true)
    try {
      const stripeLib = await import("@stripe/stripe-js")
      const stripeInstance = await stripeLib.loadStripe(publishable_key)
      const response = await getCheckoutSession({...bookingData,user_id:user._id!})
      console.log(stripeInstance)
      console.log(response.sessionId)

      navigate('/payment', { state: { clientSecret: response.sessionId, bookingData: newBookingDate } })
    } catch (error) {
      console.error("Payment failed:", error)
      toast.error(error instanceof Error ? error.message : "Payment failed")
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#232b3a] via-[#1a1f2a] to-[#232b3a] text-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-4 mb-8"
        >
          <Button
            onClick={() => navigate(-1)}
            variant="ghost"
            className="text-white hover:bg-white/10 border border-white/20"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back
          </Button>
          <div className="flex-1">
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-[#6DA5C0] to-[#4a90a8] bg-clip-text text-transparent">
              Booking Confirmation
            </h1>
            <p className="text-gray-300 mt-2">Review your booking details and complete payment</p>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Vehicle Details */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-2 space-y-6"
          >
            {/* Vehicle Information */}
            <Card className="bg-black/40 backdrop-blur-xl border border-white/10 shadow-2xl">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Car className="w-5 h-5 text-[#6DA5C0]" />
                  Vehicle Details
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-start gap-6">
                  <motion.img
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    src={IMG_URL + vehicle.image_urls[0] || "/placeholder.svg"}
                    alt={vehicle.name}
                    className="w-32 h-24 rounded-xl object-cover shadow-lg"
                  />
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-white mb-2">{vehicle.name}</h3>
                    <p className="text-[#6DA5C0] mb-4 text-lg">{vehicle.brand}</p>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center gap-2 bg-white/5 p-2 rounded-lg">
                        {getFuelIcon(vehicle.fuel_type)}
                        <span className="text-gray-300">Fuel: {vehicle.fuel_type}</span>
                      </div>
                      <div className="flex items-center gap-2 bg-white/5 p-2 rounded-lg">
                        <Users className="w-4 h-4 text-[#6DA5C0]" />
                        <span className="text-gray-300">Seats: {vehicle.seats}</span>
                      </div>
                      <div className="flex items-center gap-2 bg-white/5 p-2 rounded-lg">
                        <Car className="w-4 h-4 text-green-400" />
                        <span className="text-gray-300">Type: {vehicle.car_type}</span>
                      </div>
                      <div className="flex items-center gap-2 bg-white/5 p-2 rounded-lg">
                        <Settings className="w-4 h-4 text-yellow-400" />
                        <span className="text-gray-300">
                          {vehicle.automatic ? "Automatic" : "Manual"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Location Information */}
            <Card className="bg-black/40 backdrop-blur-xl border border-white/10 shadow-2xl">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-[#6DA5C0]" />
                  Pickup Location
                </CardTitle>
              </CardHeader>
              <CardContent>
                {vehicle?.location_id ? (
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-[#6DA5C0]/20 rounded-full">
                      <MapPin className="w-6 h-6 text-[#6DA5C0]" />
                    </div>
                    <div>
                      <p className="font-semibold text-white text-lg">{vehicle?.location_id.name}</p>
                      <p className="text-gray-300 mt-1">
                        {vehicle.location_id.address}
                      </p>
                      <p className="text-gray-400 mt-1">
                        {vehicle.location_id.city}, {vehicle.location_id.state} - {vehicle.location_id.pincode}
                      </p>
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-400">Location information not available</p>
                )}
              </CardContent>
            </Card>

            {/* Owner Information */}
            <Card className="bg-black/40 backdrop-blur-xl border border-white/10 shadow-2xl">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-[#6DA5C0]" />
                  Owner Details
                </CardTitle>
              </CardHeader>
              <CardContent>
                {vehicle.owner_id ? (
                  <div className="flex items-start gap-6">
                    <div className="relative">
                      <motion.img
                        initial={{ scale: 0.8 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.3 }}
                        src={IMG_URL + vehicle.owner_id.profile_image || "/placeholder.svg?height=60&width=60"}
                        alt={vehicle.owner_id.name}
                        width={70}
                        height={70}
                        className="rounded-full object-cover border-2 border-[#6DA5C0]/50"
                      />
                      {vehicle.owner_id.is_verified_user && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: 0.4 }}
                          className="absolute -bottom-1 -right-1"
                        >
                          <CheckCircle className="w-6 h-6 text-green-500 bg-black rounded-full" />
                        </motion.div>
                      )}
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <h4 className="font-bold text-white text-lg">{vehicle.owner_id.name}</h4>
                        {vehicle.owner_id.is_verified_user && (
                          <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                            Verified
                          </Badge>
                        )}
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-center gap-3 bg-white/5 p-3 rounded-lg">
                          <Mail className="w-4 h-4 text-[#6DA5C0]" />
                          <span className="text-gray-300">{vehicle.owner_id.email}</span>
                        </div>

                        {vehicle.owner_id.phone && (
                          <div className="flex items-center gap-3 bg-white/5 p-3 rounded-lg">
                            <Phone className="w-4 h-4 text-[#6DA5C0]" />
                            <span className="text-gray-300">{vehicle.owner_id.phone}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-400">Owner information not available</p>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Booking Summary and Payment */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            {/* Booking Summary */}
            <Card className="bg-black/40 backdrop-blur-xl border border-white/10 shadow-2xl">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-[#6DA5C0]" />
                  Booking Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3 bg-white/5 p-3 rounded-lg">
                  <Calendar className="w-5 h-5 text-[#6DA5C0]" />
                  <div className="flex-1">
                    <p className="text-sm text-gray-400">Rental Period</p>
                    <p className="text-white font-semibold">
                      {new Date(startDate).toLocaleDateString()} - {new Date(endDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 bg-white/5 p-3 rounded-lg">
                  <Car className="w-5 h-5 text-[#6DA5C0]" />
                  <div className="flex-1">
                    <p className="text-sm text-gray-400">Duration</p>
                    <p className="text-white font-semibold">{days} day{days > 1 ? 's' : ''}</p>
                  </div>
                </div>

                <Separator className="bg-white/20" />

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Price per day</span>
                    <span className="text-white font-medium">₹{vehicle.price_per_day.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Duration</span>
                    <span className="text-white font-medium">{days} day{days > 1 ? 's' : ''}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Security Deposit</span>
                    <span className="text-white font-medium">₹{securityDeposit}</span>
                  </div>
                  <Separator className="bg-white/20" />
                  <div className="flex justify-between items-center text-xl font-bold">
                    <span className="text-white">Total Amount</span>
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#6DA5C0] to-[#4a90a8]">
                      ₹{total_amount + securityDeposit}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-black/40 backdrop-blur-xl border border-white/10 shadow-2xl">
              <CardHeader>
                <CardTitle className="text-white">Your Contact Info</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div>
                    <label className="text-gray-300 block mb-1">Address</label>
                    <input
                      type="text"
                      value={address}
                      onChange={(e) => {
                        setAddress(e.target.value)
                        setErrors((prev) => ({ ...prev, address: undefined }))
                      }}
                      placeholder="Street address"
                      className={`w-full px-4 py-2 bg-white/10 border ${
                        errors.address ? 'border-red-500' : 'border-white/20'
                      } rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#6DA5C0]`}
                    />
                    {errors.address && (
                      <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-red-400 text-sm mt-1"
                      >
                        {errors.address}
                      </motion.p>
                    )}
                  </div>
                  <div>
                    <label className="text-gray-300 block mb-1">City</label>
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => {
                        setCity(e.target.value)
                        setErrors((prev) => ({ ...prev, city: undefined }))
                      }}
                      placeholder="Enter city"
                      className={`w-full px-4 py-2 bg-white/10 border ${
                        errors.city ? 'border-red-500' : 'border-white/20'
                      } rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#6DA5C0]`}
                    />
                    {errors.city && (
                      <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-red-400 text-sm mt-1"
                      >
                        {errors.city}
                      </motion.p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Payment Method */}
            <Card className="bg-black/40 backdrop-blur-xl border border-white/10 shadow-2xl">
              <CardHeader>
                <CardTitle className="text-white">Payment Method</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <motion.label
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex items-center gap-3 p-4 rounded-xl border border-white/20 cursor-pointer hover:bg-white/5 transition-all"
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="stripe"
                      checked={paymentMethod === 'stripe'}
                      onChange={(e) => setPaymentMethod(e.target.value as 'wallet' | 'stripe')}
                      className="text-[#6DA5C0]"
                    />
                    <CreditCard className="w-6 h-6 text-green-400" />
                    <div>
                      <p className="font-semibold text-white">Credit/Debit Card</p>
                      <p className="text-sm text-gray-400">Pay securely with Stripe</p>
                    </div>
                  </motion.label>
                </div>
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    onClick={handlePayment}
                    disabled={isProcessing || !!errors.address || !!errors.city || !address || !city}
                    className="w-full bg-gradient-to-r from-[#6DA5C0] to-[#4a90a8] hover:from-[#5a8ba0] hover:to-[#3a7a8c] text-white font-semibold py-3 rounded-xl shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    size="lg"
                  >
                    {isProcessing ? (
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Processing...
                      </div>
                    ) : (
                      `Pay ₹${total_amount}`
                    )}
                  </Button>
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default React.memo(BookingConfirmation)
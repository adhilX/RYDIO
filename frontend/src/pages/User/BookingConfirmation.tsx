import React, { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { ArrowLeft, Car, Fuel, Users, Settings, MapPin, Phone, Mail, CheckCircle, Calendar, CreditCard, Sparkles } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
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

  const user = useSelector((state: RootState) => state.auth.user)
  const bookingData: BookingData = location.state?.bookingData
  const { vehicle, startDate, endDate, total_amount, days } = bookingData || {}

  useEffect(() => {
    if (!bookingData) return
    const fetchdepostdata = async () => {
      const deposit = await getSecurityDeposit()
      setSecurityDeposit(deposit * days)
    }
    fetchdepostdata()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [days])

  if (!user || !bookingData) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center text-white bg-black/40 backdrop-blur-xl p-8 rounded-3xl border border-white/10 max-w-md w-full"
        >
          <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6 border border-white/10 shadow-[0_0_30px_rgba(255,255,255,0.05)]">
            <Sparkles className="w-8 h-8 text-white/80" />
          </div>
          <h2 className="text-2xl font-bold mb-3">No Booking Data Found</h2>
          <p className="text-gray-400 mb-8 leading-relaxed">It seems like there was an issue retrieving your booking details. Please try selecting your vehicle again.</p>
          <Button onClick={() => navigate(-1)} className="bg-white text-black hover:bg-gray-200 font-bold px-8 h-12 rounded-xl w-full">
            Go Back
          </Button>
        </motion.div>
      </div>
    )
  }

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
    total_amount: total_amount + securityDeposit,
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
        return <Fuel className="w-4 h-4 text-amber-500" />;
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
      const response = await getCheckoutSession({ ...bookingData, user_id: user._id! })

      if (!stripeInstance) throw new Error("Stripe failed to load")

      navigate('/payment', { state: { clientSecret: response.sessionId, bookingData: newBookingDate } })
    } catch (error) {
      console.error("Payment failed:", error)
      toast.error(error instanceof Error ? error.message : "Payment failed")
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="min-h-screen font-sans text-white pb-20 bg-neutral-950 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(255,255,255,0.15),rgba(255,255,255,0))]">

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12"
        >
          <div className="flex items-center gap-4">
            <Button
              onClick={() => navigate(-1)}
              variant="ghost"
              className="bg-white/5 hover:bg-white/10 text-white rounded-xl p-3 h-auto border border-white/5 transition-all"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-white mb-1">
                Confirm Booking
              </h1>
              <p className="text-gray-400 text-sm">Review details and complete your reservation.</p>
            </div>
          </div>

          <div className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
            <span className="text-xs font-semibold text-gray-300 uppercase tracking-wider">Secure Checkout</span>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content - Left Column */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-2 space-y-6"
          >
            {/* Vehicle Card */}
            <div className="bg-black/40 backdrop-blur-md border border-white/10 rounded-3xl overflow-hidden hover:border-white/20 transition-all duration-300">
              <div className="p-6 md:p-8">
                <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                  <div className="p-2 bg-white/5 rounded-lg border border-white/5">
                    <Car className="w-5 h-5 text-gray-200" />
                  </div>
                  Vehicle Details
                </h2>

                <div className="flex flex-col md:flex-row gap-8">
                  <div className="w-full md:w-48 aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl border border-white/5 relative group">
                    <img
                      src={IMG_URL + vehicle.image_urls[0] || "/placeholder.svg"}
                      alt={vehicle.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60"></div>
                  </div>

                  <div className="flex-1 space-y-4">
                    <div>
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-2xl font-bold text-white mb-1">{vehicle.name}</h3>
                          <p className="text-gray-400 font-medium">{vehicle.brand}</p>
                        </div>
                        <Badge className="bg-white text-black font-bold uppercase tracking-wider border-0">
                          {vehicle.car_type}
                        </Badge>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 pt-2">
                      <div className="bg-white/5 p-3 rounded-xl border border-white/5">
                        <div className="text-xs text-gray-500 uppercase font-bold mb-1">Fuel Type</div>
                        <div className="flex items-center gap-2 text-white">
                          {getFuelIcon(vehicle.fuel_type)}
                          <span className="capitalize">{vehicle.fuel_type}</span>
                        </div>
                      </div>
                      <div className="bg-white/5 p-3 rounded-xl border border-white/5">
                        <div className="text-xs text-gray-500 uppercase font-bold mb-1">Transmission</div>
                        <div className="flex items-center gap-2 text-white">
                          <Settings className="w-4 h-4 text-gray-400" />
                          <span>{vehicle.automatic ? "Automatic" : "Manual"}</span>
                        </div>
                      </div>
                      <div className="bg-white/5 p-3 rounded-xl border border-white/5">
                        <div className="text-xs text-gray-500 uppercase font-bold mb-1">Capacity</div>
                        <div className="flex items-center gap-2 text-white">
                          <Users className="w-4 h-4 text-gray-400" />
                          <span>{vehicle.seats} Seats</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Location & Owner Split */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Location */}
              <div className="bg-black/40 backdrop-blur-md border border-white/10 rounded-3xl p-6 md:p-8 hover:border-white/20 transition-all duration-300">
                <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-3">
                  <div className="p-2 bg-white/5 rounded-lg border border-white/5">
                    <MapPin className="w-5 h-5 text-gray-200" />
                  </div>
                  Pickup Location
                </h2>

                {vehicle?.location_id ? (
                  <div className="pl-3 border-l-2 border-white/10 space-y-2">
                    <p className="font-bold text-white text-lg">{vehicle?.location_id.name}</p>
                    <p className="text-gray-400 text-sm leading-relaxed">{vehicle.location_id.address}</p>
                    <p className="text-gray-500 text-xs font-mono uppercase tracking-wider">
                      {vehicle.location_id.city}, {vehicle.location_id.state} • {vehicle.location_id.pincode}
                    </p>
                  </div>
                ) : (
                  <p className="text-gray-500 italic">Location info unavailable</p>
                )}
              </div>

              {/* Owner */}
              <div className="bg-black/40 backdrop-blur-md border border-white/10 rounded-3xl p-6 md:p-8 hover:border-white/20 transition-all duration-300">
                <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-3">
                  <div className="p-2 bg-white/5 rounded-lg border border-white/5">
                    <CheckCircle className="w-5 h-5 text-gray-200" />
                  </div>
                  Hosted By
                </h2>

                {vehicle.owner_id ? (
                  <div className="flex items-center gap-4">
                    <div className="relative shrink-0">
                      <div className="w-14 h-14 rounded-full p-0.5 bg-gradient-to-br from-white/20 to-transparent border border-white/10">
                        <img
                          src={IMG_URL + vehicle.owner_id.profile_image || "/placeholder.svg?height=60&width=60"}
                          alt={vehicle.owner_id.name}
                          className="w-full h-full rounded-full object-cover"
                        />
                      </div>
                      {vehicle.owner_id.is_verified_user && (
                        <div className="absolute -bottom-1 -right-1 bg-black rounded-full p-0.5">
                          <CheckCircle className="w-4 h-4 text-white fill-blue-500" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-white truncate">{vehicle.owner_id.name}</h4>
                      <div className="flex flex-col gap-1 mt-1">
                        <div className="flex items-center gap-2 text-xs text-gray-400">
                          <Mail className="w-3 h-3" />
                          <span className="truncate">{vehicle.owner_id.email}</span>
                        </div>
                        {vehicle.owner_id.phone && (
                          <div className="flex items-center gap-2 text-xs text-gray-400">
                            <Phone className="w-3 h-3" />
                            <span>{vehicle.owner_id.phone}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-500 italic">Owner info unavailable</p>
                )}
              </div>
            </div>
          </motion.div>

          {/* Sidebar - Right Column */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            {/* Payment Summary */}
            <div className="bg-black/40 backdrop-blur-md border border-white/10 rounded-3xl p-6 md:p-8 hover:border-white/20 transition-all duration-300 shadow-2xl shadow-black/50">
              <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-3">
                <div className="p-2 bg-white/5 rounded-lg border border-white/5">
                  <CreditCard className="w-5 h-5 text-gray-200" />
                </div>
                Payment Summary
              </h2>

              <div className="space-y-4">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-400">Rental Price</span>
                  <span className="text-white font-medium">₹{vehicle.price_per_day.toLocaleString()} / day</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-400">Duration</span>
                  <span className="text-white font-medium">{days} Days</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-400">Security Deposit</span>
                  <span className="text-white font-medium">₹{securityDeposit.toLocaleString()}</span>
                </div>

                <div className="py-4 border-y border-white/10 my-2">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-white">Total</span>
                    <span className="text-2xl font-bold text-white">₹{(total_amount + securityDeposit).toLocaleString()}</span>
                  </div>
                </div>

                {/* Payment Method Selection */}
                <div className="pt-2">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 block">Payment Method</label>
                  <label
                    className={`flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-all ${paymentMethod === 'stripe' ? 'bg-white/10 border-white text-white' : 'bg-transparent border-white/10 text-gray-400 hover:bg-white/5'}`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="stripe"
                      checked={paymentMethod === 'stripe'}
                      onChange={(e) => setPaymentMethod(e.target.value as 'wallet' | 'stripe')}
                      className="hidden"
                    />
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentMethod === 'stripe' ? 'border-white' : 'border-gray-500'}`}>
                      {paymentMethod === 'stripe' && <div className="w-2.5 h-2.5 rounded-full bg-white"></div>}
                    </div>
                    <div className="flex items-center gap-3">
                      <CreditCard className="w-5 h-5" />
                      <div className="flex flex-col">
                        <span className="font-bold text-sm">Card Payment</span>
                        <span className="text-[10px] opacity-70">Secured by Stripe</span>
                      </div>
                    </div>
                  </label>
                </div>
              </div>
            </div>

            {/* Contact Details Form */}
            <div className="bg-black/40 backdrop-blur-md border border-white/10 rounded-3xl p-6 md:p-8 hover:border-white/20 transition-all duration-300">
              <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-3">
                <div className="p-2 bg-white/5 rounded-lg border border-white/5">
                  <Calendar className="w-5 h-5 text-gray-200" />
                </div>
                Billing Details
              </h2>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300 ml-1">Street Address</label>
                  <div className="relative">
                    <input
                      type="text"
                      value={address}
                      onChange={(e) => {
                        setAddress(e.target.value)
                        setErrors((prev) => ({ ...prev, address: undefined }))
                      }}
                      placeholder="e.g. 123 Main St"
                      className={`w-full h-12 bg-white/5 border ${errors.address ? 'border-red-500/50 focus:border-red-500' : 'border-white/10 focus:border-white focus:bg-white/10'} rounded-xl px-4 text-white transition-all outline-none placeholder:text-gray-600 text-sm`}
                    />
                    {errors.address && <p className="text-red-400 text-xs mt-1 ml-1">{errors.address}</p>}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300 ml-1">City</label>
                  <div className="relative">
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => {
                        setCity(e.target.value)
                        setErrors((prev) => ({ ...prev, city: undefined }))
                      }}
                      placeholder="e.g. New York"
                      className={`w-full h-12 bg-white/5 border ${errors.city ? 'border-red-500/50 focus:border-red-500' : 'border-white/10 focus:border-white focus:bg-white/10'} rounded-xl px-4 text-white transition-all outline-none placeholder:text-gray-600 text-sm`}
                    />
                    {errors.city && <p className="text-red-400 text-xs mt-1 ml-1">{errors.city}</p>}
                  </div>
                </div>
              </div>

              <div className="mt-8">
                <Button
                  onClick={handlePayment}
                  disabled={isProcessing || !!errors.address || !!errors.city || !address || !city}
                  className="w-full h-14 bg-white text-black hover:bg-gray-200 font-bold text-lg rounded-xl shadow-[0_0_20px_rgba(255,255,255,0.3)] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
                >
                  {isProcessing ? (
                    <div className="flex items-center gap-2">
                      <Spinner size="sm" className="border-black" />
                      Processing...
                    </div>
                  ) : (
                    "Confirm & Pay"
                  )}
                </Button>
              </div>
            </div>

            <p className="text-center text-xs text-gray-500 mt-4 leading-relaxed px-4">
              By confirming, you agree to our Terms of Service. You will be redirected to a secure payment gateway.
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default React.memo(BookingConfirmation)
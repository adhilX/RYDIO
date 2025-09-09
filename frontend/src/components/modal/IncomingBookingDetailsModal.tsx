import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  Car, 
  Clock, 
  MapPin, 
  User, 
  Calendar, 
  CreditCard, 
  Shield, 
  IndianRupee,
  FileText,
  CheckCircle,
  XCircle,
} from 'lucide-react'
import { format } from 'date-fns'
import React from 'react'
import type { IncomingBooking } from '@/Types/User/Booking/IncomingBooking';
import { withdrawMoney } from '@/services/wallet/walletService'
import toast from 'react-hot-toast'
import { useSelector } from 'react-redux'
import type { RootState } from '@/store/store'

const IMG_URL = import.meta.env.VITE_IMAGE_URL

interface IncomingBookingDetailsModalProps {
  booking: IncomingBooking | null
  isOpen: boolean
  onClose: () => void
  onApprove?: (bookingId: string) => void
  onReject?: (bookingId: string) => void
}

const IncomingBookingDetailsModal = ({ 
  booking, 
  isOpen, 
  onClose, 
  onApprove, 
  onReject 
}: IncomingBookingDetailsModalProps) => {
  if (!booking) return null
const user = useSelector((state:RootState)=>state.auth.user)
if(!user)return 
  const calculateDays = (startDate: string, endDate: string) => {
    const start = new Date(startDate)
    const end = new Date(endDate)
    const diffTime = end.getTime() - start.getTime()
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  }

    const handleWithdraw = async()=>{
  try {
    await withdrawMoney(booking?.booking_id!,user?._id!) 
    onClose()
    toast.success('withdraw success')
    
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
    toast.error(errorMessage)
}
  
  
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-900 text-yellow-400 border-yellow-700'
      case 'booked':
        return 'bg-blue-900 text-blue-400 border-blue-700'
      case 'ongoing':
        return 'bg-purple-900 text-purple-400 border-purple-700'
      case 'completed':
        return 'bg-green-900 text-green-400 border-green-700'
      case 'cancelled':
        return 'bg-red-900 text-red-400 border-red-700'
      default:
        return 'bg-gray-900 text-gray-400 border-gray-700'
    }
  }

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
      case 'succeeded':
        return 'bg-green-900 text-green-400 border-green-700'
      case 'pending':
        return 'bg-yellow-900 text-yellow-400 border-yellow-700'
      case 'failed':
        return 'bg-red-900 text-red-400 border-red-700'
      default:
        return 'bg-gray-900 text-gray-400 border-gray-700'
    }
  }



  const isPending = booking.status === 'pending'

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-gray-900 text-white p-6 rounded-lg">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold flex items-center justify-between">
            <span>Incoming Booking Details</span>
            <div className="flex gap-2">
              <Badge className={getStatusColor(booking.status)}>
                {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
              </Badge>
              <Badge className={getPaymentStatusColor(booking.payment_status)}>
                {booking.payment_status.charAt(0).toUpperCase() + booking.payment_status.slice(1)}
              </Badge>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="mt-6 space-y-8">
          {/* Booking ID and Actions */}
          <section className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Booking ID</p>
              <p className="text-lg font-mono text-white">{booking.booking_id}</p>
            </div>

               <section>
   {booking.status==='completed' && !booking.finance.owner_withdraw &&(
                 <Button
                   onClick={handleWithdraw}
                   variant="default"
                   className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                 >
                  
                  {`${booking?.finance.owner_earnings} withdraw`}
                 </Button>
   )}
            </section>
            {isPending && (
              <div className="flex gap-3">
                <Button
                  onClick={() => onApprove?.(booking._id)}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Approve
                </Button>
                <Button
                  onClick={() => onReject?.(booking._id)}
                  variant="destructive"
                  className="bg-red-600 hover:bg-red-700"
                >
                  <XCircle className="w-4 h-4 mr-2" />
                  Reject
                </Button>
              </div>
            )}
          </section>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column */}
            <div className="space-y-6">
              {/* Customer Information */}
              <section className="bg-gray-800 p-4 rounded-lg">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <User className="w-5 h-5 mr-2" />
                  Customer Information
                </h3>
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-full bg-gray-700 flex items-center justify-center">
                    <User className="w-6 h-6 text-gray-400" />
                  </div>
                  <div>
                    <p className="font-semibold text-white">Customer ID: {booking.user_id}</p>
                    <p className="text-sm text-gray-400">Customer</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <User className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-300">User ID: {booking.user_id}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-300">{booking.address}</span>
                  </div>
                </div>
              </section>

              {/* Vehicle Information */}
              <section className="bg-gray-800 p-4 rounded-lg">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <Car className="w-5 h-5 mr-2" />
                  Vehicle Details
                </h3>
                <div className="flex gap-4 mb-4">
                  <div className="w-32 h-24 overflow-hidden rounded-md border border-gray-700">
                    {booking.vehicle?.image_urls?.[0] ? (
                      <img
                        src={IMG_URL + booking.vehicle.image_urls[0]}
                        alt={booking.vehicle?.name || 'Vehicle'}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-700 flex items-center justify-center">
                        <Car className="w-8 h-8 text-gray-400" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-lg font-bold text-white">{booking.vehicle?.name || 'Unknown Vehicle'}</p>
                    <p className="text-sm text-gray-400 mb-1">{booking.vehicle?.brand || 'N/A'}</p>
                    <p className="text-xs text-gray-500 mb-2">{booking.vehicle?.registration_number || 'N/A'}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Car className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-300 capitalize">{booking.vehicle?.fuel_type || 'N/A'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-300">{booking.vehicle?.seats || 0} seats</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-300">{booking.vehicle?.automatic ? 'Automatic' : 'Manual'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <IndianRupee className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-300">₹{booking.vehicle?.price_per_day || 0}/day</span>
                  </div>
                </div>
              </section>

              {/* Location Information */}
              <section className="bg-gray-800 p-4 rounded-lg">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <MapPin className="w-5 h-5 mr-2" />
                  Pickup Location
                </h3>
                <div className="space-y-2">
                  <p className="text-white font-medium">{booking.location?.city || booking.city || 'N/A'}, {booking.location?.state || 'N/A'}</p>
                  <p className="text-sm text-gray-300">{booking.location?.address || booking.address || 'Address not available'}</p>
                  {booking.location?.pincode && (
                    <div className="text-xs text-gray-500">
                      Pincode: {booking.location.pincode}
                    </div>
                  )}
                </div>
              </section>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Booking Timeline */}
              <section className="bg-gray-800 p-4 rounded-lg">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <Calendar className="w-5 h-5 mr-2" />
                  Booking Timeline
                </h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-400">Start Date</p>
                    <p className="text-white font-medium">
                      {format(new Date(booking.start_date), 'PPP')}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">End Date</p>
                    <p className="text-white font-medium">
                      {format(new Date(booking.end_date), 'PPP')}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Duration</p>
                    <p className="text-white font-medium">
                      {calculateDays(booking.start_date, booking.end_date)} day(s)
                    </p>
                  </div>
                </div>
              </section>

              {/* Financial Details */}
              <section className="bg-gray-800 p-4 rounded-lg">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <CreditCard className="w-5 h-5 mr-2" />
                  Financial Details
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Total Amount</span>
                    <span className="text-xl font-bold text-white">
                      ₹{booking.total_amount.toLocaleString('en-IN')}
                    </span>
                  </div>
                  {booking.finance?.security_deposit && (
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Security Deposit</span>
                      <span className="text-lg font-semibold text-yellow-400">
                        ₹{booking.finance.security_deposit.toLocaleString('en-IN')}
                      </span>
                    </div>
                  )}
                  {booking.finance?.owner_earnings && (
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Your Earnings</span>
                      <span className="text-lg font-semibold text-green-400">
                        ₹{booking.finance.owner_earnings.toLocaleString('en-IN')}
                      </span>
                    </div>
                  )}
                  <div className="border-t border-gray-700 pt-2">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Payment Method</span>
                      <span className="text-white capitalize">
                        {booking.payment_type || 'N/A'}
                      </span>
                    </div>
                  </div>
                </div>
              </section>

              {/* Booking History */}
              <section className="bg-gray-800 p-4 rounded-lg">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <FileText className="w-5 h-5 mr-2" />
                  Booking History
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-400">Created</span>
                    <span className="text-gray-300">
                      {format(new Date(booking.createdAt), 'PPP p')}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-400">Last Updated</span>
                    <span className="text-gray-300">
                      {format(new Date(booking.updatedAt), 'PPP p')}
                    </span>
                  </div>
                </div>
              </section>

              {/* Security Information */}
              <section className="bg-gray-800 p-4 rounded-lg">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <Shield className="w-5 h-5 mr-2" />
                  Security & Protection
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    <span className="text-gray-300">Identity Verified Customer</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    <span className="text-gray-300">Security Deposit Collected</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    <span className="text-gray-300">Insurance Coverage Active</span>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default React.memo(IncomingBookingDetailsModal)

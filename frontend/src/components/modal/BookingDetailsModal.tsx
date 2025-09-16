import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Car, Clock, MapPin, User, X, CreditCard, DollarSign, Receipt, Shield, AlertCircle } from 'lucide-react'
import QRGenerator from '../user/QRGenerator'
import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import CancelReasonModal from './CancelReasonModal'
import CancelConfirmationModal from './CancelConfirmationModal'
import { cancelBooking } from '@/services/user/bookingService'
import { toast } from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import type { IbookedData } from '@/Types/User/Booking/bookedData'
import { withdrawMoney } from '@/services/wallet/walletService'
import { useSelector } from 'react-redux'
import type { RootState } from '@/store/store'

const IMG_URL = import.meta.env.VITE_IMAGE_URL
interface BookingDetailsModalProps {
  booking: IbookedData | null
  isOpen: boolean
  onClose: () => void
}

const BookingDetailsModal: React.FC<BookingDetailsModalProps> = ({ booking, isOpen, onClose }) => {
  const user = useSelector((state:RootState)=>state.auth.user)
  const [showReasonModal, setShowReasonModal] = useState(false)
  const [cancelReason, setCancelReason] = useState('')
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [isCancelling, setIsCancelling] = useState(false)
  const navigate = useNavigate()
  const calculateDays = (startDate: string | Date, endDate: string | Date) => {
    const start = new Date(startDate)
    const end = new Date(endDate)
    const diffTime = end.getTime() - start.getTime()
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  }

  if(!user) return null
  const handleCancelBooking = () => {
    setShowReasonModal(true)
  }

  const handleReasonSubmit = () => {
    if (cancelReason.trim()) {
      setShowReasonModal(false)
      setShowConfirmation(true)
    }
  }


  const  startChatWithOwner = () => {
    navigate(`/chat/${user._id}_${booking!.vehicle.owner_id}`)
  }
  const handleWithdraw = async()=>{
try {
  await withdrawMoney(booking!.booking_id!,user._id!) 
  onClose()
  toast.success('withdraw success')
} catch (error) {
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
      toast.error(errorMessage)
}

}

  const handleConfirmCancel = async () => {
    if (!booking?.booking_id) {
      toast.error('Invalid booking data')
      return
    }

    setIsCancelling(true)
    
    try {
      await cancelBooking(booking.booking_id, cancelReason)
      toast.success('Booking cancelled successfully!')
      setCancelReason('')
      onClose()
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to cancel booking'
      toast.error(errorMessage)
      console.error('Cancel booking error:', error)
    } finally {
      setIsCancelling(false)
      setShowConfirmation(false)
    }
  }

  if (!booking) return null

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="w-full max-w-2xl max-h-[90vh] bg-gray-900 text-white p-6 rounded-lg">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">Booking Details</DialogTitle>
          </DialogHeader>

          <div className="mt-4 space-y-6 overflow-y-auto max-h-[70vh] pr-2">

            {/* Booking ID */}
            <section>
              <p className="text-sm text-gray-400">Booking ID</p>
              <p className="text-lg font-mono">{booking.booking_id}</p>
            </section>

        {/* Vehicle Info */}
        <section className="flex gap-4">
          <div className="w-32 h-24 overflow-hidden rounded-md border border-gray-700">
            <img
            onClick={()=>navigate(`/vehicle-details/${booking.vehicle._id}`)}
              src={IMG_URL + booking.vehicle.image_urls[0]}
              alt={booking.vehicle.name}
              className="w-full h-full cursor-pointer object-cover"
            />
          </div>
          <div className="flex-1">
            <p className="text-lg font-bold">{booking.vehicle.name}</p>
            <p className="text-sm text-gray-400 mb-1">{booking.vehicle.brand}</p>
            <p className="text-xs text-gray-500 mb-2">{booking.vehicle.registration_number}</p>
            <div className="flex flex-wrap gap-4 text-sm text-gray-300">
              <div className="flex items-center gap-1">
                <Car className="w-4 h-4" />
                <span className="capitalize">{booking.vehicle.fuel_type}</span>
              </div>
              <div className="flex items-center gap-1">
                <User className="w-4 h-4" />
                <span>{booking.vehicle.seats} seats</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>{booking.vehicle.automatic ? 'Automatic' : 'Manual'}</span>
              </div>
            </div>
          </div>
        </section>

        {/* Booking Period */}
        <section>
          <p className="text-sm text-gray-400 mb-1">Booking Duration</p>
          <p className="text-md font-medium">
            {new Date(booking.start_date).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })} - {new Date(booking.end_date).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
          <p className="text-sm text-gray-400">{calculateDays(booking.start_date, booking.end_date)} day(s)</p>
        </section>

        {/* Payment Breakdown */}
        <section className="bg-gray-800 rounded-lg p-4 border border-gray-700">
          <div className="flex items-center gap-2 mb-3">
            <Receipt className="w-5 h-5 text-blue-400" />
            <h3 className="text-lg font-semibold text-white">Payment Breakdown</h3>
          </div>
          
          <div className="space-y-3">
            {/* Total Amount */}
            <div className="flex justify-between items-center py-2 border-b border-gray-700">
              <span className="text-gray-300 flex items-center gap-2">
                <DollarSign className="w-4 h-4" />
                Total Amount
              </span>
              <span className="text-lg font-bold text-white">₹{booking.total_amount.toLocaleString('en-IN')}</span>
            </div>
            
            {/* Security Deposit */}
            <div className="flex justify-between items-center py-2 border-b border-gray-700">
              <span className="text-gray-300 flex items-center gap-2">
                <Shield className="w-4 h-4" />
                Security Deposit
              </span>
              <span className="text-green-400 font-semibold">₹{booking.finance?.security_deposit?.toLocaleString('en-IN')}</span>
            </div>
            
            
            {/* Fine Amount (if any) */}
            {booking.finance.fine_amount > 0 && (
              <div className="flex justify-between items-center py-2 border-b border-gray-700">
                <span className="text-red-400 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" />
                  Fine Amount
                </span>
                <span className="text-red-400 font-semibold">₹{booking.finance?.fine_amount?.toLocaleString('en-IN')||0}</span>
              </div>
            )}
            
            {/* Late Return Status */}
            {booking.finance.is_late_return && (
              <div className="flex justify-between items-center py-2 border-b border-gray-700">
                <span className="text-red-400 flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  Late Return
                </span>
                <span className="text-red-400 text-sm">Yes</span>
              </div>
            )}
            
            {/* Refundable Amount */}
            <div className="flex justify-between items-center py-2 bg-gray-700 rounded px-3">
              <span className="text-white font-medium">Refundable Amount</span>
              <span className="text-green-400 font-bold text-lg">
                ₹{(booking.finance.security_deposit - booking.finance.fine_amount).toLocaleString('en-IN')}
              </span>
            </div>
          </div>
        </section>

        {/* Payment Status */}
        <section className="bg-gray-800 rounded-lg p-4 border border-gray-700">
          <div className="flex items-center gap-2 mb-3">
            <CreditCard className="w-5 h-5 text-green-400" />
            <h3 className="text-lg font-semibold text-white">Payment Information</h3>
          </div>
          
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-300">Payment Status</span>
              <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                booking.payment_status === 'paid' ? 'bg-green-900 text-green-400' : 'bg-yellow-900 text-yellow-400'
              }`}>
                {booking.payment_status === 'paid' ? 'Paid' : 'Pending'}
              </span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-gray-300">Payment Method</span>
              <span className="text-white font-medium">
                {booking.payment_type === 'card' ? 'Card Payment' : 'Wallet Payment'}
              </span>
            </div>
            
            {booking.payment_intent_id && (
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Transaction ID</span>
                <span className="text-gray-400 text-sm font-mono">
                  {booking.payment_intent_id.slice(-8)}
                </span>
              </div>
            )}
            
            <div className="flex justify-between items-center">
              <span className="text-gray-300">Price per Day</span>
              <span className="text-gray-400">₹{booking.vehicle.price_per_day.toLocaleString('en-IN')}</span>
            </div>
          </div>
        </section>

        {/* Withdrawal Status */}
        {booking.status === 'completed' && (
          <section className="bg-gray-800 rounded-lg p-4 border border-gray-700">
            <div className="flex items-center gap-2 mb-3">
              <DollarSign className="w-5 h-5 text-purple-400" />
              <h3 className="text-lg font-semibold text-white">Withdrawal Status</h3>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-gray-300">User Withdrawal</span>
                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                  booking.finance.user_withdraw ? 'bg-green-900 text-green-400' : 'bg-gray-700 text-gray-400'
                }`}>
                  {booking.finance.user_withdraw ? 'Completed' : 'Pending'}
                </span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Owner Withdrawal</span>
                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                  booking.finance.owner_withdraw ? 'bg-green-900 text-green-400' : 'bg-gray-700 text-gray-400'
                }`}>
                  {booking.finance.owner_withdraw ? 'Completed' : 'Pending'}
                </span>
              </div>
            </div>
          </section>
        )}

            {/* Cancel Booking Button */}
            {booking.status === 'booked' && (
              <section>
                <Button 
                  onClick={handleCancelBooking}
                  variant="destructive"
                  className="w-full bg-red-600 hover:bg-red-700 text-white"
                >
                  <X className="w-4 h-4 mr-2" />
                  Cancel Booking
                </Button>
              </section>
            )}

      {booking.status === 'completed' && !booking.finance.user_withdraw && (
    <section>
      <Button
        onClick={handleWithdraw}
        variant="default"
        className="w-full bg-green-600 hover:bg-green-700 text-white flex items-center justify-center gap-2"
      >
        <DollarSign className="w-4 h-4" />
        Withdraw ₹{(booking.finance.security_deposit - booking.finance.fine_amount).toLocaleString('en-IN')}
      </Button>
    </section>
      )}


      {(booking.status === 'booked' || booking.status === 'ongoing') &&(
        <section>
          <Button
            onClick={startChatWithOwner}
            variant="outline"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
          >
         Chat with Owner            
          </Button>
        </section>
          )}
        {/* QR Code Section */}
        <section>
          {booking.status === 'booked' && (
            <QRGenerator booking_id={booking.booking_id} action="start" />
          )}
          {booking.status === 'ongoing' && (
            <QRGenerator booking_id={booking.booking_id} action="end" />
          )}
        </section>

        {/* Location Info */}
        {booking.location?.address && (
          <section>
            <p className="text-sm text-gray-400 mb-1">Pickup Location</p>
            <div className="flex items-start gap-2">
              <MapPin className="w-4 h-4 mt-0.5 text-gray-400" />
              <p className="text-sm text-gray-200">{booking.location.address}</p>
            </div>
          </section>
        )}
      </div>
      </DialogContent>
      </Dialog>

      {/* Separate Cancel Modal Components */}
      <CancelReasonModal
        isOpen={showReasonModal}
        onClose={() => setShowReasonModal(false)}
        onSubmit={handleReasonSubmit}
        reason={cancelReason}
        onReasonChange={setCancelReason}
      />

      <CancelConfirmationModal
        isOpen={showConfirmation}
        onClose={() => setShowConfirmation(false)}
        onConfirm={handleConfirmCancel}
        totalAmount={booking.total_amount}
        reason={cancelReason}
        isLoading={isCancelling}
      />
    </>
  )

}

export default React.memo(BookingDetailsModal)

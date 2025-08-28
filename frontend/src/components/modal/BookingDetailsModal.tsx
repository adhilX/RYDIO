import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Car, Clock, MapPin, User, X } from 'lucide-react'
import QRGenerator from '../user/QRGenerator'
import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import CancelReasonModal from './CancelReasonModal'
import CancelConfirmationModal from './CancelConfirmationModal'
import { cancelBooking } from '@/services/user/bookingService'
import { toast } from 'react-hot-toast'
import { useNavigate } from 'react-router'
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

  if(!user)return
  const handleCancelBooking = () => {
    setShowReasonModal(true)
  }

  const handleReasonSubmit = () => {
    if (cancelReason.trim()) {
      setShowReasonModal(false)
      setShowConfirmation(true)
    }
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

        {/* Payment Info */}
        <section>
          <p className="text-sm text-gray-400 mb-1">Total Amount</p>
          <p className="text-lg font-semibold text-white">₹{booking.total_amount.toLocaleString('en-IN')}</p>
          <p className="text-sm text-gray-500">₹{booking.vehicle.price_per_day}/day</p>
        </section>

        {/* Payment Status */}
        <section>
          <p className="text-sm text-gray-400 mb-1">Payment Status</p>
          <div className="flex items-center gap-2">
            <span
              className={`px-2 py-0.5 rounded-full text-xs font-semibold 
                ${booking.payment_status === 'paid' ? 'bg-green-900 text-green-400' : 'bg-yellow-900 text-yellow-400'}
              `}
            >
              {booking.payment_status === 'paid' ? 'Paid' : 'Pending'}
            </span>
            <span className="text-sm text-gray-300">
              
              {booking.payment_type === 'card' ? 'Card Payment' : 'Wallet Payment'}
            </span>
          </div>
        </section>

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

      {booking.status === 'completed' && !booking.finance.user_withdraw &&(
    <section>
      <Button
        onClick={handleWithdraw}
        variant="default"
        className="w-full bg-blue-600 hover:bg-blue-700 text-white"
      >
        
       {`${booking.finance.security_deposit - booking.finance.fine_amount} withdraw`}
      </Button>
    </section>
      )}


      {(booking.status === 'booked' || booking.status === 'ongoing') &&(
        <section>
          <Button
            onClick={()=>navigate(`/chat/${booking.vehicle.owner_id}`)}
            variant="outline"
            className="w-34 bg-blue-600 hover:bg-blue-700 text-white"
          >
         chat with owner            
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

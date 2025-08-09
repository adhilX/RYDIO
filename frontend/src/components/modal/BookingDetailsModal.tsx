import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Car, Clock, MapPin, User } from 'lucide-react'
import type { IbookedData } from '@/Types/User/Booking/bookedData'
import QRGenerator from '../user/QRGenerator'
import React from 'react'

const IMG_URL = import.meta.env.VITE_IMAGE_URL

interface BookingDetailsModalProps {
  booking: IbookedData | null
  isOpen: boolean
  onClose: () => void
}

const BookingDetailsModal = ({ booking, isOpen, onClose }: BookingDetailsModalProps) => {
  if (!booking) return null

  const calculateDays = (startDate: string | Date, endDate: string | Date) => {
    const start = new Date(startDate)
    const end = new Date(endDate)
    const diffTime = end.getTime() - start.getTime()
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  }

  return (
  <Dialog open={isOpen} onOpenChange={onClose}>
    <DialogContent className="w-full bg-gray-900 text-white p-6 rounded-lg">
      <DialogHeader>
        <DialogTitle className="text  -xl font-semibold">Booking Details</DialogTitle>
      </DialogHeader>

      <div className="mt-4 space-y-6">

        {/* Booking ID */}
        <section>
          <p className="text-sm text-gray-400">Booking ID</p>
          <p className="text-lg font-mono">{booking.booking_id}</p>
        </section>

        {/* Vehicle Info */}
        <section className="flex gap-4">
          <div className="w-32 h-24 overflow-hidden rounded-md border border-gray-700">
            <img
              src={IMG_URL + booking.vehicle.image_urls[0]}
              alt={booking.vehicle.name}
              className="w-full h-full object-cover"
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
            {new Date(booking.start_date).toLocaleDateString()} - {new Date(booking.end_date).toLocaleDateString()}
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
)

}

export default React.memo(BookingDetailsModal)

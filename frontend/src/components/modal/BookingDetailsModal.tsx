import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Car, Clock, MapPin, User, X, CreditCard, DollarSign, Receipt, Shield, AlertCircle, Flag } from 'lucide-react'
import QRGenerator from '../user/QRGenerator'
import React, { useState, useEffect } from 'react'
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
import { createReport, checkIfUserReportedBooking } from '@/services/user/reportService'
import ReportModal from './ReportModal'

const IMG_URL = import.meta.env.VITE_IMAGE_URL
interface BookingDetailsModalProps {
  booking: IbookedData | null
  isOpen: boolean
  onClose: () => void
}

const BookingDetailsModal: React.FC<BookingDetailsModalProps> = ({ booking, isOpen, onClose }) => {
  const user = useSelector((state: RootState) => state.auth.user)
  const [showReasonModal, setShowReasonModal] = useState(false)
  const [cancelReason, setCancelReason] = useState('')
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [isCancelling, setIsCancelling] = useState(false)
  const [showReportModal, setShowReportModal] = useState(false)
  const [isSubmittingReport, setIsSubmittingReport] = useState(false)
  const [hasUserReported, setHasUserReported] = useState(false)
  const [isCheckingReport, setIsCheckingReport] = useState(false)
  const navigate = useNavigate()
  const calculateDays = (startDate: string | Date, endDate: string | Date) => {
    const start = new Date(startDate)
    const end = new Date(endDate)
    const diffTime = end.getTime() - start.getTime()
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24))

  }

  // Check if report button should be shown
  const shouldShowReportButton = () => {
    if (!booking) return false

    const now = new Date()
    const endDate = new Date(booking.end_date)
    const timeDiff = now.getTime() - endDate.getTime()
    const hoursDiff = timeDiff / (1000 * 60 * 60)

    // Show report button if booking is ongoing or completed within 24 hours
    return booking.status === 'ongoing' ||
      (booking.status === 'completed' && hoursDiff <= 24)
  }

  // Check if user has already reported this booking when modal opens
  useEffect(() => {
    const checkExistingReport = async () => {
      if (isOpen && booking?.booking_id && user?._id && shouldShowReportButton()) {
        setIsCheckingReport(true)
        try {
          const hasReported = await checkIfUserReportedBooking(booking.booking_id, user._id)
          setHasUserReported(hasReported)
        } catch (error) {
          console.error('Error checking existing report:', error)
          setHasUserReported(false)
        } finally {
          setIsCheckingReport(false)
        }
      }
    }

    checkExistingReport()
  }, [isOpen, booking?.booking_id, user?._id])

  if (!user) return null
  const handleCancelBooking = () => {
    setShowReasonModal(true)
  }

  const handleReasonSubmit = () => {
    if (cancelReason.trim()) {
      setShowReasonModal(false)
      setShowConfirmation(true)
    }
  }


  const startChatWithOwner = () => {
    navigate(`/chat/${user._id}_${booking!.vehicle.owner_id}`)
  }
  const handleWithdraw = async () => {
    try {
      await withdrawMoney(booking!.booking_id!, user._id!)
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

  const handleOpenReportModal = () => {
    console.log('Opening report modal...');
    // Close any other modals first
    setShowReasonModal(false)
    setShowConfirmation(false)
    // Then open report modal
    setShowReportModal(true)
    console.log('Report modal state set to true');
  }

  const handleReportSubmit = async (reason: string) => {
    if (!booking?.booking_id || !user?._id) {
      toast.error('Invalid booking or user data')
      return
    }

    if (!booking?.vehicle?.owner_id) {
      toast.error('Vehicle owner information not available')
      return
    }
    setIsSubmittingReport(true)

    try {
      await createReport({
        reporterId: user._id,
        bookingId: booking.booking_id,
        ownerId: booking.vehicle.owner_id.toString(),
        reason: reason.trim()
      })
      toast.success('Report submitted successfully!')
      setShowReportModal(false)
      setHasUserReported(true)
      onClose()
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to submit report'
      toast.error(errorMessage)
      console.error('Submit report error:', error)
    } finally {
      setIsSubmittingReport(false)
    }
  }

  if (!booking) return null
  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="w-full max-w-2xl max-h-[90vh] bg-black/80 backdrop-blur-xl text-white p-0 rounded-3xl border border-white/10 overflow-hidden shadow-2xl">
          <DialogHeader className="p-6 border-b border-white/10 flex flex-row items-center justify-between">
            <DialogTitle className="text-xl font-bold tracking-tight">Booking Details</DialogTitle>
            {/* Close button is handled by DialogPrimitive, but we can style if needed or rely on default */}
          </DialogHeader>

          <div className="p-6 space-y-8 overflow-y-auto max-h-[calc(90vh-80px)] custom-scrollbar">

            {/* Booking ID and Status */}
            <section className="flex items-center justify-between bg-white/5 p-4 rounded-2xl border border-white/5">
              <div>
                <p className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-1">Booking ID</p>
                <p className="text-lg font-mono font-bold text-white tracking-widest">{booking.booking_id}</p>
              </div>
              <div className={`px-4 py-1.5 rounded-full text-sm font-bold border capitalize ${booking.status === 'completed' ? 'bg-green-500/10 border-green-500/20 text-green-400' :
                booking.status === 'ongoing' ? 'bg-blue-500/10 border-blue-500/20 text-blue-400' :
                  booking.status === 'cancelled' ? 'bg-red-500/10 border-red-500/20 text-red-400' :
                    'bg-yellow-500/10 border-yellow-500/20 text-yellow-400'
                }`}>
                {booking.status}
              </div>
            </section>

            {/* Vehicle Info */}
            <section className="flex flex-col sm:flex-row gap-6">
              <div className="w-full sm:w-40 h-32 overflow-hidden rounded-2xl border border-white/10 relative group shrink-0">
                <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors"></div>
                <img
                  onClick={() => navigate(`/vehicle-details/${booking.vehicle._id}`)}
                  src={IMG_URL + booking.vehicle.image_urls[0]}
                  alt={booking.vehicle.name}
                  className="w-full h-full cursor-pointer object-cover transform group-hover:scale-110 transition-transform duration-500"
                />
              </div>
              <div className="flex-1 space-y-3">
                <div>
                  <h3 className="text-2xl font-bold text-white leading-tight">{booking.vehicle.name}</h3>
                  <p className="text-sm text-gray-400 font-medium">{booking.vehicle.brand}</p>
                </div>

                <div className="flex flex-wrap gap-3">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white/5 border border-white/5 text-xs text-gray-300">
                    <Car className="w-3.5 h-3.5" />
                    <span className="capitalize">{booking.vehicle.fuel_type}</span>
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white/5 border border-white/5 text-xs text-gray-300">
                    <User className="w-3.5 h-3.5" />
                    <span>{booking.vehicle.seats} Seats</span>
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white/5 border border-white/5 text-xs text-gray-300">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{booking.vehicle.automatic ? 'Automatic' : 'Manual'}</span>
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white/5 border border-white/5 text-xs text-gray-300 font-mono">
                    {booking.vehicle.registration_number}
                  </span>
                </div>
              </div>
            </section>

            {/* Booking Period */}
            <section className="grid grid-cols-2 gap-4 bg-white/5 p-5 rounded-2xl border border-white/5">
              <div className="space-y-1">
                <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">Start Date</p>
                <p className="text-sm font-bold text-white">
                  {new Date(booking.start_date).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}
                </p>
              </div>
              <div className="space-y-1 text-right">
                <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">End Date</p>
                <p className="text-sm font-bold text-white">
                  {new Date(booking.end_date).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}
                </p>
              </div>
              <div className="col-span-2 pt-3 mt-1 border-t border-white/10 flex justify-between items-center text-xs">
                <span className="text-gray-400">Total Duration</span>
                <span className="text-white font-bold bg-white/10 px-2 py-0.5 rounded">{calculateDays(booking.start_date, booking.end_date)} Days</span>
              </div>
            </section>

            {/* Location Info */}
            {booking.location?.address && (
              <section className="flex items-start gap-4 p-4 rounded-2xl border border-white/10 bg-gradient-to-r from-white/5 to-transparent">
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center shrink-0 text-white">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase font-bold mb-1">Pickup Location</p>
                  <p className="text-sm text-gray-200 leading-relaxed font-medium">{booking.location.address}</p>
                </div>
              </section>
            )}

            {/* QR Code Section */}
            {(booking.status === 'booked' || booking.status === 'ongoing') && (
              <section className="flex flex-col items-center justify-center p-6 bg-white/5 rounded-2xl border border-white/5 border-dashed">
                {booking.status === 'booked' && (
                  <QRGenerator booking_id={booking.booking_id} action="start" />
                )}
                {booking.status === 'ongoing' && (
                  <QRGenerator booking_id={booking.booking_id} action="end" />
                )}
              </section>
            )}


            {/* Payment & Finance Breakdown */}
            <section className="space-y-4">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Receipt className="w-5 h-5 text-gray-400" />
                Payment Details
              </h3>

              <div className="divide-y divide-white/10 border border-white/10 rounded-2xl overflow-hidden">
                {/* Price Status */}
                <div className="p-4 bg-white/5 flex justify-between items-center">
                  <span className="text-sm text-gray-400">Total Amount</span>
                  <span className="text-lg font-bold text-white tracking-tight">₹{booking.total_amount.toLocaleString('en-IN')}</span>
                </div>
                <div className="p-4 bg-white/5 flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-green-400" />
                    <span className="text-sm text-gray-400">Security Deposit</span>
                  </div>
                  <span className="text-green-400 font-bold">₹{booking.finance?.security_deposit?.toLocaleString('en-IN')}</span>
                </div>

                {/* Fine */}
                {booking.finance.fine_amount > 0 && (
                  <div className="p-4 bg-red-500/5 flex justify-between items-center">
                    <div className="flex items-center gap-2 text-red-400">
                      <AlertCircle className="w-4 h-4" />
                      <span className="text-sm">Fine Amount</span>
                    </div>
                    <span className="text-red-400 font-bold">- ₹{booking.finance?.fine_amount?.toLocaleString('en-IN') || 0}</span>
                  </div>
                )}

                {/* Late Return */}
                {booking.finance.is_late_return && (
                  <div className="p-4 bg-red-500/5 flex justify-between items-center">
                    <div className="flex items-center gap-2 text-red-400">
                      <Clock className="w-4 h-4" />
                      <span className="text-sm">Late Return</span>
                    </div>
                    <span className="text-xs font-bold bg-red-500/20 text-red-400 px-2 py-0.5 rounded uppercase">Yes</span>
                  </div>
                )}

                {/* Refundable */}
                <div className="p-4 bg-white/10 flex justify-between items-center">
                  <span className="text-sm font-bold text-white">Refundable Amount</span>
                  <span className="text-xl font-bold text-green-400">
                    ₹{(booking.finance.security_deposit - booking.finance.fine_amount).toLocaleString('en-IN')}
                  </span>
                </div>
              </div>
            </section>

            {/* Payment Meta */}
            <section className="grid grid-cols-2 gap-4 text-xs">
              <div className="bg-white/5 p-3 rounded-xl border border-white/5">
                <p className="text-gray-500 uppercase font-bold mb-1">Status</p>
                <p className={`font-bold capitalize flex items-center gap-2 ${booking.payment_status === 'paid' ? 'text-green-400' : 'text-yellow-400'}`}>
                  <span className={`w-2 h-2 rounded-full ${booking.payment_status === 'paid' ? 'bg-green-500' : 'bg-yellow-500'}`}></span>
                  {booking.payment_status}
                </p>
              </div>
              <div className="bg-white/5 p-3 rounded-xl border border-white/5">
                <p className="text-gray-500 uppercase font-bold mb-1">Method</p>
                <p className="font-bold text-white overflow-hidden text-ellipsis whitespace-nowrap">
                  {booking.payment_type === 'card' ? 'Card Payment' : 'Wallet'}
                </p>
              </div>
            </section>


            {/* Action Buttons */}
            <div className="space-y-3 pt-4">
              {/* Withdraw */}
              {booking.status === 'completed' && !booking.finance.user_withdraw && (
                <Button
                  onClick={handleWithdraw}
                  className="w-full bg-green-600 hover:bg-green-500 text-white font-bold h-12 shadow-[0_0_20px_rgba(34,197,94,0.3)] transition-all hover:scale-[1.02] active:scale-95"
                >
                  <DollarSign className="w-5 h-5 mr-2" />
                  Withdraw Refund (₹{(booking.finance.security_deposit - booking.finance.fine_amount).toLocaleString('en-IN')})
                </Button>
              )}

              {/* Chat Owner */}
              {(booking.status === 'booked' || booking.status === 'ongoing') && (
                <Button
                  onClick={startChatWithOwner}
                  className="w-full bg-white text-black hover:bg-gray-200 font-bold h-12 transition-all hover:scale-[1.02] active:scale-95"
                >
                  Chat with Owner
                </Button>
              )}

              {/* Report Button */}
              {shouldShowReportButton() && !hasUserReported && (
                <Button
                  onClick={handleOpenReportModal}
                  variant="outline"
                  className="w-full bg-transparent border-red-500/30 text-red-400 hover:bg-red-500/10 hover:text-red-300 h-10 transition-colors"
                  disabled={isSubmittingReport || isCheckingReport}
                >
                  <Flag className="w-4 h-4 mr-2" />
                  {isCheckingReport ? 'Checking...' : isSubmittingReport ? 'Submitting...' : 'Report Issue'}
                </Button>
              )}

              {/* Reported Status */}
              {shouldShowReportButton() && hasUserReported && (
                <div className="w-full bg-white/5 border border-white/10 rounded-xl p-3 flex items-center justify-center gap-2 text-gray-400 text-sm">
                  <Flag className="w-4 h-4" />
                  <span>Issue already reported</span>
                </div>
              )}

              {/* Cancel Button */}
              {booking.status === 'booked' && (
                <Button
                  onClick={handleCancelBooking}
                  variant="ghost"
                  className="w-full text-red-500 hover:text-red-400 hover:bg-red-500/10 h-10"
                >
                  Cancel Booking
                </Button>
              )}
            </div>

          </div>
        </DialogContent>
      </Dialog>

      {/* Modals remain unchanged in logic, just ensuring they are mounted */}
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

      <ReportModal
        isOpen={showReportModal}
        onClose={() => setShowReportModal(false)}
        onSubmit={handleReportSubmit}
        isSubmitting={isSubmittingReport}
        bookingId={booking?.booking_id}
      />
    </>
  )
}

export default React.memo(BookingDetailsModal)

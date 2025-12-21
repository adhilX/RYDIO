import { createPortal } from 'react-dom'
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
    X,
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
    const user = useSelector((state: RootState) => state.auth.user)

    if (!booking || !isOpen || !user) return null

    const calculateDays = (startDate: string, endDate: string) => {
        const start = new Date(startDate)
        const end = new Date(endDate)
        const diffTime = end.getTime() - start.getTime()
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    }

    const handleWithdraw = async () => {
        try {
            await withdrawMoney(booking?.booking_id!, user._id!)
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

    return createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-md animate-in fade-in duration-300">
            <div
                className="fixed inset-0"
                onClick={onClose}
                aria-hidden="true"
            />
            <div className="relative w-full max-w-5xl max-h-[85vh] flex flex-col bg-black/80 backdrop-blur-2xl text-white rounded-[2rem] shadow-2xl border border-white/10 overflow-hidden animate-in zoom-in-95 duration-300 ring-1 ring-white/5">

                {/* Modal Header */}
                <div className="flex items-center justify-between p-6 border-b border-white/5 bg-white/5 backdrop-blur-xl z-10 sticky top-0">
                    <div className="flex items-center gap-4">
                        <div className="p-2 bg-white/10 rounded-xl border border-white/5">
                            <FileText className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold tracking-tight text-white mb-1">Booking Details</h2>
                            <div className="flex gap-2">
                                <Badge className={`${getStatusColor(booking.status)} border-0 px-3 py-1 text-xs font-semibold uppercase tracking-wider shadow-lg`}>
                                    {booking.status}
                                </Badge>
                                <Badge className={`${getPaymentStatusColor(booking.payment_status)} border-0 px-3 py-1 text-xs font-semibold uppercase tracking-wider shadow-lg`}>
                                    {booking.payment_status}
                                </Badge>
                            </div>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-3 text-gray-400 hover:text-white hover:bg-white/10 rounded-full transition-all duration-200 hover:rotate-90"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Modal Content - Scrollable */}
                <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-8 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                    {/* Booking ID and Actions */}
                    <section className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-2xl bg-white/5 border border-white/5">
                        <div>
                            <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-1">Booking Reference</p>
                            <div className="flex items-center gap-2">
                                <p className="text-xl font-mono font-bold text-white tracking-wide">{booking.booking_id}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            {booking.status === 'completed' && !booking.finance.owner_withdraw && (
                                <Button
                                    onClick={handleWithdraw}
                                    className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white border-0 shadow-lg shadow-blue-500/20"
                                >
                                    Withdraw ₹{booking?.finance.owner_earnings}
                                </Button>
                            )}

                            {isPending && (
                                <>
                                    <Button
                                        onClick={() => onApprove?.(booking._id)}
                                        className="bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white border-0 shadow-lg shadow-emerald-500/20"
                                    >
                                        <CheckCircle className="w-4 h-4 mr-2" />
                                        Approve Request
                                    </Button>
                                    <Button
                                        onClick={() => onReject?.(booking._id)}
                                        variant="destructive"
                                        className="bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-500 hover:to-rose-400 text-white border-0 shadow-lg shadow-rose-500/20"
                                    >
                                        <XCircle className="w-4 h-4 mr-2" />
                                        Reject
                                    </Button>
                                </>
                            )}
                        </div>
                    </section>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Left Column */}
                        <div className="space-y-6">
                            {/* Customer Information */}
                            <section className="bg-white/5 p-6 rounded-3xl border border-white/5 hover:border-white/10 transition-colors duration-300">
                                <h3 className="text-lg font-semibold mb-6 flex items-center text-white/90">
                                    <div className="p-2 bg-blue-500/10 rounded-lg mr-3">
                                        <User className="w-5 h-5 text-blue-400" />
                                    </div>
                                    Customer Profile
                                </h3>
                                <div className="flex items-center gap-5 mb-6">
                                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center border border-white/5 shadow-inner overflow-hidden">
                                        {booking.user.profile_image ? (
                                            <img
                                                src={IMG_URL + booking.user.profile_image}
                                                alt={booking.user.name}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <User className="w-8 h-8 text-gray-400" />
                                        )}
                                    </div>
                                    <div>
                                        <p className="font-bold text-lg text-white">{booking.user.name}</p>
                                        <div className="flex flex-col text-sm text-gray-400">
                                            <span>{booking.user.email}</span>
                                            <span>{booking.user.phone}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-4 bg-black/20 p-4 rounded-xl border border-white/5">

                                    <div className="flex items-start gap-3 text-sm">
                                        <MapPin className="w-4 h-4 text-gray-400 mt-1" />
                                        <div>
                                            <span className="block text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">Registered Address</span>
                                            <span className="text-gray-300">{booking.address}</span>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            {/* Vehicle Information */}
                            <section className="bg-white/5 p-6 rounded-3xl border border-white/5 hover:border-white/10 transition-colors duration-300">
                                <h3 className="text-lg font-semibold mb-6 flex items-center text-white/90">
                                    <div className="p-2 bg-purple-500/10 rounded-lg mr-3">
                                        <Car className="w-5 h-5 text-purple-400" />
                                    </div>
                                    Vehicle Details
                                </h3>
                                <div className="group relative aspect-video w-full overflow-hidden rounded-2xl border border-white/10 mb-6 bg-black/40">
                                    {booking.vehicle?.image_urls?.[0] ? (
                                        <img
                                            src={IMG_URL + booking.vehicle.image_urls[0]}
                                            alt={booking.vehicle?.name || 'Vehicle'}
                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                        />
                                    ) : (
                                        <div className="flex h-full items-center justify-center">
                                            <Car className="w-12 h-12 text-gray-600" />
                                        </div>
                                    )}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                                    <div className="absolute bottom-4 left-4 right-4">
                                        <h4 className="text-xl font-bold text-white mb-1">{booking.vehicle?.name || 'Unknown Vehicle'}</h4>
                                        <p className="text-sm text-gray-300 flex items-center">
                                            <span className="bg-white/20 px-2 py-0.5 rounded text-xs font-semibold mr-2">{booking.vehicle?.brand}</span>
                                            {booking.vehicle?.registration_number}
                                        </p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <div className="bg-black/20 p-3 rounded-xl border border-white/5">
                                        <span className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Type</span>
                                        <div className="flex items-center gap-2 mt-1 text-gray-300">
                                            <Car className="w-4 h-4 text-purple-400" />
                                            <span className="capitalize">{booking.vehicle?.fuel_type}</span>
                                        </div>
                                    </div>
                                    <div className="bg-black/20 p-3 rounded-xl border border-white/5">
                                        <span className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Transmission</span>
                                        <div className="flex items-center gap-2 mt-1 text-gray-300">
                                            <Clock className="w-4 h-4 text-purple-400" />
                                            <span>{booking.vehicle?.automatic ? 'Automatic' : 'Manual'}</span>
                                        </div>
                                    </div>
                                    <div className="bg-black/20 p-3 rounded-xl border border-white/5">
                                        <span className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Capacity</span>
                                        <div className="flex items-center gap-2 mt-1 text-gray-300">
                                            <User className="w-4 h-4 text-purple-400" />
                                            <span>{booking.vehicle?.seats} Seats</span>
                                        </div>
                                    </div>
                                    <div className="bg-black/20 p-3 rounded-xl border border-white/5">
                                        <span className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Price</span>
                                        <div className="flex items-center gap-2 mt-1 text-gray-300">
                                            <IndianRupee className="w-4 h-4 text-purple-400" />
                                            <span>{booking.vehicle?.price_per_day}/day</span>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            {/* Location Information */}
                            <section className="bg-white/5 p-6 rounded-3xl border border-white/5 hover:border-white/10 transition-colors duration-300">
                                <h3 className="text-lg font-semibold mb-4 flex items-center text-white/90">
                                    <div className="p-2 bg-amber-500/10 rounded-lg mr-3">
                                        <MapPin className="w-5 h-5 text-amber-400" />
                                    </div>
                                    Pickup Location
                                </h3>
                                <div className="pl-4 border-l-2 border-white/10 py-1 space-y-2">
                                    <p className="text-lg font-medium text-white">{booking.location?.city || booking.city || 'N/A'}, {booking.location?.state}</p>
                                    <p className="text-sm text-gray-400 leading-relaxed">{booking.location?.address || booking.address || 'Address not available'}</p>
                                    {booking.location?.pincode && (
                                        <p className="text-xs font-mono text-gray-500">PIN: {booking.location.pincode}</p>
                                    )}
                                </div>
                            </section>
                        </div>

                        {/* Right Column */}
                        <div className="space-y-6">
                            {/* Booking Timeline */}
                            <section className="bg-white/5 p-6 rounded-3xl border border-white/5 hover:border-white/10 transition-colors duration-300">
                                <h3 className="text-lg font-semibold mb-6 flex items-center text-white/90">
                                    <div className="p-2 bg-pink-500/10 rounded-lg mr-3">
                                        <Calendar className="w-5 h-5 text-pink-400" />
                                    </div>
                                    Timeline
                                </h3>
                                <div className="relative space-y-8 pl-2">
                                    {/* Timeline Line */}
                                    <div className="absolute left-[19px] top-3 bottom-3 w-0.5 bg-gradient-to-b from-blue-500 via-purple-500 to-pink-500 opacity-30" />

                                    <div className="relative flex items-start gap-4">
                                        <div className="w-10 h-10 rounded-full bg-black/40 border border-blue-500/30 flex items-center justify-center shrink-0 z-10 shadow-[0_0_10px_rgba(59,130,246,0.2)]">
                                            <div className="w-3 h-3 rounded-full bg-blue-500" />
                                        </div>
                                        <div className="flex-1 bg-black/20 p-3 rounded-xl border border-white/5">
                                            <p className="text-xs text-blue-400 uppercase font-bold mb-1">Start Trip</p>
                                            <p className="text-white font-medium text-lg">{format(new Date(booking.start_date), 'MMM dd, yyyy')}</p>
                                            <p className="text-gray-500 text-sm">{format(new Date(booking.start_date), 'EEEE')}</p>
                                        </div>
                                    </div>

                                    <div className="relative flex items-center gap-4 py-2">
                                        <div className="w-10 flex justify-center shrink-0">
                                            <span className="text-xs font-mono text-gray-500 bg-black/40 px-2 py-1 rounded border border-white/5">
                                                {calculateDays(booking.start_date, booking.end_date)} Days
                                            </span>
                                        </div>
                                    </div>

                                    <div className="relative flex items-start gap-4">
                                        <div className="w-10 h-10 rounded-full bg-black/40 border border-pink-500/30 flex items-center justify-center shrink-0 z-10 shadow-[0_0_10px_rgba(236,72,153,0.2)]">
                                            <div className="w-3 h-3 rounded-full bg-pink-500" />
                                        </div>
                                        <div className="flex-1 bg-black/20 p-3 rounded-xl border border-white/5">
                                            <p className="text-xs text-pink-400 uppercase font-bold mb-1">End Trip</p>
                                            <p className="text-white font-medium text-lg">{format(new Date(booking.end_date), 'MMM dd, yyyy')}</p>
                                            <p className="text-gray-500 text-sm">{format(new Date(booking.end_date), 'EEEE')}</p>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            {/* Financial Details */}
                            <section className="bg-white/5 p-6 rounded-3xl border border-white/5 hover:border-white/10 transition-colors duration-300">
                                <h3 className="text-lg font-semibold mb-6 flex items-center text-white/90">
                                    <div className="p-2 bg-emerald-500/10 rounded-lg mr-3">
                                        <CreditCard className="w-5 h-5 text-emerald-400" />
                                    </div>
                                    Financial Breakdown
                                </h3>
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center bg-black/20 p-4 rounded-xl border border-white/5">
                                        <span className="text-gray-400">Total Amount</span>
                                        <span className="text-2xl font-bold text-white tracking-tight">
                                            ₹{booking.total_amount.toLocaleString('en-IN')}
                                        </span>
                                    </div>

                                    <div className="grid grid-cols-2 gap-3">
                                        {booking.finance?.security_deposit && (
                                            <div className="bg-black/20 p-3 rounded-xl border border-white/5">
                                                <p className="text-xs text-gray-500 mb-1">Security Deposit</p>
                                                <p className="text-lg font-semibold text-yellow-400">
                                                    ₹{booking.finance.security_deposit.toLocaleString('en-IN')}
                                                </p>
                                            </div>
                                        )}
                                        {booking.finance?.owner_earnings && (
                                            <div className="bg-black/20 p-3 rounded-xl border border-white/5">
                                                <p className="text-xs text-gray-500 mb-1">Net Earnings</p>
                                                <p className="text-lg font-semibold text-emerald-400">
                                                    ₹{booking.finance.owner_earnings.toLocaleString('en-IN')}
                                                </p>
                                            </div>
                                        )}
                                    </div>

                                    <div className="pt-2">
                                        <div className="flex items-center gap-2 text-sm text-gray-400 justify-end">
                                            <span>Paid via</span>
                                            <Badge variant="outline" className="text-white border-white/20 capitalize bg-white/5">
                                                {booking.payment_type || 'Online'}
                                            </Badge>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            {/* Booking History */}
                            <section className="bg-white/5 p-6 rounded-3xl border border-white/5 hover:border-white/10 transition-colors duration-300">
                                <h3 className="text-lg font-semibold mb-6 flex items-center text-white/90">
                                    <div className="p-2 bg-cyan-500/10 rounded-lg mr-3">
                                        <FileText className="w-5 h-5 text-cyan-400" />
                                    </div>
                                    History Log
                                </h3>
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between text-sm py-2 border-b border-white/5">
                                        <span className="text-gray-400">Created On</span>
                                        <span className="text-gray-200 font-mono">
                                            {format(new Date(booking.createdAt), 'PPP p')}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between text-sm py-2">
                                        <span className="text-gray-400">Last Updated</span>
                                        <span className="text-gray-200 font-mono">
                                            {format(new Date(booking.updatedAt), 'PPP p')}
                                        </span>
                                    </div>
                                </div>
                            </section>

                            {/* Security Information */}
                            <section className="bg-gradient-to-br from-indigo-900/20 to-blue-900/20 p-6 rounded-3xl border border-indigo-500/10 hover:border-indigo-500/20 transition-colors duration-300">
                                <h3 className="text-lg font-semibold mb-4 flex items-center text-indigo-200">
                                    <Shield className="w-5 h-5 mr-3 text-indigo-400" />
                                    Safety & Trust
                                </h3>
                                <div className="space-y-3">
                                    <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition-colors">
                                        <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
                                        <span className="text-sm text-indigo-100">Identity has been verified</span>
                                    </div>
                                    <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition-colors">
                                        <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
                                        <span className="text-sm text-indigo-100">Security deposit secured</span>
                                    </div>
                                    <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition-colors">
                                        <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
                                        <span className="text-sm text-indigo-100">Ride insurance active</span>
                                    </div>
                                </div>
                            </section>
                        </div>
                    </div>
                </div>
            </div>
        </div>,
        document.body
    )
}

export default React.memo(IncomingBookingDetailsModal)

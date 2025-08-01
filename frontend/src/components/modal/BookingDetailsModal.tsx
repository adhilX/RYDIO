import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Calendar, Car, MapPin, User, Clock, CreditCard} from 'lucide-react'
import type { IbookedData } from '@/Types/User/Booking/bookedData'
import { motion, AnimatePresence, type Variants } from 'framer-motion'

const IMG_URL = import.meta.env.VITE_IMAGE_URL

interface BookingDetailsModalProps {
  booking: IbookedData | null
  isOpen: boolean
  onClose: () => void
}

const BookingDetailsModal = ({ booking, isOpen, onClose }: BookingDetailsModalProps) => {
  if (!booking) return null

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-indigo-600/20 text-indigo-300 border-indigo-500/40 shadow-indigo-500/10'
      case 'active':
        return 'bg-emerald-600/20 text-emerald-300 border-emerald-500/40 shadow-emerald-500/10'
      case 'completed':
        return 'bg-teal-600/20 text-teal-300 border-teal-500/40 shadow-teal-500/10'
      case 'cancelled':
        return 'bg-rose-600/20 text-rose-300 border-rose-500/40 shadow-rose-500/10'
      default:
        return 'bg-gray-600/20 text-gray-300 border-gray-500/40 shadow-gray-500/10'
    }
  }

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-emerald-600/20 text-emerald-300 border-emerald-500/40 shadow-emerald-500/10'
      case 'pending':
        return 'bg-amber-600/20 text-amber-300 border-amber-500/40 shadow-amber-500/10'
      case 'failed':
        return 'bg-rose-600/20 text-rose-300 border-rose-500/40 shadow-rose-500/10'
      case 'refunded':
        return 'bg-blue-600/20 text-blue-300 border-blue-500/40 shadow-blue-500/10'
      default:
        return 'bg-gray-600/20 text-gray-300 border-gray-500/40 shadow-gray-500/10'
    }
  }

  const calculateDays = (startDate: string | Date, endDate: string | Date) => {
    const start = typeof startDate === 'string' ? new Date(startDate) : startDate;
    const end = typeof endDate === 'string' ? new Date(endDate) : endDate;
    const diffTime = Math.abs(end.getTime() - start.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  const getFuelIcon = (fuel_type: string) => {
    const iconClass = "w-4 h-4"
    switch (fuel_type) {
      case "petrol":
        return <Car className={`${iconClass} text-orange-400`} />
      case "diesel":
        return <Car className={`${iconClass} text-yellow-400`} />
      case "electric":
        return <Car className={`${iconClass} text-green-400`} />
      default:
        return <Car className={`${iconClass} text-gray-400`} />
    }
  }

  const backdrop = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { duration: 0.3 }
    }
  };

  const modal :Variants= {
    hidden: { 
      opacity: 0,
      y: 20,
      scale: 0.98
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.3,
        ease: "easeOut",
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    }
  };

  const item :Variants= {
    hidden: { opacity: 0, y: 10 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.3 }
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={backdrop}
          >
            <DialogContent className="w-[95vw] max-w-5xl max-h-[90vh] overflow-y-auto bg-gradient-to-br from-gray-900 to-gray-950 border border-gray-800/80 text-gray-100 shadow-2xl shadow-black/50 backdrop-blur-sm">
              <motion.div variants={modal}>
                <DialogHeader>
                  <div className="flex items-center justify-between">
                    <DialogTitle className="text-2xl font-bold text-white flex items-center gap-3">
                      <motion.div 
                        className="p-2 bg-gradient-to-br from-indigo-600 to-blue-500 rounded-lg shadow-lg"
                        initial={{ rotate: -10, scale: 0.9 }}
                        animate={{ 
                          rotate: [0, -5, 5, -3, 3, -2, 2, 0],
                          scale: [1, 1.1, 1.1, 1.1, 1.1, 1.1, 1.1, 1],
                        }}
                        transition={{ 
                          duration: 1.5, 
                          ease: "easeInOut",
                          times: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 1],
                        }}
                      >
                        <Car className="w-6 h-6 text-white" />
                      </motion.div>
                      <span className="bg-gradient-to-r from-indigo-300 to-blue-300 bg-clip-text text-transparent">Booking Details</span>
                    </DialogTitle>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={onClose}
                      className="h-10 w-10 p-0 rounded-full hover:bg-gray-800 text-gray-400 hover:text-white transition-colors"
                    >
                      {/* <X className="h-5 w-5" /> */}
                    </Button>
                  </div>
                </DialogHeader>

                <motion.div className="space-y-6 py-2" variants={item}>
                  {/* Booking Status and ID */}
                  <motion.div 
                    className="flex items-center justify-between p-5 bg-gradient-to-r from-gray-800/80 to-gray-800/40 rounded-xl border border-gray-700/60 backdrop-blur-sm shadow-lg"
                    variants={item}
                    whileHover={{ 
                      y: -2,
                      boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                      transition: { duration: 0.2 }
                    }}
                  >
                    <div>
                      <h3 className="text-sm font-medium text-gray-400 mb-1">Booking ID</h3>
                      <p className="text-sm font-mono text-gray-300">{booking._id}</p>
                    </div>
                    <motion.div
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Badge 
                        className={`${getStatusColor(booking.status)} px-3 py-1.5 text-sm font-medium shadow-lg`}
                      >
                        {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                      </Badge>
                    </motion.div>
                  </motion.div>

                  {/* Vehicle Details */}
                  <motion.div 
                    className="space-y-4 p-6 bg-gradient-to-br from-gray-800/70 to-gray-900/50 rounded-xl border border-gray-700/50 backdrop-blur-sm shadow-inner shadow-black/20"
                    variants={item}
                    whileHover={{
                      borderColor: 'rgba(99, 102, 241, 0.3)',
                      transition: { duration: 0.3 }
                    }}
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-1.5 bg-gradient-to-br from-indigo-600 to-blue-500 rounded-lg shadow-md">
                        <Car className="w-5 h-5 text-white" />
                      </div>
                      <h3 className="text-xl font-bold bg-gradient-to-r from-indigo-200 to-blue-200 bg-clip-text text-transparent">Vehicle Information</h3>
                    </div>
                    <div className="flex gap-5">
                      <motion.div 
                        className="relative w-40 h-28 rounded-xl overflow-hidden border-2 border-gray-700/50"
                        whileHover={{ scale: 1.02 }}
                      >
                        <img
                          src={IMG_URL + booking.vehicle.image_urls[0] || "/placeholder.svg"}
                          alt={booking.vehicle.name}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      </motion.div>
                      <div className="flex-1 space-y-1.5">
                        <h4 className="text-xl font-bold text-white">{booking.vehicle.name}</h4>
                        <p className="text-blue-300 font-medium">{booking.vehicle.brand}</p>
                        <p className="text-sm text-gray-400 font-mono bg-gray-800 px-2 py-1 rounded-md inline-block">
                          {booking.vehicle.registration_number}
                        </p>
                        <div className="flex flex-wrap gap-3 pt-1 text-sm text-gray-300">
                          <div className="flex items-center gap-1.5 bg-gray-800/50 px-2.5 py-1 rounded-full">
                            {getFuelIcon(booking.vehicle.fuel_type)}
                            <span className="capitalize">{booking.vehicle.fuel_type}</span>
                          </div>
                          <div className="flex items-center gap-1.5 bg-gray-800/50 px-2.5 py-1 rounded-full">
                            <User className="w-3.5 h-3.5" />
                            <span>{booking.vehicle.seats} Seats</span>
                          </div>
                          <div className="flex items-center gap-1.5 bg-gray-800/50 px-2.5 py-1 rounded-full">
                            <Clock className="w-3.5 h-3.5" />
                            <span>{booking.vehicle.automatic ? "Automatic" : "Manual"}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>

                  {/* Booking Details */}
                  <motion.div 
                    className="space-y-4 p-6 bg-gradient-to-br from-gray-800/70 to-gray-900/50 rounded-xl border border-gray-700/50 backdrop-blur-sm shadow-inner shadow-black/20"
                    variants={item}
                    whileHover={{
                      borderColor: 'rgba(99, 102, 241, 0.3)',
                      transition: { duration: 0.3 }
                    }}
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <Calendar className="w-5 h-5 text-blue-400" />
                      <h3 className="text-lg font-semibold text-white">Booking Information</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <motion.div 
                        className="p-5 bg-gradient-to-br from-gray-800/70 to-gray-900/50 rounded-xl border border-gray-700/50 shadow-lg hover:shadow-xl hover:shadow-indigo-500/10 transition-all duration-300"
                        whileHover={{ 
                          y: -4, 
                          borderColor: 'rgba(99, 102, 241, 0.4)',
                          transition: { duration: 0.2 } 
                        }}
                      >
                        <div className="flex items-center gap-2 text-gray-400 mb-2">
                          <Clock className="w-4 h-4 text-blue-400" />
                          <span className="text-sm font-medium">Duration</span>
                        </div>
                        <p className="text-2xl font-bold text-white mb-1">
                          {calculateDays(booking.start_date, booking.end_date)} 
                          <span className="text-base font-normal text-gray-400 ml-1">
                            day{calculateDays(booking.start_date, booking.end_date) > 1 ? 's' : ''}
                          </span>
                        </p>
                        <p className="text-sm text-gray-400">
                          {new Date(booking.start_date).toLocaleDateString('en-US', { 
                            year: 'numeric', 
                            month: 'short', 
                            day: 'numeric' 
                          })} 
                          <span className="mx-2 text-gray-500">-</span>
                          {new Date(booking.end_date).toLocaleDateString('en-US', { 
                            year: 'numeric', 
                            month: 'short', 
                            day: 'numeric' 
                          })}
                        </p>
                      </motion.div>
                      
                      <motion.div 
                        className="p-5 bg-gradient-to-br from-indigo-900/40 to-blue-900/30 rounded-xl border border-indigo-800/50 shadow-lg hover:shadow-xl hover:shadow-indigo-500/20 transition-all duration-300"
                        whileHover={{ 
                          y: -4, 
                          borderColor: 'rgba(99, 102, 241, 0.6)',
                          transition: { duration: 0.2 } 
                        }}
                      >
                        <div className="flex items-center gap-2 text-blue-300 mb-2">
                          <CreditCard className="w-4 h-4" />
                          <span className="text-sm font-medium">Total Amount</span>
                        </div>
                        <p className="text-2xl font-bold text-white mb-1">
                          ₹{booking.total_amount.toLocaleString('en-IN')}
                        </p>
                        <p className="text-sm text-blue-200">
                          <span className="text-gray-400">Rate: </span>
                          ₹{booking.vehicle.price_per_day.toLocaleString('en-IN')}/day
                        </p>
                      </motion.div>
                    </div>
                  </motion.div>

                  {/* Customer Details */}
                  {/* <motion.div 
                    className="space-y-4 p-6 bg-gradient-to-br from-gray-800/70 to-gray-900/50 rounded-xl border border-gray-700/50 backdrop-blur-sm shadow-inner shadow-black/20"
                    variants={item}
                    whileHover={{
                      borderColor: 'rgba(99, 102, 241, 0.3)',
                      transition: { duration: 0.3 }
                    }}
                  >
                    <div className="flex items-center gap-2">
                      <User className="w-5 h-5 text-blue-400" />
                      <h3 className="text-lg font-semibold text-white">Customer Information</h3>
                    </div>
                    <motion.div 
                      className="p-3 bg-gray-800/50 rounded-lg border border-gray-700/50"
                      whileHover={{ x: 3, transition: { duration: 0.2 } }}
                    >
                      <div className="flex items-center gap-2 text-gray-400 mb-1">
                        <User className="w-4 h-4 text-blue-400" />
                        <span className="text-sm font-medium">Name</span>
                      </div>
                      <p className="font-medium text-white">
                        {booking.user_id?.name || 'Not provided'}
                      </p>
                    </motion.div>
                    
                    <motion.div 
                      className="p-3 bg-gray-800/50 rounded-lg border border-gray-700/50"
                      whileHover={{ x: 3, transition: { duration: 0.2 } }}
                    >
                      <div className="flex items-center gap-2 text-gray-400 mb-1">
                        <Phone className="w-4 h-4 text-blue-400" />
                        <span className="text-sm font-medium">Contact</span>
                      </div>
                      <a 
                        href={`tel:${booking.user_id?.phone || ''}`}
                        className="font-medium text-blue-400 hover:text-blue-300 transition-colors"
                      >
                        {booking.user_id?.phone || 'Not provided'}
                      </a>
                    </motion.div>
                  </motion.div> */}

                  {/* Location Details */}
                  <motion.div 
                    className="space-y-4 p-6 bg-gradient-to-br from-gray-800/70 to-gray-900/50 rounded-xl border border-gray-700/50 backdrop-blur-sm shadow-inner shadow-black/20"
                    variants={item}
                    whileHover={{
                      borderColor: 'rgba(99, 102, 241, 0.3)',
                      transition: { duration: 0.3 }
                    }}
                  >
                    <div className="flex items-center gap-2">
                      <MapPin className="w-5 h-5 text-blue-400" />
                      <h3 className="text-lg font-semibold text-white">Location Details</h3>
                    </div>
                    <motion.div 
                      className="flex items-start gap-3 p-4 bg-gray-800/50 rounded-lg border border-gray-700/50"
                      whileHover={{ x: 3, transition: { duration: 0.2 } }}
                    >
                      <div className="p-2 bg-blue-500/10 rounded-lg">
                        <MapPin className="w-5 h-5 text-blue-400" />
                      </div>
                      <div>
                        <p className="font-medium text-white mb-1">Pickup Location</p>
                        <p className="text-sm text-gray-300">
                          {booking.location?.address || 'Not specified'}
                        </p>
                      </div>
                    </motion.div>
                  </motion.div>

                  {/* Payment Status */}
                  <motion.div 
                    className="flex items-center justify-between p-5 bg-gradient-to-r from-indigo-900/40 to-blue-900/30 rounded-xl border border-indigo-800/50 backdrop-blur-sm shadow-lg"
                    variants={item}
                    whileHover={{
                      y: -2,
                      boxShadow: '0 10px 25px -5px rgba(59, 130, 246, 0.1), 0 10px 10px -5px rgba(59, 130, 246, 0.04)',
                      transition: { duration: 0.2 }
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-500/10 rounded-lg">
                        <CreditCard className="w-5 h-5 text-indigo-300" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-300">Payment Status</p>
                        <p className="text-xl font-bold bg-gradient-to-r from-indigo-200 to-blue-200 bg-clip-text text-transparent">
                          {booking.payment_status === 'paid' ? 'Payment Successful' : 'Payment Pending'}
                        </p>
                      </div>
                    </div>
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Badge 
                        className={`${getPaymentStatusColor(booking.payment_status)} px-4 py-1.5 text-sm font-semibold shadow-lg hover:shadow-xl hover:shadow-indigo-500/20 transition-all duration-300`}
                      >
                        {booking.payment_status.charAt(0).toUpperCase() + booking.payment_status.slice(1)}
                      </Badge>
                    </motion.div>
                  </motion.div>
                </motion.div>
              </motion.div>
            </DialogContent>
          </motion.div>
        )}
      </AnimatePresence>
    </Dialog>
  )
}

export default BookingDetailsModal

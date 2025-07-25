import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Calendar, Car, MapPin, User, Phone, CheckCircle, X } from 'lucide-react'

const IMG_URL = import.meta.env.VITE_IMAGE_URL

interface Owner {
  _id: string
  name: string
  email: string
  phone: string
  profile_image: string
  is_verified_user: boolean
}

interface Location {
  _id: string
  name: string
  address: string
  city: string
  state: string
  country: string
  pincode: string
}

interface Vehicle {
  _id: string
  owner_id: Owner
  location_id: Location
  name: string
  brand: string
  registration_number: string
  fuel_type: string
  seats: number
  car_type: string
  automatic: boolean
  price_per_day: number
  image_urls: string[]
}

interface Booking {
  _id: string
  vehicle: Vehicle
  name: string
  phone: string
  address: string
  city: string
  id_proof: string
  start_date: string
  end_date: string
  total_amount: number
  payment_intent_id: string
  booking_status: 'confirmed' | 'cancelled' | 'completed' | 'active'
  createdAt: string
}

interface BookingDetailsModalProps {
  booking: Booking | null
  isOpen: boolean
  onClose: () => void
}

const BookingDetailsModal = ({ booking, isOpen, onClose }: BookingDetailsModalProps) => {
  if (!booking) return null

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30'
      case 'active':
        return 'bg-green-500/20 text-green-400 border-green-500/30'
      case 'completed':
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30'
      case 'cancelled':
        return 'bg-red-500/20 text-red-400 border-red-500/30'
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30'
    }
  }

  const calculateDays = (startDate: string, endDate: string) => {
    const start = new Date(startDate)
    const end = new Date(endDate)
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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-white">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-bold text-[#232b3a] flex items-center gap-2">
              <Car className="w-6 h-6 text-[#6DA5C0]" />
              Booking Details
            </DialogTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Booking Status and ID */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <h3 className="font-semibold text-[#232b3a]">Booking ID</h3>
              <p className="text-sm text-gray-600">{booking._id}</p>
            </div>
            <Badge className={getStatusColor(booking.booking_status)}>
              {booking.booking_status.charAt(0).toUpperCase() + booking.booking_status.slice(1)}
            </Badge>
          </div>

          {/* Vehicle Details */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-[#232b3a] border-b pb-2">Vehicle Information</h3>
            <div className="flex gap-4">
              <img
                src={IMG_URL + booking.vehicle.image_urls[0] || "/placeholder.svg"}
                alt={booking.vehicle.name}
                className="w-32 h-24 rounded-lg object-cover"
              />
              <div className="flex-1 space-y-2">
                <h4 className="text-xl font-bold text-[#232b3a]">{booking.vehicle.name}</h4>
                <p className="text-lg text-gray-700">{booking.vehicle.brand}</p>
                <p className="text-sm text-gray-600">{booking.vehicle.registration_number}</p>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    {getFuelIcon(booking.vehicle.fuel_type)}
                    <span>{booking.vehicle.fuel_type}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <User className="w-4 h-4" />
                    <span>{booking.vehicle.seats} seats</span>
                  </div>
                  <span>{booking.vehicle.automatic ? "Automatic" : "Manual"}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Booking Details */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-[#232b3a] border-b pb-2">Booking Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-gray-600">
                  <Calendar className="w-4 h-4 text-[#6DA5C0]" />
                  <span>Duration</span>
                </div>
                <p className="font-medium text-[#232b3a]">
                  {calculateDays(booking.start_date, booking.end_date)} day{calculateDays(booking.start_date, booking.end_date) > 1 ? 's' : ''}
                </p>
                <p className="text-sm text-gray-500">
                  {new Date(booking.start_date).toLocaleDateString()} - {new Date(booking.end_date).toLocaleDateString()}
                </p>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-gray-600">
                  <span className="text-lg">₹</span>
                  <span>Total Amount</span>
                </div>
                <p className="font-bold text-2xl text-[#6DA5C0]">
                  ₹{booking.total_amount.toLocaleString()}
                </p>
                <p className="text-sm text-gray-500">
                  ₹{booking.vehicle.price_per_day}/day
                </p>
              </div>
            </div>
          </div>

          {/* Customer Details */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-[#232b3a] border-b pb-2">Customer Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Name</p>
                <p className="font-medium text-[#232b3a]">{booking.name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Phone</p>
                <p className="font-medium text-[#232b3a]">{booking.phone}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">City</p>
                <p className="font-medium text-[#232b3a]">{booking.city}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">ID Proof</p>
                <p className="font-medium text-[#232b3a]">{booking.id_proof}</p>
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-600">Address</p>
              <p className="font-medium text-[#232b3a]">{booking.address}</p>
            </div>
          </div>

          {/* Location Details */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-[#232b3a] border-b pb-2">Pickup Location</h3>
            <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
              <MapPin className="w-5 h-5 text-[#6DA5C0] mt-0.5" />
              <div>
                <p className="font-medium text-[#232b3a]">{booking.vehicle.location_id.name}</p>
                <p className="text-sm text-gray-600">{booking.vehicle.location_id.address}</p>
                <p className="text-sm text-gray-600">
                  {booking.vehicle.location_id.city}, {booking.vehicle.location_id.state} - {booking.vehicle.location_id.pincode}
                </p>
              </div>
            </div>
          </div>

          {/* Owner Details */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-[#232b3a] border-b pb-2">Vehicle Owner</h3>
            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
              <div className="relative">
                <img
                  src={IMG_URL + booking.vehicle.owner_id.profile_image || "/placeholder.svg"}
                  alt={booking.vehicle.owner_id.name}
                  className="w-16 h-16 rounded-full object-cover"
                />
                {booking.vehicle.owner_id.is_verified_user && (
                  <CheckCircle className="w-5 h-5 text-green-500 absolute -bottom-1 -right-1 bg-white rounded-full" />
                )}
              </div>
              <div className="flex-1">
                <p className="font-medium text-[#232b3a] text-lg">{booking.vehicle.owner_id.name}</p>
                <div className="flex items-center gap-4 text-gray-600 mt-1">
                  <div className="flex items-center gap-1">
                    <Phone className="w-4 h-4" />
                    <span>{booking.vehicle.owner_id.phone}</span>
                  </div>
                </div>
                <p className="text-sm text-gray-500 mt-1">{booking.vehicle.owner_id.email}</p>
              </div>
            </div>
          </div>

          {/* Payment Details */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-[#232b3a] border-b pb-2">Payment Information</h3>
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Payment Intent ID</p>
                  <p className="font-medium text-[#232b3a] text-sm">{booking.payment_intent_id}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Booking Date</p>
                  <p className="font-medium text-[#232b3a]">
                    {new Date(booking.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default BookingDetailsModal

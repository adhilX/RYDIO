import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
interface BookingModalProps {
  open: boolean
  onClose: () => void
  booking: any
}
const NG_URL = import.meta.env.VITE_IMAGE_URL
export default function BookingModal({ open, onClose, booking }: BookingModalProps) {
  if (!booking) return null

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-zinc-900 text-white border border-red-600 rounded-2xl shadow-xl max-w-4xl max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex justify-between items-center border-b border-zinc-800 pb-2">
          <DialogTitle className="text-xl font-bold text-red-500">
            Booking #{booking.booking_id || booking._id}
          </DialogTitle>
          <Button variant="ghost" size="icon" onClick={onClose} className="text-red-400 hover:text-red-600"/>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
          
          {/* User Info */}
          <div className="p-4 rounded-lg bg-zinc-800 border border-red-700">
            <h3 className="text-red-400 font-semibold mb-2">User Info</h3>
            <div className="flex items-center gap-3 mb-2">
              {booking.user?.profile_image && (
                <img
                  src={NG_URL + booking.user.profile_image}
                  alt={booking.user?.name}
                  width={50}
                  height={50}
                  className="rounded-full border border-red-600"
                />
              )}
              <div>
                <p className="font-semibold">{booking.user?.name}</p>
                <p className="text-gray-400 text-sm">{booking.user?.email}</p>
              </div>
            </div>
            <p><span className="text-gray-400">Phone:</span> {booking.user?.phone}</p>
            <p><span className="text-gray-400">Verified:</span> {booking.user?.is_verified_user ? "✅ Yes" : "❌ No"}</p>
          </div>

          {/* Vehicle Info */}
          <div className="p-4 rounded-lg bg-zinc-800 border border-red-700">
            <h3 className="text-red-400 font-semibold mb-2">Vehicle Info</h3>
            <p><span className="text-gray-400">Name:</span> {booking.vehicle?.name}</p>
            <p><span className="text-gray-400">Brand:</span> {booking.vehicle?.brand}</p>
            <p><span className="text-gray-400">Reg No:</span> {booking.vehicle?.registration_number}</p>
            <p><span className="text-gray-400">Price/Day:</span> ₹{booking.vehicle?.price_per_day}</p>
            <p><span className="text-gray-400">Type:</span> {booking.vehicle?.car_type}</p>
            <p><span className="text-gray-400">Fuel:</span> {booking.vehicle?.fuel_type}</p>
            <p><span className="text-gray-400">Gear:</span> {booking.vehicle?.automatic ? "Automatic" : "Manual"}</p>
          </div>

          {/* Booking Info */}
          <div className="p-4 rounded-lg bg-zinc-800 border border-red-700">
            <h3 className="text-red-400 font-semibold mb-2">Booking Info</h3>
            <p><span className="text-gray-400">Start:</span> {new Date(booking.start_date).toLocaleDateString()}</p>
            <p><span className="text-gray-400">End:</span> {new Date(booking.end_date).toLocaleDateString()}</p>
            <p><span className="text-gray-400">Total Amount:</span> ₹{booking.total_amount}</p>
            <p><span className="text-gray-400">Status:</span> <span className="text-red-400">{booking.status}</span></p>
            <p><span className="text-gray-400">Payment:</span> {booking.payment_status} ({booking.payment_type})</p>
          </div>

          {/* Finance Info */}
          {booking.finance && (
            <div className="p-4 rounded-lg bg-zinc-800 border border-red-700">
              <h3 className="text-red-400 font-semibold mb-2">Finance</h3>
              <p><span className="text-gray-400">Deposit:</span> ₹{booking.finance.security_deposit}</p>
              <p><span className="text-gray-400">Admin Commission:</span> ₹{booking.finance.admin_commission}</p>
              <p><span className="text-gray-400">Owner Earnings:</span> ₹{booking.finance.owner_earnings}</p>
              <p><span className="text-gray-400">Fine:</span> ₹{booking.finance.fine_amount}</p>
              <p><span className="text-gray-400">Late Return:</span> {booking.finance.is_late_return ? "Yes" : "No"}</p>
            </div>
          )}
        </div>

        {/* Vehicle Images */}
        {booking.vehicle?.image_urls && (
          <div className="mt-6">
            <h3 className="text-red-400 font-semibold mb-2">Vehicle Images</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                <img
                  src={NG_URL + booking.vehicle.image_urls[0]}
                  alt="vehicle"
                  width={200}
                  height={150}
                  className="rounded-lg border border-red-600 object-cover"
                />
              
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}

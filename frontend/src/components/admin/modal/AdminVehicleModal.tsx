import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { handleVehicle } from '@/services/admin/vehicleSevice';
import type { Vehicle } from '@/Types/User/addVehicle/Ivehicle';
import type { Iuser } from '@/Types/User/Iuser';
import type { Ilocation } from '@/Types/User/location';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import toast from 'react-hot-toast';


interface AdminVehicleModalProps {
  open: boolean;
  onClose: () => void;
  vehicle: Vehicle & { owner_id: Iuser , location_id:Ilocation};
}

export const AdminVehicleModal: React.FC<AdminVehicleModalProps> = ({ open, onClose, vehicle }) => {
  if (!vehicle) return null;
  
  const handleAccept = async()=>{
   const response = await handleVehicle(vehicle._id!,'accepted')
  toast.success(response.message)
  onClose()
  }
  const handleReject = async()=>{
   const response = await handleVehicle(vehicle._id!,'rejected')
  toast.success(response.message)
  onClose()
  }
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl p-0 overflow-hidden bg-neutral-900">
        <motion.div
          className="w-full"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex justify-between items-center px-6 py-4 text-white border-b dark:border-gray-700">
            <DialogTitle className="text-lg font-bold">Vehicle Details</DialogTitle>
            <button onClick={onClose} title="Close">
              <X className="w-5 h-5" aria-label="Close" />
            </button>
          </div>

          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-gray-800 dark:text-gray-200">
            {/* Vehicle Info */}
            <div>
              <h3 className="font-semibold mb-2">Vehicle Info</h3>
              <p><span className="font-medium">Name:</span> {vehicle.name}</p>
              <p><span className="font-medium">Brand:</span> {vehicle.brand}</p>
              <p><span className="font-medium">Type:</span> {vehicle.car_type}</p>
              <p><span className="font-medium">Fuel:</span> {vehicle.fuel_type}</p>
              <p><span className="font-medium">Seats:</span> {vehicle.seats}</p>
              <p><span className="font-medium">Price/Day:</span> ₹{vehicle.price_per_day}</p>
              <p><span className="font-medium">Status:</span> {vehicle.admin_approve}</p>
              <p><span className="font-medium">Available:</span> {vehicle.is_available ? 'Yes' : 'No'}</p>
              <p><span className="font-medium">Registration No:</span> {vehicle.registration_number}</p>
              <p><span className="font-medium">Description:</span> {vehicle.description}</p>
            </div>

            {/* Owner Info */}
            <div>
              <h3 className="font-semibold mb-2">Owner Info</h3>
              <p><span className="font-medium">Name:</span> {vehicle.owner_id.name}</p>
              <p><span className="font-medium">Email:</span> {vehicle.owner_id.email}</p>
              <p><span className="font-medium">Phone:</span> {vehicle.owner_id.phone}</p>

              <div className="mt-4">
                <h3 className="font-semibold mb-2">Location</h3>
                <p><span className="font-medium">City:</span> {vehicle.location_id.city}</p>
                <p><span className="font-medium">State:</span> {vehicle.location_id.state}</p>
                <p><span className="font-medium">Country:</span> {vehicle.location_id.country}</p>
                <p><span className="font-medium">Pincode:</span> {vehicle.location_id.pincode}</p>
              </div>
            </div>
          </div>

          {/* Images */}
          {vehicle.image_urls?.length > 0 && (
            <div className="px-6 pb-6">
              <h3 className="font-semibold mb-2 text-white">Images</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {vehicle.image_urls.map((url, idx) => (
                  <img
                    key={idx}
                    src={url}
                    alt={`vehicle-${idx}`}
                    className="w-full h-32 object-cover rounded shadow"
                  />
                ))}
              </div>
            </div>
          )}
        </motion.div>
        <div className="flex justify-end gap-4 px-6 pb-6">
          <button
          onClick={handleAccept}
            className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded cursor-pointer transition-colors"
          >
            Accept
          </button>
          <button
          onClick={handleReject}
            className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded cursor-pointer transition-colors"
          >
            Reject
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

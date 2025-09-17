import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { handleVehicle } from '@/services/admin/vehicleSevice';
import type { Vehicle } from '@/Types/User/addVehicle/Ivehicle';
import type { Iuser } from '@/Types/User/Iuser';
import type { Ilocation } from '@/Types/User/location';
import { motion } from 'framer-motion';
import { X, Car, User, MapPin, Fuel, Users, CreditCard, FileText, CheckCircle, XCircle, Clock } from 'lucide-react';
import toast from 'react-hot-toast';
import { useLocation } from 'react-router';
import { useState } from 'react';
import ReasonModal from '@/components/modal/ReasonModal';

const IMG_URL=import.meta.env.VITE_IMAGE_URL
interface AdminVehicleModalProps {
  open: boolean;
  onClose: () => void;
  vehicle: Vehicle & { owner_id: Iuser , location_id:Ilocation};
}

export const AdminVehicleModal: React.FC<AdminVehicleModalProps> = ({ open, onClose, vehicle }) => {
  const {pathname} = useLocation()
  const [showReasonModal, setShowReasonModal] = useState(false);
  
  if (!vehicle) return null;
  
  const showBtn = pathname == '/admin/vehicle_requests'
  
  const handleAccept = async()=>{
   const response = await handleVehicle(vehicle._id!,'accepted')
   toast.success(response.message)
   onClose()
  }
  
  const handleReject = () => {
    setShowReasonModal(true);
  }
  
  const handleReasonSubmit = async (reason: string) => {
    try {
      const response = await handleVehicle(vehicle._id!, 'rejected', reason)
      toast.success(response.message)
      setShowReasonModal(false);
      onClose() 
    } catch (error) {
      console.error('Error rejecting vehicle:', error);
      toast.error('Failed to reject vehicle');
    }
  }
  
  const handleReasonModalClose = () => {
    setShowReasonModal(false);
  }
  return (
    <>
    <Dialog open={open && !showReasonModal} onOpenChange={onClose}>
      <DialogContent className="max-w-10xl max-h-[90vh] p-0 overflow-y-auto bg-white dark:bg-gray-900 border-0 shadow-2xl">
        <motion.div
          className="w-full"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        >
          {/* Header */}
          <div className="relative bg-gray-800 px-6 py-6 text-white">
            <div className="flex justify-between items-start">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-white/20 rounded-lg">
                  <Car className="w-6 h-6" />
                </div>
                <div>
                  <DialogTitle className="text-2xl font-bold">{vehicle.name}</DialogTitle>
                  <p className="text-gray-300 text-sm">{vehicle.brand} • {vehicle.car_type}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  vehicle.admin_approve === 'accepted' ? 'bg-green-600 text-white' :
                  vehicle.admin_approve === 'rejected' ? 'bg-red-600 text-white' :
                  'bg-gray-600 text-white'
                }`}>
                  {vehicle.admin_approve === 'accepted' && <CheckCircle className="w-3 h-3 inline mr-1" />}
                  {vehicle.admin_approve === 'rejected' && <XCircle className="w-3 h-3 inline mr-1" />}
                  {vehicle.admin_approve === 'pending' && <Clock className="w-3 h-3 inline mr-1" />}
                  {vehicle.admin_approve.charAt(0).toUpperCase() + vehicle.admin_approve.slice(1)}
                </div>
                <button 
                  onClick={onClose} 
                  className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                  title="Close"
                >
                  <X className="w-5 h-5" aria-label="Close" />
                </button>
              </div>
            </div>
          </div>

          <div className="p-4 sm:p-6 space-y-6">
            {/* Vehicle Details Cards */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">
              {/* Vehicle Information Card */}
              <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 sm:p-6 border border-gray-300 dark:border-gray-700">
                <div className="flex items-center space-x-2 mb-4">
                  <Car className="w-5 h-5 text-gray-800 dark:text-white" />
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Vehicle Information</h3>
                </div>
                <div className="space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-2 border-b border-gray-300 dark:border-gray-600 gap-1 sm:gap-0">
                    <span className="text-gray-600 dark:text-gray-400 flex items-center text-sm sm:text-base">
                      <FileText className="w-4 h-4 mr-2 flex-shrink-0" />
                      Registration
                    </span>
                    <span className="font-medium text-gray-900 dark:text-white text-sm sm:text-base break-all sm:break-normal">{vehicle.registration_number}</span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-2 border-b border-gray-300 dark:border-gray-600 gap-1 sm:gap-0">
                    <span className="text-gray-600 dark:text-gray-400 flex items-center text-sm sm:text-base">
                      <Fuel className="w-4 h-4 mr-2 flex-shrink-0" />
                      Fuel Type
                    </span>
                    <span className="font-medium text-gray-900 dark:text-white text-sm sm:text-base">{vehicle.fuel_type}</span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-2 border-b border-gray-300 dark:border-gray-600 gap-1 sm:gap-0">
                    <span className="text-gray-600 dark:text-gray-400 flex items-center text-sm sm:text-base">
                      <Users className="w-4 h-4 mr-2 flex-shrink-0" />
                      Seats
                    </span>
                    <span className="font-medium text-gray-900 dark:text-white text-sm sm:text-base">{vehicle.seats}</span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-2 border-b border-gray-300 dark:border-gray-600 gap-1 sm:gap-0">
                    <span className="text-gray-600 dark:text-gray-400 flex items-center text-sm sm:text-base">
                      <CreditCard className="w-4 h-4 mr-2 flex-shrink-0" />
                      Price per Day
                    </span>
                    <span className="font-bold text-base sm:text-lg text-green-600 dark:text-green-400">₹{vehicle.price_per_day}</span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-2 gap-1 sm:gap-0">
                    <span className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">Available</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold w-fit ${
                      vehicle.is_available 
                        ? 'bg-green-600 text-white' 
                        : 'bg-red-600 text-white'
                    }`}>
                      {vehicle.is_available ? 'Yes' : 'No'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Owner Information Card */}
              <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 sm:p-6 border border-gray-300 dark:border-gray-700">
                <div className="flex items-center space-x-2 mb-4">
                  <User className="w-5 h-5 text-gray-800 dark:text-white" />
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Owner Information</h3>
                </div>
                <div className="space-y-2 sm:space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-2 border-b border-gray-300 dark:border-gray-600 gap-1 sm:gap-0">
                    <span className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">Name</span>
                    <span className="font-medium text-gray-900 dark:text-white text-sm sm:text-base break-words">{vehicle.owner_id.name}</span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-2 border-b border-gray-300 dark:border-gray-600 gap-1 sm:gap-0">
                    <span className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">Email</span>
                    <span className="font-medium text-gray-900 dark:text-white text-xs sm:text-sm break-all">{vehicle.owner_id.email}</span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-2 gap-1 sm:gap-0">
                    <span className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">Phone</span>
                    <span className="font-medium text-gray-900 dark:text-white text-sm sm:text-base">{vehicle.owner_id.phone}</span>
                  </div>
                </div>

                {/* Location Section */}
                <div className="mt-4 sm:mt-6">
                  <div className="flex items-center space-x-2 mb-3">
                    <MapPin className="w-4 h-4 text-gray-800 dark:text-white flex-shrink-0" />
                    <h4 className="font-semibold text-gray-900 dark:text-white text-sm sm:text-base">Location</h4>
                  </div>
                  <div className="bg-white dark:bg-gray-700 rounded-lg p-3 sm:p-4 space-y-2">
                    <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-0">
                      <span className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm">City</span>
                      <span className="font-medium text-gray-900 dark:text-white text-xs sm:text-sm break-words">{vehicle.location_id.city}</span>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-0">
                      <span className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm">State</span>
                      <span className="font-medium text-gray-900 dark:text-white text-xs sm:text-sm break-words">{vehicle.location_id.state}</span>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-0">
                      <span className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm">Country</span>
                      <span className="font-medium text-gray-900 dark:text-white text-xs sm:text-sm break-words">{vehicle.location_id.country}</span>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-0">
                      <span className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm">Pincode</span>
                      <span className="font-medium text-gray-900 dark:text-white text-xs sm:text-sm">{vehicle.location_id.pincode}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Description Section */}
            {vehicle.description && (
              <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 sm:p-6 border border-gray-300 dark:border-gray-700">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-3">Description</h3>
                <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300 leading-relaxed break-words">{vehicle.description}</p>
              </div>
            )}
          </div>

          {/* Images Gallery */}
          {vehicle.image_urls?.length > 0 && (
            <div className="px-4 sm:px-6 pb-4 sm:pb-6">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-4">Vehicle Images</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
                {vehicle.image_urls.map((url, idx) => (
                  <motion.div
                    key={idx}
                    className="group relative overflow-hidden rounded-xl shadow-md hover:shadow-xl transition-all duration-300"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <img
                      src={IMG_URL+url}
                      alt={`${vehicle.name} - Image ${idx + 1}`}
                      className="w-full h-32 sm:h-40 object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </motion.div>

        {showBtn && vehicle.admin_approve == 'pending' && (
          <div className="px-4 sm:px-6 pb-4 sm:pb-6">
            <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 border border-gray-300 dark:border-gray-700">
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Admin Actions</h3>
              <div className="flex flex-col sm:flex-row justify-end gap-3">
                <motion.button
                  onClick={handleAccept}
                  className="flex items-center justify-center space-x-2 bg-green-600 hover:bg-green-700 text-white font-semibold py-2.5 sm:py-3 px-4 sm:px-6 rounded-lg transition-all duration-200 text-sm sm:text-base"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <CheckCircle className="w-4 h-4 flex-shrink-0" />
                  <span>Accept Vehicle</span>
                </motion.button>
                <motion.button
                  onClick={handleReject}
                  className="flex items-center justify-center space-x-2 bg-red-600 hover:bg-red-700 text-white font-semibold py-2.5 sm:py-3 px-4 sm:px-6 rounded-lg transition-all duration-200 text-sm sm:text-base"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <XCircle className="w-4 h-4 flex-shrink-0" />
                  <span>Reject Vehicle</span>
                </motion.button>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
    
    <ReasonModal
      isOpen={showReasonModal}
      onClose={handleReasonModalClose}
      onSubmit={handleReasonSubmit}
      title="Reason for Vehicle Rejection"
      description="Please provide a reason for rejecting this vehicle registration."
      placeholder="Enter the reason for rejecting this vehicle..."
      submitButtonText="Reject Vehicle"
      cancelButtonText="Cancel"
    />
    </>
  );
};

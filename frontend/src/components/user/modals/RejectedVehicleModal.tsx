import React, { useState } from 'react';
import { X, Car, Calendar, MapPin, Fuel, Users, Settings, DollarSign, AlertCircle, RefreshCw } from 'lucide-react';
import { Spinner } from "@/components/ui/spinner";
import type { Vehicle } from '@/Types/User/addVehicle/Ivehicle';
import { reapplyVehicle } from '@/services/user/vehicleService';
import { toast } from 'react-hot-toast';
const IMG_URL = import.meta.env.VITE_IMAGE_URL
interface RejectedVehicleModalProps {
  vehicle: Vehicle;
  isOpen: boolean;
  onClose: () => void;
  onReapplySuccess: (vehicleId: string) => void;
}

const RejectedVehicleModal: React.FC<RejectedVehicleModalProps> = ({
  vehicle,
  isOpen,
  onClose,
  onReapplySuccess
}) => {
  const [isReapplying, setIsReapplying] = useState(false);

  if (!isOpen) return null;

  const handleReapply = async () => {
    try {
      setIsReapplying(true);
      const response = await reapplyVehicle(vehicle._id!);

      if (response.success) {
        toast.success('Vehicle re-submitted for review');
        onReapplySuccess(vehicle._id!);
        onClose();
      } else {
        toast.error(response.message || 'Failed to reapply vehicle');
      }
    } catch (error) {
      console.error('Error reapplying vehicle:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to reapply vehicle');
    } finally {
      setIsReapplying(false);
    }
  };

  const formatDate = (dateString: string | Date) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="fixed inset-0  bg-black flex items-center justify-center z-50 p-4">
      <div className="bg-stone-50 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">Vehicle Details</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Vehicle Images */}
          {vehicle.image_urls && vehicle.image_urls.length > 0 && (
            <div className="mb-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {vehicle.image_urls.slice(0, 3).map((imageUrl, index) => (
                  <div key={index} className="aspect-video rounded-lg overflow-hidden">
                    <img
                      src={IMG_URL + imageUrl}
                      alt={`${vehicle.name} - Image ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Vehicle Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Car className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="text-sm text-gray-500">Vehicle Name</p>
                  <p className="font-semibold text-gray-900">{vehicle.name}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Car className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="text-sm text-gray-500">Brand</p>
                  <p className="font-semibold text-gray-900">{vehicle.brand}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <MapPin className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="text-sm text-gray-500">Registration Number</p>
                  <p className="font-semibold text-gray-900">{vehicle.registration_number}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Calendar className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="text-sm text-gray-500">Submitted On</p>
                  <p className="font-semibold text-gray-900">
                    {formatDate(vehicle.created_at || new Date())}
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Fuel className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="text-sm text-gray-500">Fuel Type</p>
                  <p className="font-semibold text-gray-900 capitalize">{vehicle.fuel_type}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Users className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="text-sm text-gray-500">Seats</p>
                  <p className="font-semibold text-gray-900">{vehicle.seats} Seater</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Settings className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="text-sm text-gray-500">Transmission</p>
                  <p className="font-semibold text-gray-900">
                    {vehicle.automatic ? 'Automatic' : 'Manual'}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <DollarSign className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="text-sm text-gray-500">Price per Day</p>
                  <p className="font-semibold text-gray-900">₹{vehicle.price_per_day}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Vehicle Description */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Description</h3>
            <p className="text-gray-700 bg-gray-50 p-4 rounded-lg">{vehicle.description}</p>
          </div>

          {/* Rejection Reason */}
          <div className="mb-6">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
                <div>
                  <h3 className="text-lg font-semibold text-red-800 mb-2">Rejection Reason</h3>
                  <p className="text-red-700">
                    {vehicle.reject_reason || 'No specific reason provided.'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-200">
            <button
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Close
            </button>
            <button
              onClick={handleReapply}
              disabled={isReapplying}
              className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium flex items-center justify-center space-x-2"
            >
              {isReapplying ? (
                <>
                  <Spinner size="sm" variant="light" className="mr-2" />
                  <span>Reapplying...</span>
                </>
              ) : (
                <>
                  <RefreshCw className="w-4 h-4" />
                  <span>Reapply for Review</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RejectedVehicleModal;

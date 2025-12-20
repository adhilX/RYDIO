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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-black/80 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl animate-in zoom-in-95 duration-200 scrollbar-none">

        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between p-6 border-b border-white/10 bg-black/60 backdrop-blur-md">
          <div>
            <h2 className="text-2xl font-bold text-white tracking-tight">Vehicle Details & Reapplication</h2>
            <p className="text-sm text-gray-400 mt-1">Review rejection reason and re-submit</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 -mr-2 text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-full transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-8">

          {/* Rejection Reason Alert - Prominent at the top */}
          <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-5 backdrop-blur-md relative overflow-hidden group">
            <div className="absolute inset-0 bg-red-500/5 blur-xl group-hover:bg-red-500/10 transition-colors"></div>
            <div className="relative flex gap-4">
              <div className="p-3 bg-red-500/20 rounded-xl h-fit">
                <AlertCircle className="w-6 h-6 text-red-500" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-red-400 mb-1">Application Rejected</h3>
                <p className="text-red-200/80 text-sm leading-relaxed">
                  {vehicle.reject_reason || 'No specific reason provided by the admin. Please check your details and try again.'}
                </p>
              </div>
            </div>
          </div>


          {/* Vehicle Images Carousel/Grid */}
          {vehicle.image_urls && vehicle.image_urls.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider ml-1">Vehicle Images</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {vehicle.image_urls.slice(0, 3).map((imageUrl, index) => (
                  <div key={index} className="aspect-video relative rounded-xl overflow-hidden border border-white/10 group">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity z-10"></div>
                    <img
                      src={IMG_URL + imageUrl}
                      alt={`${vehicle.name} - Image ${index + 1}`}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Vehicle Info Grid */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider ml-1">Vehicle Specifications</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Left Column */}
              <div className="bg-white/5 rounded-2xl p-5 border border-white/5 space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="p-2 bg-white/10 rounded-lg"><Car className="w-5 h-5 text-white" /></div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase font-bold">Vehicle Name</p>
                    <p className="font-bold text-white text-lg">{vehicle.name}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="p-2 bg-white/10 rounded-lg"><Fuel className="w-5 h-5 text-white" /></div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase font-bold">Fuel Type</p>
                    <p className="font-bold text-white capitalize">{vehicle.fuel_type}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="p-2 bg-white/10 rounded-lg"><Users className="w-5 h-5 text-white" /></div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase font-bold">Seats</p>
                    <p className="font-bold text-white">{vehicle.seats} Seater</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="p-2 bg-white/10 rounded-lg"><Calendar className="w-5 h-5 text-white" /></div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase font-bold">Submitted On</p>
                    <p className="font-bold text-white">{formatDate(vehicle.created_at || new Date())}</p>
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div className="bg-white/5 rounded-2xl p-5 border border-white/5 space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="p-2 bg-white/10 rounded-lg"><Settings className="w-5 h-5 text-white" /></div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase font-bold">Brand</p>
                    <p className="font-bold text-white">{vehicle.brand}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="p-2 bg-white/10 rounded-lg"><MapPin className="w-5 h-5 text-white" /></div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase font-bold">Registration</p>
                    <p className="font-bold text-white">{vehicle.registration_number}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="p-2 bg-white/10 rounded-lg"><Settings className="w-5 h-5 text-white" /></div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase font-bold">Transmission</p>
                    <p className="font-bold text-white">{vehicle.automatic ? 'Automatic' : 'Manual'}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="p-2 bg-green-500/20 rounded-lg"><DollarSign className="w-5 h-5 text-green-400" /></div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase font-bold">Price per Day</p>
                    <p className="font-bold text-green-400 text-lg">₹{vehicle.price_per_day}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Description */}
          {vehicle.description && (
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider ml-1">Description</h3>
              <div className="bg-white/5 p-5 rounded-2xl border border-white/5">
                <p className="text-gray-300 leading-relaxed">{vehicle.description}</p>
              </div>
            </div>
          )}

        </div>

        {/* Footer Actions */}
        <div className="sticky bottom-0 z-10 p-6 bg-black/80 backdrop-blur-xl border-t border-white/10 flex flex-col md:flex-row gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-6 py-3.5 rounded-xl border border-white/10 text-gray-300 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all font-bold text-sm uppercase tracking-wide"
          >
            Close Details
          </button>
          <button
            onClick={handleReapply}
            disabled={isReapplying}
            className="flex-[2] px-6 py-3.5 rounded-xl bg-white text-black hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-bold text-sm uppercase tracking-wide flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_30px_rgba(255,255,255,0.2)]"
          >
            {isReapplying ? (
              <>
                <Spinner size="sm" variant="dark" className="mr-2" />
                Reapplying...
              </>
            ) : (
              <>
                <RefreshCw className="w-4 h-4" />
                Re-Submit for Review
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default RejectedVehicleModal;

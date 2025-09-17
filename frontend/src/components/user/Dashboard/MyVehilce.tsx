import { useCallback, useEffect, useState } from 'react';
import { PlusCircle, Search, Trash2, Check, X, Eye } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { getMyVehicle, updateVehicleStatus, deleteVehicle } from '@/services/user/vehicleService';
import { useSelector } from 'react-redux';
import type { RootState } from '@/store/store';
import type { Vehicle } from '@/Types/User/addVehicle/Ivehicle';
import Pagination from '@/components/Pagination';
import { toast } from 'react-hot-toast';
import RejectedVehicleModal from '@/components/user/modals/RejectedVehicleModal';
const IMG_URL = import.meta.env.VITE_IMAGE_URL

const ListVehilce = () => {
    const user = useSelector((state: RootState) => state.auth.user)
    const [vehicles, setVehicles] = useState<Vehicle[]>([]);
    const [totalPages, setTotalPages] = useState<number>(1);
    const [search, setSearch] = useState<string>('');
    const [limit] = useState<number>(5);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [debouncedSearch, setDebouncedSearch] = useState<string>('');
    const [disableAddBtn, setDisableAddBtn] = useState<boolean>(false);
    const [updatingStatus, setUpdatingStatus] = useState<Record<string, boolean>>({});
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
    const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const navigate = useNavigate();

  const handleDelete = useCallback(async (vehicleId: string) => {
        try {
            setDeletingId(vehicleId);
            await deleteVehicle(vehicleId);
            toast.success('Vehicle deleted successfully');
            setVehicles(prev => prev.filter(v => v._id !== vehicleId));
        } catch (error) {
            console.error('Error deleting vehicle:', error);
            toast.error('Error deleting vehicle');
        } finally {
            setDeletingId(null);
            setShowDeleteConfirm(null);
        }
    }, []);

    useEffect(() => {
        const timeout = setTimeout(() => {
            setDebouncedSearch(search);
            setCurrentPage(1);
        }, 1000);
        return () => clearTimeout(timeout);
    }, [search]);

    useEffect(() => {
        const fetchData = async () => {
            if (!user?._id) return;
            if ((!user?.idproof_id || !user.is_verified_user) && vehicles.length >= 1) {
                setDisableAddBtn(true);
            };
        setIsLoading(true);
        try {
            const response = await getMyVehicle(user._id, debouncedSearch, currentPage, limit);
            if (response?.vehicles) {
                setVehicles(response.vehicles);
                setTotalPages(Math.ceil((response.total || 0) / limit));
            }
        } catch (error) {
            console.error('Error fetching vehicles:', error);
        } finally {
            setIsLoading(false);
        }
    }
    
    fetchData();
    }, [debouncedSearch, currentPage, limit, user?._id, user?.idproof_id,user?.is_verified_user, vehicles.length]);
    
    const handleStatusToggle =useCallback( async (vehicleId: string, currentStatus: boolean) => {
        if (!vehicleId) return;
        
        setUpdatingStatus({ [vehicleId]: true });
        try {
            await updateVehicleStatus(vehicleId, !currentStatus);
            setVehicles(prev => prev.map(v => v._id === vehicleId ? { ...v, is_available: !currentStatus } : v));
        } catch (error) {
            console.error('Error updating vehicle status:', error);
            setVehicles(prev => prev.map(v => v._id === vehicleId ? { ...v, is_available: currentStatus } : v));
        } finally {
            setUpdatingStatus({ [vehicleId]: false });
        }
    },[])

    const handleViewRejectedVehicle = useCallback((vehicle: Vehicle) => {
        setSelectedVehicle(vehicle);
        setIsModalOpen(true);
    }, []);

    const handleCloseModal = useCallback(() => {
        setIsModalOpen(false);
        setSelectedVehicle(null);
    }, []);

    const handleReapplySuccess = useCallback((vehicleId: string) => {
        // Remove the vehicle from the rejected list and update its status
        setVehicles(prev => prev.map(v => 
            v._id === vehicleId 
                ? { ...v, admin_approve: 'reapplied' as const, reject_reason: undefined }
                : v
        ));
        toast.success('Vehicle re-submitted for review');
    }, []);

  
    return (
        <div className="w-full  p-4 md:p-8 font-sans">
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-2xl md:text-3xl font-bold tracking-tight">My Vehicles</h1>
                <motion.div className="bg-black/80 backdrop-blur-xl border border-black/60 shadow-2xl p-3 rounded-xl">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                            <input
                                type="text"
                                placeholder="Search by email or name..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-white/40 rounded-lg bg-transparent text-white focus:outline-none focus:ring-2 focus:ring-[#e63946]"
                            />
                        </div>
                    </div>
                </motion.div>
                {disableAddBtn && (
                    <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded-lg shadow-sm text-sm font-medium max-w-md">
                        Submit ID proof to add more vehicles.
                    </div>
                )}
                <button
                    disabled={disableAddBtn}
                    onClick={() => navigate('/userProfile/add-vehicle')}
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-semibold shadow transition
            ${disableAddBtn
                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            : 'bg-[#6DA5C0] text-white hover:bg-[#232b3a]'
                        }`
                    }
                >
                    <PlusCircle className="w-5 h-5" />
                    Add Vehicle
                </button>
            </div>
            <div className="overflow-x-auto">

                {isLoading ? (
                    <div className="flex flex-col justify-center items-center h-64">
                        <div className="w-16 h-16 border-4 border-red-500 border-t-transparent rounded-full animate-spin"></div>
                        <span className="mt-4 text-white/80 text-lg font-semibold animate-pulse">Loading vehicle...</span>
                    </div>
                ) : vehicles.length === 0 ? (
                    <div className="p-6  h-100 flex text-center justify-center text-gray-400">No vehicle found</div>
                ) : (
                    <table className="min-w-full bg-stone-900/80 backdrop-blur-sm rounded-xl shadow-lg overflow-hidden">
                        <thead>
                            <tr className="bg-gradient-to-r from-[#6DA5C0] to-[#232b3a] text-white">
                                <th className="px-6 py-4 text-left font-semibold">VEHICLE DETAILS</th>
                                <th className="px-4 py-3 text-center font-semibold">FUEL TYPE</th>
                                <th className="px-4 py-3 text-center font-semibold">ADMIN STATUS</th>
                                <th className="px-4 py-3 text-center font-semibold">AVAILABILITY</th>
                                <th className="px-4 py-3 text-center font-semibold">ACTIONS</th>
                            </tr>
                        </thead>
                        <tbody>
                            {vehicles.map((vehicle, index) => (
                         <tr key={index} className="border-b border-stone-700 hover:bg-stone-800/50 transition-colors">
                         <td className="px-6 py-4">
                             <div className="flex items-center space-x-4">
                                 <div className="flex-shrink-0 w-20 h-16 rounded-lg overflow-hidden">
                                     <img
                                         src={IMG_URL + vehicle.image_urls[0]}
                                         alt={vehicle.name}
                                         className="w-full h-full object-cover"
                                     />
                                 </div>
                                 <div>
                                     <h3 className="text-white font-medium">{vehicle.name}</h3>
                                     <p className="text-sm text-gray-300">{vehicle.brand}</p>
                                 </div>
                             </div>
                         </td>
                         <td className="px-4 py-4 text-center text-gray-300 capitalize">
                             {vehicle.fuel_type}
                         </td>
                         <td className="px-4 py-4 text-center">
                             <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                                 vehicle.admin_approve === 'accepted'
                                     ? 'bg-green-100 text-green-800'
                                     : vehicle.admin_approve === 'pending'
                                         ? 'bg-yellow-100 text-yellow-800'
                                         : vehicle.admin_approve === 'rejected'
                                             ? 'bg-red-100 text-red-800'
                                             : vehicle.admin_approve === 'reapplied'
                                                 ? 'bg-blue-100 text-blue-800'
                                                 : 'bg-gray-100 text-gray-800'
                                 }`}>
                                 {vehicle.admin_approve}
                             </span>
                         </td>
                         <td className="px-4 py-4">
                             <div className="flex flex-col items-center space-y-1.5">
                                 <button
                                     onClick={() => {
                                         handleStatusToggle(vehicle._id!, !!vehicle.is_available);
                                     }}
                                     disabled={updatingStatus[vehicle._id!]}
                                     className={`relative inline-flex items-center h-7 rounded-full w-14 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${vehicle.is_available ? 'bg-green-200' : 'bg-gray-400'}`}
                                 >
                                     <span className={`inline-block w-5 h-5 transform transition-transform bg-white rounded-full shadow-md ${vehicle.is_available ? 'translate-x-8' : 'translate-x-1'}`} />
                                     {updatingStatus[vehicle._id!] && (
                                         <div className="absolute inset-0 flex items-center justify-center">
                                             <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                         </div>
                                     )}
                                 </button>
                                 <span className={`text-xs font-medium ${vehicle.is_available ? 'text-white' : 'text-gray-400'}`}>
                                     {updatingStatus[vehicle._id!] ? 'Updating...' : vehicle.is_available ? 'Listed' : 'Unlisted'}
                                 </span>
                             </div>
                         </td>
                         <td className="px-4 py-4">
                             <div className="flex justify-center space-x-3">
                                 <div className="flex items-center space-x-2">
                                     {/* View button for rejected vehicles */}
                                     {vehicle.admin_approve === 'rejected' && (
                                         <button
                                             onClick={() => handleViewRejectedVehicle(vehicle)}
                                             className="p-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg"
                                             title="View Details & Reapply"
                                         >
                                             <Eye className="w-4 h-4" />
                                         </button>
                                     )}
                                     <div className="relative">
                                         {showDeleteConfirm === vehicle._id ? (
                                             <div className="absolute right-0 z-10 flex items-center bg-white rounded-lg shadow-lg p-1 space-x-1">
                                                 <span className="px-2 text-sm text-gray-700 whitespace-nowrap">Delete?</span>
                                                 <button
                                                     onClick={(e) => {
                                                         e.stopPropagation();
                                                         if (vehicle._id) {
                                                             handleDelete(vehicle._id);
                                                         }
                                                     }}
                                                     disabled={deletingId === vehicle._id}
                                                     className="p-1.5 rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors"
                                                     title="Confirm Delete"
                                                 >
                                                     {deletingId === vehicle._id ? (
                                                         <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                                     ) : (
                                                         <Check className="w-3.5 h-3.5" />
                                                     )}
                                                 </button>
                                                 <button
                                                     onClick={(e) => {
                                                         e.stopPropagation();
                                                         setShowDeleteConfirm(null);
                                                     }}
                                                     className="p-1.5 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
                                                     title="Cancel"
                                                 >
                                                     <X className="w-3.5 h-3.5" />
                                                 </button>
                                             </div>
                                         ) : (
                                             <button
                                                 onClick={(e) => {
                                                     e.stopPropagation();
                                                     if (vehicle._id) {
                                                         setShowDeleteConfirm(vehicle._id);
                                                     }
                                                 }}
                                                 className="p-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors shadow-md hover:shadow-lg"
                                                 title="Delete Vehicle"
                                             >
                                                 <Trash2 className="w-4 h-4" />
                                             </button>
                                         )}
                                     </div>
                                 </div>
                             </div>
                         </td>
                     </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
            {/* Pagination Controls */}

            {totalPages > 1 && (
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                />
            )}

            {/* Rejected Vehicle Modal */}
            {selectedVehicle && (
                <RejectedVehicleModal
                    vehicle={selectedVehicle}
                    isOpen={isModalOpen}
                    onClose={handleCloseModal}
                    onReapplySuccess={handleReapplySuccess}
                />
            )}
        </div>
    );
}
export default ListVehilce
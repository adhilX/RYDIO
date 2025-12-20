import { useCallback, useEffect, useState } from 'react';
import { PlusCircle, Search, Trash2, Check, X, Eye } from 'lucide-react';
import { Spinner } from "@/components/ui/spinner";
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { getMyVehicle, updateVehicleStatus, deleteVehicle } from '@/services/user/vehicleService';
import { useSelector } from 'react-redux';
import type { RootState } from '@/store/store';
import type { Vehicle } from '@/Types/User/addVehicle/Ivehicle';
import Pagination from '@/components/Pagination';
import { toast } from 'react-hot-toast';
import RejectedVehicleModal from '@/components/user/modals/RejectedVehicleModal';
import { getUser } from '@/services/user/authService';
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
    const [vendorAccess, setVendorAccess] = useState<boolean>(true);

    // Check if user has vendor access - disable all actions if false
    const isActionsDisabled = !vendorAccess;
    const navigate = useNavigate();

    const handleDelete = useCallback(async (vehicleId: string) => {
        if (isActionsDisabled) return;
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
                const userdata = await getUser(user._id)
                if (userdata?.vendor_access === false) {
                    setVendorAccess(false)
                } else {
                    setVendorAccess(true)
                }
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
    }, [debouncedSearch, currentPage, limit, user?._id, user?.idproof_id, user?.is_verified_user, vehicles.length]);

    const handleStatusToggle = useCallback(async (vehicleId: string, currentStatus: boolean) => {
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
    }, [])

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
        <div className="w-full space-y-8 font-sans">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-white">My Vehicles</h1>
                    <p className="text-gray-400 mt-1">Manage your fleet and track status</p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                    <div className="relative flex-1 md:w-80">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search className="h-4 w-4 text-gray-400" />
                        </div>
                        <input
                            type="text"
                            placeholder="Search vehicles..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 bg-black/40 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-white/30 transition-all font-medium"
                        />
                    </div>

                    <button
                        disabled={disableAddBtn || isActionsDisabled}
                        onClick={() => navigate('/userProfile/add-vehicle')}
                        className={`flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl font-bold shadow-lg transition-all
                        ${disableAddBtn || isActionsDisabled
                                ? 'bg-white/10 text-gray-500 cursor-not-allowed'
                                : 'bg-white text-black hover:bg-gray-200 hover:scale-105 active:scale-95'
                            }`}
                        title={isActionsDisabled ? 'Vendor access required to add vehicles' : ''}
                    >
                        <PlusCircle className="w-5 h-5" />
                        <span className="whitespace-nowrap">Add Vehicle</span>
                    </button>
                </div>
            </div>

            {(disableAddBtn || isActionsDisabled) && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-red-500/10 border border-red-500/20 text-red-200 px-6 py-4 rounded-2xl flex items-start gap-3"
                >
                    <div className="p-1 bg-red-500/20 rounded-full shrink-0">
                        <X className="w-4 h-4 text-red-400" />
                    </div>
                    <div>
                        <h4 className="font-semibold text-red-400">Action Required</h4>
                        <p className="text-sm text-red-200/70 mt-1">
                            {isActionsDisabled
                                ? 'Vendor access is currently restricted. Please contact support.'
                                : 'Please submit your ID proof and wait for verification to add more vehicles.'}
                        </p>
                    </div>
                </motion.div>
            )}

            <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
                {isLoading ? (
                    <div className="flex flex-col justify-center items-center h-96">
                        <Spinner size="xl" className="border-white border-t-transparent opacity-50" />
                        <span className="mt-4 text-gray-400 font-medium animate-pulse">Loading fleet...</span>
                    </div>
                ) : vehicles.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-96 text-center p-8">
                        <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4">
                            <Search className="w-8 h-8 text-gray-600" />
                        </div>
                        <h3 className="text-xl font-semibold text-white">No vehicles found</h3>
                        <p className="text-gray-400 mt-2 max-w-sm">
                            Get started by adding your first vehicle to the platform.
                        </p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full">
                            <thead>
                                <tr className="bg-white/5 border-b border-white/10">
                                    <th className="px-8 py-5 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Vehicle</th>
                                    <th className="px-6 py-5 text-center text-xs font-bold text-gray-400 uppercase tracking-wider">Fuel</th>
                                    <th className="px-6 py-5 text-center text-xs font-bold text-gray-400 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-5 text-center text-xs font-bold text-gray-400 uppercase tracking-wider">Availability</th>
                                    <th className="px-8 py-5 text-right text-xs font-bold text-gray-400 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {vehicles.map((vehicle, index) => (
                                    <tr key={index} className="group hover:bg-white/5 transition-colors duration-200">
                                        <td className="px-8 py-6">
                                            <div className="flex items-center space-x-5">
                                                <div className="flex-shrink-0 w-24 h-16 rounded-xl overflow-hidden bg-white/5 border border-white/10 relative">
                                                    <img
                                                        src={IMG_URL + vehicle.image_urls[0]}
                                                        alt={vehicle.name}
                                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                                    />
                                                </div>
                                                <div>
                                                    <h3 className="text-lg font-bold text-white group-hover:text-blue-300 transition-colors">{vehicle.name}</h3>
                                                    <p className="text-sm text-gray-400 font-medium">{vehicle.brand}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-6 text-center">
                                            <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-lg text-sm font-medium text-gray-300 capitalize">
                                                {vehicle.fuel_type}
                                            </span>
                                        </td>
                                        <td className="px-6 py-6 text-center">
                                            <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide border ${vehicle.admin_approve === 'accepted' ? 'bg-green-500/10 border-green-500/20 text-green-400' :
                                                    vehicle.admin_approve === 'pending' ? 'bg-yellow-500/10 border-yellow-500/20 text-yellow-400' :
                                                        vehicle.admin_approve === 'rejected' ? 'bg-red-500/10 border-red-500/20 text-red-400' :
                                                            'bg-blue-500/10 border-blue-500/20 text-blue-400'
                                                }`}>
                                                <span className={`w-1.5 h-1.5 rounded-full ${vehicle.admin_approve === 'accepted' ? 'bg-green-400' :
                                                        vehicle.admin_approve === 'pending' ? 'bg-yellow-400' :
                                                            vehicle.admin_approve === 'rejected' ? 'bg-red-400' :
                                                                'bg-blue-400'
                                                    }`}></span>
                                                {vehicle.admin_approve}
                                            </span>
                                        </td>
                                        <td className="px-6 py-6 text-center">
                                            <button
                                                onClick={() => {
                                                    if (!isActionsDisabled) {
                                                        handleStatusToggle(vehicle._id!, !!vehicle.is_available);
                                                    }
                                                }}
                                                disabled={updatingStatus[vehicle._id!] || isActionsDisabled}
                                                className={`relative inline-flex items-center h-8 w-14 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black focus:ring-white/50 ${isActionsDisabled ? 'bg-white/10 opacity-50 cursor-not-allowed' :
                                                        vehicle.is_available ? 'bg-white shadow-[0_0_15px_rgba(255,255,255,0.4)]' : 'bg-white/20'
                                                    }`}
                                            >
                                                <span
                                                    className={`inline-block w-6 h-6 transform transition-transform duration-300 bg-black rounded-full shadow-lg ml-1 ${vehicle.is_available ? 'translate-x-6 bg-black' : 'translate-x-0 bg-black/50'
                                                        }`}
                                                />
                                            </button>
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                {/* View button for rejected vehicles */}
                                                {vehicle.admin_approve === 'rejected' && (
                                                    <button
                                                        onClick={() => !isActionsDisabled && handleViewRejectedVehicle(vehicle)}
                                                        disabled={isActionsDisabled}
                                                        className="p-2.5 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 hover:bg-blue-500/20 transition-all hover:scale-110"
                                                        title="View Details & Reapply"
                                                    >
                                                        <Eye className="w-4 h-4" />
                                                    </button>
                                                )}

                                                <div className="relative">
                                                    {showDeleteConfirm === vehicle._id ? (
                                                        <motion.div
                                                            initial={{ opacity: 0, scale: 0.9, x: 10 }}
                                                            animate={{ opacity: 1, scale: 1, x: 0 }}
                                                            className="flex items-center bg-black border border-white/20 rounded-xl p-1 shadow-2xl absolute right-0 -top-1 z-10"
                                                        >
                                                            <button
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    if (vehicle._id) handleDelete(vehicle._id);
                                                                }}
                                                                disabled={deletingId === vehicle._id}
                                                                className="p-2 rounded-lg bg-red-500 text-white hover:bg-red-600 mr-1"
                                                            >
                                                                {deletingId === vehicle._id ? (
                                                                    <Spinner size="sm" className="border-white" />
                                                                ) : (
                                                                    <Check className="w-3.5 h-3.5" />
                                                                )}
                                                            </button>
                                                            <button
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    setShowDeleteConfirm(null);
                                                                }}
                                                                className="p-2 rounded-lg bg-white/10 text-white hover:bg-white/20"
                                                            >
                                                                <X className="w-3.5 h-3.5" />
                                                            </button>
                                                        </motion.div>
                                                    ) : (
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                if (vehicle._id && !isActionsDisabled) {
                                                                    setShowDeleteConfirm(vehicle._id);
                                                                }
                                                            }}
                                                            disabled={isActionsDisabled}
                                                            className={`p-2.5 rounded-xl bg-white/5 border border-white/10 text-gray-400 hover:text-red-400 hover:bg-red-500/10 hover:border-red-500/20 transition-all hover:scale-110 ${isActionsDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                                                            title="Delete Vehicle"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {(disableAddBtn || isActionsDisabled) && <div className="h-8" />}
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
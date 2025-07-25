import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, CheckCircle, Phone, User, XCircle } from 'lucide-react';
import type { Iuser } from '@/Types/User/Iuser';
import type { IVerificationRequest } from '@/Types/User/UpdateProfile/IdVeificationType';
import { actionIdProof } from '@/services/admin/idProofService';
import toast from 'react-hot-toast';
const IMG_URL = import.meta.env.VITE_IMAGE_URL
interface IdProofDetailsProps {
    selectedRequest: Iuser & { idproof_id: IVerificationRequest };
    onBack: () => void;
    formatDate: (dateString: string) => string;
    getStatusBadge: (status: string) => React.ReactNode;
}

function IdProofDetails({
    selectedRequest,
    onBack,
    formatDate,
    getStatusBadge
}: IdProofDetailsProps) {

    const approveId = async (id: string,owner_id:string) => {
        try {
            const response = await actionIdProof(id, owner_id,'approved')
            if (response) toast.success('id Accpted')
        } catch (error) {
            console.error(error);
            toast.error('Failed to accept idProof');
        }
    }
        
    const rejectId = async (id: string,owner_id:string) => {
        try {
            const response = await actionIdProof(id,owner_id, 'rejected')
            if (response) toast.success('id Reject')
        } catch (error) {
            console.error(error);
            toast.error('Failed to reject idProof');
        }
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className=" bg-black text-white p-4 sm:p-6"
        >
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6">
            <button
                onClick={onBack}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors cursor-pointer"
            >
                <ArrowLeft size={20} />
                Back to List
            </button>
            <h1 className="text-xl sm:text-2xl font-bold">ID Proof Verification Details</h1>
            </div>
            {/* Detail Card */}
            <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="bg-gray-900/50 backdrop-blur-sm rounded-2xl border border-gray-800 p-4 sm:p-6"
            >
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 lg:gap-8">
                {/* User Information */}
                <div className="space-y-6">
                <div className="flex flex-col sm:flex-row items-center gap-4">
                    <div className="w-20 h-20 sm:w-16 sm:h-16 bg-red-600 rounded-full flex items-center justify-center overflow-hidden">
                    {selectedRequest.profile_image ? (
                        <img
                        src={IMG_URL+selectedRequest.profile_image}
                        alt="Profile"
                        className="w-full h-full object-cover"
                        />
                    ) : (
                        <User size={24} />
                    )}
                    </div>
                    <div className="text-center sm:text-left">
                    <h2 className="text-lg sm:text-xl font-semibold">{selectedRequest.name}</h2>
                    <p className="text-gray-400 text-sm break-all">{selectedRequest.email}</p>
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="flex items-center gap-3">
                    <Phone size={18} className="text-red-500" />
                    <span className="break-all">{selectedRequest.phone}</span>
                    </div>
                    <div className="flex items-center gap-3">
                    <Calendar size={18} className="text-red-500" />
                    <span className="break-all">Submitted: {selectedRequest.idproof_id.createdAt ? formatDate(String(selectedRequest.idproof_id.createdAt)) : 'N/A'}</span>
                    </div>
                    <div className="flex items-center gap-3">
                    <Calendar size={18} className="text-red-500" />
                    <span className="break-all">Last Updated: {selectedRequest.idproof_id.updatedAt ? formatDate(String(selectedRequest.idproof_id.updatedAt)) : 'N/A'}</span>
                    </div>
                </div>

                <div className="space-y-3">
                    <h3 className="text-base sm:text-lg font-semibold">Document Information</h3>
                    <div className="bg-gray-800/50 rounded-lg p-4 space-y-2 text-sm">
                    <div className="flex justify-between flex-wrap gap-2">
                        <span className="text-gray-400">Status:</span>
                        {getStatusBadge(selectedRequest.idproof_id.status)}
                    </div>
                    {selectedRequest.idproof_id.reason && (
                        <div className="flex justify-between flex-wrap gap-2">
                        <span className="text-gray-400">Reason:</span>
                        <span className="break-all">{selectedRequest.idproof_id.reason}</span>
                        </div>
                    )}
                    </div>
                </div>

                <div className="space-y-3">
                    <h3 className="text-base sm:text-lg font-semibold">User Information</h3>
                    <div className="bg-gray-800/50 rounded-lg p-4 space-y-2 text-sm">
                   
                    <div className="flex justify-between flex-wrap gap-2">
                        <span className="text-gray-400">Vendor Access:</span>
                        <span>{selectedRequest.vendor_access ? 'Yes' : 'No'}</span>
                    </div>
                    <div className="flex justify-between flex-wrap gap-2">
                        <span className="text-gray-400">Verified User:</span>
                        <span>{selectedRequest.is_verified_user ? 'Yes' : 'No'}</span>
                    </div>
                    <div className="flex justify-between flex-wrap gap-2">
                        <span className="text-gray-400">status</span>
                        <span>{selectedRequest.is_blocked ? 'blocked' : 'active'}</span>
                    </div>
                    </div>
                </div>
                </div>

                {/* Document Image */}
                <div className="space-y-4">
                <h3 className="text-base sm:text-lg font-semibold">Document Image</h3>
                <div className="bg-gray-800/50 rounded-lg p-4 flex justify-center items-center">
                    <img
                    src={IMG_URL+selectedRequest.idproof_id.idProofUrl}
                    alt="ID Proof Document"
                    className="w-full max-w-xs sm:max-w-sm md:max-w-md h-48 sm:h-64 object-cover rounded-lg mx-auto"
                    />
                </div>

                {/* Action Buttons */}
                {selectedRequest.idproof_id.status === 'pending' && selectedRequest.idproof_id._id && (
                  <div className="flex flex-col sm:flex-row gap-4">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => approveId(selectedRequest.idproof_id._id!,selectedRequest._id!)}
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-lg font-medium transition-colors"
                    >
                      <CheckCircle size={18} className="inline mr-2" />
                      Approve
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => rejectId(selectedRequest.idproof_id._id!,selectedRequest._id!)}
                      className="flex-1 bg-red-600 hover:bg-red-700 text-white py-3 px-4 rounded-lg font-medium transition-colors"
                    >
                      <XCircle size={18} className="inline mr-2" />
                      Reject
                    </motion.button>
                  </div>
                )}
                </div>
            </div>
            </motion.div>
        </motion.div>
    );
}

export default IdProofDetails;
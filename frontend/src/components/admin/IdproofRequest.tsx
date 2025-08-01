import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Eye, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Search, 
  User,
  Calendar,
  FileText,
  Loader2
} from 'lucide-react';
import { getIdProof } from '@/services/admin/idProofService';
import IdProofDetails from './modal/IdProofDetails';
import type { Iuser } from '@/Types/User/Iuser';
import type { IVerificationRequest } from '@/Types/User/UpdateProfile/IdVeificationType';
import Pagination from '../Pagination';

const IMG_URL = import.meta.env.VITE_IMAGE_URL
const IdproofRequest: React.FC = () => {
  const [selectedRequest, setSelectedRequest] = useState<Iuser & { idproof_id: IVerificationRequest } | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter]= useState<string>('pending');
  const [currentPage, setCurrentPage] = useState(1);
  const [idProofRequests, setIdProofRequests] = useState<(Iuser & { idproof_id: IVerificationRequest })[]>([]);
  const [loading, setLoading] = useState(true);
  const [total,setTotal]= useState(0)
  const [error, setError] = useState<string | null>(null);
  const itemsPerPage = 6;
  const totalPage =total/itemsPerPage

const handleBackToList = React.useCallback(() => {
  setSelectedRequest(null);
}, []);

  useEffect(() => {
    const fetchIdProofRequests = async () => {
      try {
        setLoading(true);
        setError(null);
        const {idproofs,total} = await getIdProof(statusFilter,currentPage,itemsPerPage);
        setIdProofRequests(idproofs || []);
        setTotal(total)
      } catch (err) {
        console.error('Error fetching ID proof requests:', err);
        setError('Failed to fetch ID proof requests. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    fetchIdProofRequests();
  }, [statusFilter,currentPage,selectedRequest]);

  // Responsive status badge
  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30', icon: Clock },
      approved: { color: 'bg-green-500/20 text-green-400 border-green-500/30', icon: CheckCircle },
      rejected: { color: 'bg-red-500/20 text-red-400 border-red-500/30', icon: XCircle }
    };
    const config = statusConfig[status as keyof typeof statusConfig];
    const Icon = config.icon;
    return (
      <div className={`flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-0.5 sm:py-1 rounded-full border ${config.color} min-w-0 max-w-[140px] flex-shrink`}>
        <Icon size={12} className="flex-shrink-0" />
        <span className="text-xs sm:text-sm font-medium capitalize">{status}</span>
      </div>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };


  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white p-4 sm:p-6 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-red-500" />
          <p className="text-gray-400">Loading ID proof requests...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-black text-white p-4 sm:p-6 flex items-center justify-center">
        <div className="text-center">
          <FileText className="w-12 h-12 mx-auto mb-4 text-red-500" />
          <h3 className="text-xl font-semibold mb-2">Error Loading Data</h3>
          <p className="text-gray-400 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

return (
    <div className="min-h-screen w-full z-0 bg-black text-white p-2 sm:p-4 md:p-6 relative">
        {selectedRequest ?(
            <IdProofDetails 
                selectedRequest={selectedRequest}
                onBack={handleBackToList}
                formatDate={formatDate}
                getStatusBadge={getStatusBadge}
            />
        )
        :  
      (  <>
        <div className="mb-4 sm:mb-6 md:mb-8">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold mb-1 sm:mb-2">ID Proof Verification</h1>
            <p className="text-gray-400 text-xs sm:text-sm md:text-base">Manage and verify user identity documents</p>
        </div>
        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 md:gap-4 mb-4 sm:mb-6">
            <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <input
                    type="text"
                    placeholder="Search by name, email, or document ID..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 sm:py-2.5 md:py-3 bg-gray-900/50 border border-gray-800 rounded-lg focus:outline-none focus:border-red-500 transition-colors text-xs sm:text-sm md:text-base"
                />
            </div>
            <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 sm:px-4 py-2 sm:py-2.5 md:py-3 bg-gray-900/50 border border-gray-800 rounded-lg focus:outline-none focus:border-red-500 transition-colors text-xs sm:text-sm md:text-base"
            >
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
            </select>
        </div>
        {/* Stats Cards */}
        {/* <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-2 sm:gap-4 md:gap-6 mb-4 sm:mb-6 md:mb-8">
            {[
                { label: 'Total Requests', value: idProofRequests.length, color: 'bg-blue-500/20 border-blue-500/30' },
                { label: 'Pending', value: idProofRequests.filter(r => r.idproof_id?.status === 'pending').length, color: 'bg-yellow-500/20 border-yellow-500/30' },
                { label: 'Approved', value: idProofRequests.filter(r => r.idproof_id?.status === 'approved').length, color: 'bg-green-500/20 border-green-500/30' }
            ].map((stat, index) => (
                <motion.div
                    key={stat.label}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className={`p-3 sm:p-4 md:p-6 rounded-2xl border ${stat.color} backdrop-blur-sm`}
                >
                    <h3 className="text-gray-400 text-xs sm:text-sm font-medium">{stat.label}</h3>
                    <p className="text-lg sm:text-xl md:text-2xl font-bold mt-1 sm:mt-2">{stat.value}</p>
                </motion.div>
            ))}
        </div> */}
        {/* Requests Grid */}
        <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-2 sm:gap-4 md:gap-6 mb-4 sm:mb-6 md:mb-8">
            <AnimatePresence>
                {idProofRequests.map((request, index) => (
                    <motion.div
                        key={request._id}
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -20, opacity: 0 }}
                        transition={{ delay: index * 0.1 }}
                        whileHover={{ y: -5 }}
                        className="bg-gray-900/50 backdrop-blur-sm rounded-2xl border border-gray-800 p-3 sm:p-4 md:p-6 hover:border-red-500/50 transition-all duration-300 flex flex-col"
                    >
                        <div className="flex items-center gap-2 sm:gap-3 mb-1 sm:mb-2">
                            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-red-600 rounded-full flex items-center justify-center overflow-hidden">
                                {request.profile_image ? (
                                    <img 
                                        src={IMG_URL+request.profile_image} 
                                        alt="Profile" 
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <User size={16} className="sm:w-[18px] sm:h-[18px]" />
                                )}
                            </div>
                            <div className="min-w-0 flex-1">
                                <h3 className="font-semibold text-xs sm:text-sm md:text-base truncate">{request.name}</h3>
                                <p className="text-xs sm:text-sm text-gray-400 truncate">{request.email}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm mb-1 sm:mb-2">
                            <Calendar size={12} className="sm:w-[14px] sm:h-[14px] text-red-500" />
                            <span className="truncate">Requested: {request.idproof_id.createdAt ? formatDate(String(request.idproof_id.createdAt)) : 'N/A'}</span>
                        </div>
                        <div className="flex justify-end mt-1 sm:mt-2 mb-2 sm:mb-4">
                            {getStatusBadge(request.idproof_id.status)}
                        </div>
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => setSelectedRequest(request)}
                            className="w-full bg-red-600 hover:bg-red-700 text-white py-2 px-2 sm:px-3 md:px-4 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 text-xs sm:text-sm md:text-base"
                        >
                            <Eye size={14} className="sm:w-4 sm:h-4" />
                            View Details
                        </motion.button>
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
        {/* Empty State */}
        {idProofRequests.length === 0 && (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-8 sm:py-12"
            >
                <FileText size={48} className="sm:size-64 mx-auto text-gray-600 mb-2 sm:mb-4" />
                <h3 className="text-lg sm:text-xl font-semibold mb-1 sm:mb-2">No ID proof found</h3>
                <p className="text-gray-400 text-xs sm:text-sm">Try adjusting your search or filter criteria</p>
            </motion.div>
        )}

        {totalPage>1&& <Pagination currentPage={currentPage} totalPages={totalPage} onPageChange={setCurrentPage}/>
}
     </>)}
    </div>
)
};

export default IdproofRequest;

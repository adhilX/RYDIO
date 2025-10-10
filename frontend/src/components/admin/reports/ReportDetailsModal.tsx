import React, { useState } from 'react';
import { Flag,User,Car,Clock, CheckCircle,XCircle,AlertTriangle,Mail, CreditCard, Ban, Trash2, MessageSquareWarning } from 'lucide-react';
import { toast } from 'react-hot-toast';
import type { AdminReportData } from '@/services/admin/reportService';
import ReasonModal from '@/components/modal/ReasonModal';
import { HandleVendorAccess } from '@/services/admin/UserManagmentService';
import { sendWarningNotification } from '@/services/admin/notificationService';
import { handleVehicle } from '@/services/admin/vehicleSevice';

const IMG_URL = import.meta.env.VITE_IMAGE_URL;


interface ReportDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  report: AdminReportData;
  onStatusUpdate: (reportId: string, status: string) => void;
}

const ReportDetailsModal: React.FC<ReportDetailsModalProps> = ({
  isOpen,
  onClose,
  report,
  onStatusUpdate
}) => {
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [reasonModal, setReasonModal] = useState<{
    isOpen: boolean;
    type: 'reject' | 'removeVendor' | 'warning' | null;
    title: string;
    description: string;
    submitText: string;
  }>({
    isOpen: false,
    type: null,
    title: '',
    description: '',
    submitText: ''
  });




  const statusConfig = {
    'Pending': { style: 'bg-yellow-400/20 text-yellow-400 border-yellow-400/30', icon: Clock },
    'In Review': { style: 'bg-blue-400/20 text-blue-400 border-blue-400/30', icon: AlertTriangle },
    'Resolved': { style: 'bg-green-400/20 text-green-400 border-green-400/30', icon: CheckCircle },
    'Dismissed': { style: 'bg-gray-400/20 text-gray-400 border-gray-400/30', icon: XCircle }
  };
  const config = statusConfig[report.status] || statusConfig['Pending'];

  const handleStatusUpdate = async (newStatus: string) => {
    setUpdatingStatus(true);
    
       onStatusUpdate(report._id, newStatus);
    
    
  };

  const openReasonModal = (type: 'reject' | 'removeVendor' | 'warning') => {
    const modalConfig = {
      reject: {
        title: 'Reject Vehicle',
        description: 'Please provide a reason for rejecting this vehicle.',
        submitText: 'Reject Vehicle'
      },
      removeVendor: {
        title: 'Remove Vendor Access',
        description: 'Please provide a reason for removing vendor access.',
        submitText: 'Remove Access'
      },
      warning: {
        title: 'Send Warning',
        description: 'Please provide a warning message to send to the user.',
        submitText: 'Send Warning'
      }
    };

    const config = modalConfig[type];
    setReasonModal({
      isOpen: true,
      type,
      title: config.title,
      description: config.description,
      submitText: config.submitText
    });
  };

  const closeReasonModal = () => {
    setReasonModal({
      isOpen: false,
      type: null,
      title: '',
      description: '',
      submitText: ''
    });
  };

  const handleReasonSubmit = async (reason: string) => {
    if (!reasonModal.type) return;

    setIsProcessing(true);
    try {
      switch (reasonModal.type) {
        case 'reject':
          if (report.booking?.vehicle?._id) {
            await handleVehicle(report.booking.vehicle._id, 'rejected', reason);
            toast.success('Vehicle rejected successfully');
            
          }
          break;
        case 'removeVendor':
          if (report.owner?._id) {
            await HandleVendorAccess(report.owner._id, true);
            toast.success('Vendor access removed successfully');
          }
          break;
        case 'warning':
          if (report.reporter?._id) {
            await sendWarningNotification({
              userId: report.owner?._id!,
              message: reason,
              type: 'warning'
            });
            toast.success('Warning sent successfully');
          }
          break;
      }
      closeReasonModal();
    } catch (error) {
      toast.error(`Failed to ${reasonModal.type === 'reject' ? 'reject vehicle' : reasonModal.type === 'removeVendor' ? 'remove vendor access' : 'send warning'}`);
    } finally {
      setIsProcessing(false);
    }
  };

console.log(report.status)

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-[80vw] max-w-7xl max-h-[90vh] overflow-y-auto bg-gradient-to-br from-red-950/90 via-gray-900 to-red-950/80 border border-red-800/30 shadow-2xl rounded-xl">
        <div className="p-6 border-b border-red-800/40">
          <h2 className="text-xl font-semibold flex items-center gap-2 text-white">
            <Flag className="w-6 h-6 text-[#e63946]" />
            Report Details
          </h2>
        </div>

        <div className="p-6 space-y-6">
          <div className="flex items-center justify-between p-4 bg-red-900/30 rounded-lg border border-red-700/40">
            <div className="flex items-center gap-3">
              <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium border ${config.style}`}>
                <config.icon className="w-4 h-4" />
                {report.status}
              </span>
              <div className="text-sm text-gray-400">
                <p>ID: {report._id}</p>
                <p>Created: {new Date(report.createdAt).toLocaleString()}</p>
              </div>
            </div>
            {report.status !== 'Resolved' && report.status !== 'Dismissed' && (
              <div className="flex gap-2">
                {report.status === 'Pending' && (
                  <button onClick={() => handleStatusUpdate('In Review')} disabled={updatingStatus} className="px-3 py-1.5 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-md disabled:opacity-50">
                    Start Review
                  </button>
                )}
                {(report.status === 'Pending' || report.status === 'In Review') && (
                  <>
                    <button onClick={() => handleStatusUpdate('Resolved')} disabled={updatingStatus} className="px-3 py-1.5 text-sm bg-green-600 hover:bg-green-700 text-white rounded-md disabled:opacity-50">
                      Resolve
                    </button>
                    <button onClick={() => handleStatusUpdate('Dismissed')} disabled={updatingStatus} className="px-3 py-1.5 text-sm border border-red-700/50 text-gray-300 hover:bg-red-900/40 rounded-md disabled:opacity-50">
                      Dismiss
                    </button>
                  </>
                )}
              </div>
            )}
          </div>

          <div className="bg-red-900/30 border border-red-700/30 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
              <Flag className="w-5 h-5 text-red-400" />
              Description
            </h3>
            <p className="text-gray-300 leading-relaxed">{report.reason}</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Reporter Information */}
            <div className="bg-gradient-to-br from-red-900/25 to-red-800/15 border border-red-700/25 rounded-xl p-6 backdrop-blur-sm">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <User className="w-5 h-5 text-red-400" />
                Reporter Information
              </h3>
              
              {/* Profile Picture */}
              <div className="flex justify-center mb-4">
                <div className="relative">
                  <img
                    src={IMG_URL+report.reporter?.profile_image || `https://ui-avatars.com/api/?name=${encodeURIComponent(report.reporter?.name || 'Unknown User')}&background=3b82f6&color=ffffff&size=80&rounded=true`}
                    alt={report.reporter?.name || 'Reporter'}
                    className="w-16 h-16 rounded-full border-2 border-blue-400/30 object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(report.reporter?.name || 'Unknown User')}&background=3b82f6&color=ffffff&size=80&rounded=true`;
                    }}
                  />
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-blue-500 rounded-full border-2 border-red-900 flex items-center justify-center">
                    <User className="w-3 h-3 text-white" />
                  </div>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <User className="w-4 h-4 text-blue-400" />
                  <div>
                    <p className="text-sm font-medium text-white">
                      {report.reporter?.name || 'Unknown User'}
                    </p>
                    <p className="text-sm text-gray-400">Name</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-green-400" />
                  <div>
                    <p className="text-sm font-medium text-white">
                      {report.reporter?.email || 'Email not available'}
                    </p>
                    <p className="text-sm text-gray-400">Email</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <CreditCard className="w-4 h-4 text-purple-400" />
                  <div>
                    <p className="text-sm font-medium text-white font-mono">
                      {report.reporterId}
                    </p>
                    <p className="text-sm text-gray-400">User ID</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Owner Information */}
            <div className="bg-gradient-to-br from-red-900/25 to-red-800/15 border border-red-700/25 rounded-xl p-6 backdrop-blur-sm">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <User className="w-5 h-5 text-orange-400" />
                Vehicle Owner
              </h3>
              
              {/* Profile Picture */}
              <div className="flex justify-center mb-4">
                <div className="relative">
                  <img
                    src={IMG_URL+report.owner?.profile_image || `https://ui-avatars.com/api/?name=${encodeURIComponent(report.owner?.name || 'Owner')}&background=f97316&color=ffffff&size=80&rounded=true`}
                    alt={report.owner?.name || 'Vehicle Owner'}
                    className="w-16 h-16 rounded-full border-2 border-orange-400/30 object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(report.owner?.name || 'Owner')}&background=f97316&color=ffffff&size=80&rounded=true`;
                    }}
                  />
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-orange-500 rounded-full border-2 border-red-900 flex items-center justify-center">
                    <Car className="w-3 h-3 text-white" />
                  </div>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <User className="w-4 h-4 text-orange-400" />
                  <div>
                    <p className="text-sm font-medium text-white">
                      {report.owner?.name || 'Owner info unavailable'}
                    </p>
                    <p className="text-sm text-gray-400">Name</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-yellow-400" />
                  <div>
                    <p className="text-sm font-medium text-white">
                      {report.owner?.email || 'Email not available'}
                    </p>
                    <p className="text-sm text-gray-400">Email</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <CreditCard className="w-4 h-4 text-pink-400" />
                  <div>
                    <p className="text-sm font-medium text-white font-mono">
                      {report.owner?._id|| 'ID not available'}
                    </p>
                    <p className="text-sm text-gray-400">Owner ID</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Booking Information */}
            <div className="bg-gradient-to-br from-red-900/25 to-red-800/15 border border-red-700/25 rounded-xl p-6 backdrop-blur-sm">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Car className="w-5 h-5 text-red-400" />
                Booking Information
              </h3>
              
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <CreditCard className="w-4 h-4 text-indigo-400" />
                  <div>
                    <p className="text-sm font-medium text-white font-mono">
                      {report.booking?.booking_id || report.bookingId}
                    </p>
                    <p className="text-sm text-gray-400">Booking ID</p>
                  </div>
                </div>
                
                {report.booking?.vehicle && (
                  <div className="bg-red-950/30 rounded-lg p-4 border border-red-800/30">
                    <h4 className="text-sm font-medium text-white mb-3 flex items-center gap-2">
                      <Car className="w-4 h-4 text-purple-400" />
                      Vehicle Details
                    </h4>
                    
                    <div className="flex items-start gap-4">
                      {/* Vehicle Image */}
                      <div className="flex-shrink-0">
                        <img
                          src={IMG_URL + report.booking.vehicle.image || `https://via.placeholder.com/80x60/374151/9CA3AF?text=No+Image`}
                          alt={report.booking.vehicle.name}
                          className="w-20 h-15 rounded-lg border border-purple-400/30 object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = `https://via.placeholder.com/80x60/374151/9CA3AF?text=No+Image`;
                          }}
                        />
                      </div>
                      
                      {/* Vehicle Info */}
                      <div className="flex-1">
                        <p className="text-sm font-medium text-white">
                          {report.booking.vehicle.name}
                        </p>
                        <p className="text-sm text-gray-400 mt-1">
                          Vehicle ID: {report.booking.vehicle._id}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="bg-red-900/30 border border-red-700/30 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
              <Clock className="w-5 h-5 text-red-400" />
              Timeline
            </h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-red-400 rounded-full mt-2"></div>
                <div>
                  <p className="text-sm font-medium text-white">Created</p>
                  <p className="text-sm text-gray-400">{new Date(report.createdAt).toLocaleString()}</p>
                </div>
              </div>
              {report.updatedAt !== report.createdAt && (
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-400 rounded-full mt-2"></div>
                  <div>
                    <p className="text-sm font-medium text-white">Updated</p>
                    <p className="text-sm text-gray-400">{new Date(report.updatedAt).toLocaleString()}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Admin Actions Section */}
 
           {(report.status == 'Pending'|| report.status == 'In Review') &&(<div className="bg-red-900/30 border border-red-700/30 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-400" />
              Admin Actions
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {/* Reject Vehicle */}
              {report.booking?.vehicle && (
                <button
                  onClick={() => openReasonModal('reject')}
                  disabled={isProcessing}
                  className="flex items-center justify-center gap-2 p-3 bg-red-600/20 hover:bg-red-600/30 border border-red-500/30 rounded-lg text-red-300 hover:text-red-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Trash2 className="w-4 h-4" />
                  <span className="text-sm font-medium">Reject Vehicle</span>
                </button>
              )}
              
              {/* Remove Vendor Access */}
              {report.owner && (
                <button
                  onClick={() => openReasonModal('removeVendor')}
                  disabled={isProcessing}
                  className="flex items-center justify-center gap-2 p-3 bg-orange-600/20 hover:bg-orange-600/30 border border-orange-500/30 rounded-lg text-orange-300 hover:text-orange-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Ban className="w-4 h-4" />
                  <span className="text-sm font-medium">Remove Vendor Access</span>
                </button>
              )}
              
              {/* Send Warning */}
              {report.reporter && (
                <button
                  onClick={() => openReasonModal('warning')}
                  disabled={isProcessing}
                  className="flex items-center justify-center gap-2 p-3 bg-yellow-600/20 hover:bg-yellow-600/30 border border-yellow-500/30 rounded-lg text-yellow-300 hover:text-yellow-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <MessageSquareWarning className="w-4 h-4" />
                  <span className="text-sm font-medium">Send Warning</span>
                </button>
              )}
            </div>
            
            {/* Warning Message */}
            <div className="mt-4 p-3 bg-yellow-900/20 border border-yellow-700/30 rounded-lg">
              <p className="text-sm text-yellow-200 flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>
                  <strong>Warning:</strong> These actions are permanent and will affect the users involved. 
                  Please ensure you have reviewed the report thoroughly before taking any action.
                </span>
              </p>
            </div>
          </div>)}

          <div className="flex justify-end gap-3 pt-4 border-t border-red-800/40">
            <button onClick={onClose} className="px-4 py-2 border border-red-700/50 text-gray-300 hover:bg-red-900/30 rounded-md">
              Close
            </button>
            {report.status === 'Pending' && (
              <button onClick={() => handleStatusUpdate('In Review')} disabled={updatingStatus} className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md disabled:opacity-50">
                {updatingStatus ? 'Updating...' : 'Start Review'}
              </button>
            )}
          </div>
        </div>
      </div>
      
      {/* Reason Modal */}
      <ReasonModal
        isOpen={reasonModal.isOpen}
        onClose={closeReasonModal}
        onSubmit={handleReasonSubmit}
        title={reasonModal.title}
        description={reasonModal.description}
        submitButtonText={reasonModal.submitText}
        placeholder={reasonModal.type === 'warning' ? 'Enter warning message...' : 'Enter reason...'}
      />
    </div>
  );
};

export default ReportDetailsModal;

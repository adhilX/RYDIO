import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Flag, Search, Filter, Eye, CheckCircle, XCircle, Clock, AlertTriangle, User, Car, X, Calendar } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { getAllReports, updateReportStatus, getReportsStats, type AdminReportData, type ReportFilters } from '@/services/admin/reportService';
import ReportDetailsModal from '@/components/admin/reports/ReportDetailsModal';
import Pagination from '@/components/Pagination';
import { Spinner } from "@/components/ui/spinner";

const IMG_URL = import.meta.env.VITE_IMAGE_URL;

const Reports: React.FC = () => {
  const [reports, setReports] = useState<AdminReportData[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<any>(null);
  const [selectedReport, setSelectedReport] = useState<AdminReportData | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Filters
  const [filters, setFilters] = useState<ReportFilters>({
    status: '',
    search: '',
    limit: 10
  });
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchReports();
    fetchStats();
  }, [filters, currentPage]);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const response = await getAllReports({ ...filters, page: currentPage });
      setReports(response.reports);
      setTotalPages(response.totalPages);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to fetch reports');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const statsData = await getReportsStats();
      setStats(statsData);
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    }
  };

  const handleStatusUpdate = async (reportId: string, newStatus: string) => {
    if (updatingStatus) return;

    setUpdatingStatus(reportId);
    try {
      await updateReportStatus(reportId, newStatus);
      setReports(prev =>
        prev.map(report =>
          report._id === reportId
            ? { ...report, status: newStatus as any }
            : report
        )
      );
      toast.success(`Report status updated to ${newStatus}`);
      // Refresh stats after status update
      fetchStats();
    } catch (error) {
      toast.error('Failed to update report status');
    } finally {
      setUpdatingStatus(null);
    }
  };

  const handleViewDetails = (report: AdminReportData) => {
    setSelectedReport(report);
    setShowDetailsModal(true);
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      status: '',
      dateFrom: '',
      dateTo: '',
      limit: 10
    });
    setCurrentPage(1);
  };

  const hasActiveFilters = Boolean(
    filters.status ||
    filters.search ||
    filters.dateFrom ||
    filters.dateTo
  );

  const handleSearch = (searchTerm: string) => {
    setFilters(prev => ({ ...prev, search: searchTerm }));
    setCurrentPage(1);
  };

  const handleFilterChange = (key: keyof ReportFilters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending': return 'bg-yellow-400/20 text-yellow-400 border-yellow-400/30';
      case 'In Review': return 'bg-blue-400/20 text-blue-400 border-blue-400/30';
      case 'Resolved': return 'bg-green-400/20 text-green-400 border-green-400/30';
      case 'Dismissed': return 'bg-gray-400/20 text-gray-400 border-gray-400/30';
      default: return 'bg-gray-400/20 text-gray-400 border-gray-400/30';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Pending': return <Clock className="w-4 h-4" />;
      case 'In Review': return <AlertTriangle className="w-4 h-4" />;
      case 'Resolved': return <CheckCircle className="w-4 h-4" />;
      case 'Dismissed': return <XCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  return (
    <motion.div className="p-6 space-y-8 min-h-screen bg-black/90"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Header */}
      <motion.div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-2">
            <Flag className="w-8 h-8 text-[#e63946]" />
            Reports Management
          </h1>
          <p className="text-gray-400 mt-1">Manage and review user reports ({stats?.total || 0} total)</p>
        </div>
      </motion.div>

      {/* Stats Cards */}
      {stats && (
        <motion.div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div className="bg-white/10 p-6 rounded-2xl text-white relative overflow-hidden hover:bg-white/15 transition-all duration-300 border border-white/10 hover:border-white/20">
            <div className="relative z-10">
              <p className="text-xs text-gray-400 font-medium tracking-wide mb-2">TOTAL REPORTS</p>
              <p className="text-3xl font-bold mb-4">{stats.total || 0}</p>
              <div className="flex items-center mb-4">
                <div className="w-2 h-2 bg-[#e63946] rounded-full mr-2"></div>
                <p className="text-xs text-gray-400">All Reports</p>
              </div>
            </div>
            <Flag className="absolute top-4 right-4 w-8 h-8 text-[#e63946] opacity-50" />
          </div>
          <div className="bg-white/10 p-6 rounded-2xl text-white relative overflow-hidden hover:bg-white/15 transition-all duration-300 border border-white/10 hover:border-white/20">
            <div className="relative z-10">
              <p className="text-xs text-gray-400 font-medium tracking-wide mb-2">PENDING</p>
              <p className="text-3xl font-bold mb-4 text-yellow-400">{stats.pending || 0}</p>
              <div className="flex items-center mb-4">
                <div className="w-2 h-2 bg-yellow-400 rounded-full mr-2"></div>
                <p className="text-xs text-gray-400">Awaiting Review</p>
              </div>
            </div>
            <Clock className="absolute top-4 right-4 w-8 h-8 text-yellow-400 opacity-60" />
          </div>
          <div className="bg-white/10 p-6 rounded-2xl text-white relative overflow-hidden hover:bg-white/15 transition-all duration-300 border border-white/10 hover:border-white/20">
            <div className="relative z-10">
              <p className="text-xs text-gray-400 font-medium tracking-wide mb-2">IN REVIEW</p>
              <p className="text-3xl font-bold mb-4 text-blue-400">{stats.inReview || 0}</p>
              <div className="flex items-center mb-4">
                <div className="w-2 h-2 bg-blue-400 rounded-full mr-2"></div>
                <p className="text-xs text-gray-400">Under Investigation</p>
              </div>
            </div>
            <AlertTriangle className="absolute top-4 right-4 w-8 h-8 text-blue-400 opacity-60" />
          </div>
          <div className="bg-white/10 p-6 rounded-2xl text-white relative overflow-hidden hover:bg-white/15 transition-all duration-300 border border-white/10 hover:border-white/20">
            <div className="relative z-10">
              <p className="text-xs text-gray-400 font-medium tracking-wide mb-2">RESOLVED</p>
              <p className="text-3xl font-bold mb-4 text-green-400">{stats.resolved || 0}</p>
              <div className="flex items-center mb-4">
                <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                <p className="text-xs text-gray-400">Completed</p>
              </div>
            </div>
            <CheckCircle className="absolute top-4 right-4 w-8 h-8 text-green-400 opacity-60" />
          </div>
        </motion.div>
      )}

      {/* Search and Filters */}
      <motion.div className="bg-black/80 backdrop-blur-xl border border-black/60 shadow-2xl p-6 rounded-xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="flex flex-col gap-6">
          {/* Search Bar */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-300" size={18} />
              <input
                type="text"
                placeholder="Search by booking ID, reporter name, or reason..."
                value={filters.search || ''}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-black/60 rounded-lg bg-transparent text-white focus:outline-none focus:ring-2 focus:ring-[#e63946] hover:border-gray-500 transition-colors"
              />
            </div>
            <div className="md:w-48">
              <select
                className="w-full px-3 py-3 border border-black/60 rounded-lg bg-transparent text-white focus:outline-none focus:ring-2 focus:ring-[#e63946] hover:border-gray-500 transition-colors"
                value={filters.status || ''}
                onChange={(e) => handleFilterChange('status', e.target.value)}
              >
                <option value="" className="bg-black text-white">All Status</option>
                <option value="Pending" className="bg-black text-white">Pending</option>
                <option value="In Review" className="bg-black text-white">In Review</option>
                <option value="Resolved" className="bg-black text-white">Resolved</option>
                <option value="Dismissed" className="bg-black text-white">Dismissed</option>
              </select>
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all duration-200 ${showFilters || hasActiveFilters
                ? 'bg-[#e63946]/20 border-[#e63946] text-[#e63946]'
                : 'border-black/60 text-gray-400 hover:border-gray-500'
                }`}
            >
              <Filter className="w-4 h-4" />
              Filters
              {hasActiveFilters && (
                <span className="ml-2 px-2 py-1 text-xs bg-[#e63946] text-white rounded-full">
                  {[filters.status, filters.search, filters.dateFrom, filters.dateTo].filter(Boolean).length}
                </span>
              )}
            </button>
          </div>

          {/* Extended Filters */}
          {showFilters && (
            <div className="mt-4 pt-4 border-t border-black/60">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Date From</label>
                  <input
                    type="date"
                    className="w-full px-3 py-2 border border-black/60 rounded-lg bg-transparent text-white focus:outline-none focus:ring-2 focus:ring-[#e63946]"
                    value={filters.dateFrom || ''}
                    onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Date To</label>
                  <input
                    type="date"
                    className="w-full px-3 py-2 border border-black/60 rounded-lg bg-transparent text-white focus:outline-none focus:ring-2 focus:ring-[#e63946]"
                    value={filters.dateTo || ''}
                    onChange={(e) => handleFilterChange('dateTo', e.target.value)}
                  />
                </div>
              </div>
              {hasActiveFilters && (
                <div className="mt-4 flex justify-end">
                  <button
                    onClick={clearFilters}
                    className="flex items-center gap-2 px-3 py-1 text-sm text-gray-400 hover:text-white transition-colors"
                  >
                    <X size={16} className="text-gray-300" />
                    Clear Filters
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </motion.div>

      {/* Reports Table */}
      <motion.div className="bg-black/80 backdrop-blur-xl border border-black/60 shadow-2xl rounded-xl overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-black/60">
            <thead className="bg-black/60">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Report Details
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Reporter
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Booking
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Owner
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-transparent divide-y divide-black/60">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center">
                    <div className="flex items-center justify-center">
                      <Spinner size="md" className="border-[#e63946] border-t-transparent" />
                      <span className="ml-2 text-gray-400">Loading reports...</span>
                    </div>
                  </td>
                </tr>
              ) : reports.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center">
                    <Flag className="mx-auto h-12 w-12 text-[#e63946]" />
                    <h3 className="mt-2 text-sm font-medium text-white">No reports found</h3>
                    <p className="mt-1 text-sm text-gray-400">No reports match your current filters.</p>
                  </td>
                </tr>
              ) : (
                reports.map((report) => (
                  <tr key={report._id} className="hover:bg-black/40 transition-colors duration-200">
                    <td className="px-6 py-5">
                      <div className="max-w-xs">
                        <p className="text-sm font-medium text-white truncate">
                          {report.reason}
                        </p>
                        <p className="text-sm text-gray-400">ID: {report._id.slice(-8)}</p>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center">
                        <div className="relative mr-3">
                          <img
                            src={IMG_URL + report.reporter?.profile_image || `https://ui-avatars.com/api/?name=${encodeURIComponent(report.reporter?.name || 'Unknown User')}&background=3b82f6&color=ffffff&size=40&rounded=true`}
                            alt={report.reporter?.name || 'Reporter'}
                            className="w-8 h-8 rounded-full border border-blue-400/30 object-cover"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(report.reporter?.name || 'Unknown User')}&background=3b82f6&color=ffffff&size=40&rounded=true`;
                            }}
                          />
                          <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-blue-500 rounded-full border border-black flex items-center justify-center">
                            <User className="w-2 h-2 text-white" />
                          </div>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-white">
                            {report.reporter?.name || 'Unknown'}
                          </p>
                          <p className="text-sm text-gray-400">
                            {report.reporter?.email || report.reporterId}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center">
                        {/* Vehicle Image */}
                        <div className="relative mr-3">
                          <img
                            src={IMG_URL + report.booking?.vehicle?.image || `https://via.placeholder.com/40x30/6366f1/ffffff?text=Car`}
                            alt={report.booking?.vehicle?.name || 'Vehicle'}
                            className="w-10 h-8 rounded border border-purple-400/30 object-cover"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = `https://via.placeholder.com/40x30/6366f1/ffffff?text=Car`;
                            }}
                          />
                          <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-purple-500 rounded-full border border-black flex items-center justify-center">
                            <Car className="w-2 h-2 text-white" />
                          </div>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-white">
                            {report.booking?.booking_id || report.bookingId}
                          </p>
                          <p className="text-sm text-gray-400">
                            {report.booking?.vehicle?.name || 'Vehicle info unavailable'}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center">
                        <div className="relative mr-3">
                          <img
                            src={IMG_URL + report.owner?.profile_image || `https://ui-avatars.com/api/?name=${encodeURIComponent(report.owner?.name || 'Owner')}&background=f97316&color=ffffff&size=40&rounded=true`}
                            alt={report.owner?.name || 'Vehicle Owner'}
                            className="w-8 h-8 rounded-full border border-orange-400/30 object-cover"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(report.owner?.name || 'Owner')}&background=f97316&color=ffffff&size=40&rounded=true`;
                            }}
                          />
                          <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-orange-500 rounded-full border border-black flex items-center justify-center">
                            <Car className="w-2 h-2 text-white" />
                          </div>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-white">
                            {report.owner?.name || 'Unknown Owner'}
                          </p>
                          <p className="text-sm text-gray-400">
                            {report.owner?.email || 'Email unavailable'}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(report.status)}`}>
                        {getStatusIcon(report.status)}
                        {report.status}
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center text-sm text-gray-400">
                        <Calendar className="w-4 h-4 mr-1 text-indigo-400" />
                        {new Date(report.createdAt).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleViewDetails(report)}
                          className="text-[#e63946] hover:text-[#e63946]/80 text-sm font-medium flex items-center gap-1 transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                          View
                        </button>

                        {report.status === 'Pending' && (
                          <select
                            className="text-sm border border-black/60 rounded px-2 py-1 bg-transparent text-white focus:outline-none focus:ring-2 focus:ring-[#e63946]"
                            value=""
                            onChange={(e) => {
                              if (e.target.value) {
                                handleStatusUpdate(report._id, e.target.value);
                              }
                            }}
                            disabled={updatingStatus === report._id}
                          >
                            <option value="" className="bg-black text-white">Update Status</option>
                            <option value="In Review" className="bg-black text-white">In Review</option>
                            <option value="Resolved" className="bg-black text-white">Resolved</option>
                            <option value="Dismissed" className="bg-black text-white">Dismissed</option>
                          </select>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        )}
      </motion.div>

      {/* Report Details Modal */}
      {selectedReport && (
        <ReportDetailsModal
          isOpen={showDetailsModal}
          onClose={() => {
            setShowDetailsModal(false);
            setSelectedReport(null);
          }}
          report={selectedReport}
          onStatusUpdate={(reportId, status) => {
            handleStatusUpdate(reportId, status);
            setShowDetailsModal(false);
            setSelectedReport(null);
          }}
        />
      )}
    </motion.div>
  );
};

export default Reports;

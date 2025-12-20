import { useEffect, useState } from 'react';
import { Car, MapPin, Search, Eye, QrCode } from 'lucide-react';
import { Spinner } from "@/components/ui/spinner";

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useSelector } from 'react-redux';
import type { RootState } from '@/store/store';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import { getIncomingBooking } from '@/services/user/incommingBookingSevice';
import Pagination from '@/components/Pagination';
import IncomingBookingDetailsModal from '@/components/modal/IncomingBookingDetailsModal';
import type { IncomingBooking } from '@/Types/User/Booking/IncomingBooking';
import QrScanner from '../QrReader';

const IMG_URL = import.meta.env.VITE_IMAGE_URL;


interface ApiResponse {
  bookings: IncomingBooking[];
  total: number;
}

function IncomingBookings() {
  const user = useSelector((state: RootState) => state.auth.user);

  const [bookings, setBookings] = useState<IncomingBooking[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'booked' | 'ongoing' | 'completed' | 'cancelled'>('all');
  const [limit] = useState(6);

  const [bookingState, setBookingState] = useState({
    currentPage: 1,
    isLoading: false,
    debouncedSearch: ''
  });

  const [selectedBooking, setSelectedBooking] = useState<IncomingBooking | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [showQrScanner, setShowQrScanner] = useState(false);

  const { currentPage } = bookingState;

  // Debounced search effect
  useEffect(() => {
    const timeout = setTimeout(() => {
      setBookingState(prev => ({
        ...prev,
        debouncedSearch: search,
        currentPage: 1
      }));
    }, 1000);
    return () => clearTimeout(timeout);
  }, [search]);

  // Fetch bookings
  useEffect(() => {
    const fetchBookings = async () => {
      if (!user?._id) return;

      setBookingState(prev => ({ ...prev, isLoading: true }));

      try {
        const response: ApiResponse = await getIncomingBooking(
          user._id,
          bookingState.debouncedSearch,
          statusFilter,
          currentPage,
          limit
        );

        setBookings(response.bookings || []);
        setTotalPages(Math.ceil((response.total || 0) / limit));
      } catch (error) {
        console.error('Error fetching incoming bookings:', error);
        toast.error('Failed to fetch bookings');
        setBookings([]);
      } finally {
        setBookingState(prev => ({ ...prev, isLoading: false }));
      }
    };

    fetchBookings();
  }, [user?._id, bookingState.debouncedSearch, statusFilter, currentPage, limit]);

  const handlePageChange = (page: number) => {
    setBookingState(prev => ({ ...prev, currentPage: page }));
  };

  const handleViewDetails = (booking: IncomingBooking) => {
    setSelectedBooking(booking);
    setIsDetailsModalOpen(true);
  };

  const handleCloseDetailsModal = () => {
    setIsDetailsModalOpen(false);
    setSelectedBooking(null);
  };

  const getStatusColor = (status: string) => {
    const statusColors = {
      'pending': 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
      'booked': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      'ongoing': 'bg-green-500/20 text-green-400 border-green-500/30',
      'completed': 'bg-gray-500/20 text-gray-400 border-gray-500/30',
      'cancelled': 'bg-red-500/20 text-red-400 border-red-500/30',
    };
    return statusColors[status as keyof typeof statusColors] || 'bg-gray-500/20 text-gray-400 border-gray-500/30';
  };



  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMM dd, yyyy');
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Invalid date';
    }
  };

  const formatTime = (dateString: string) => {
    try {
      return format(new Date(dateString), 'HH:mm');
    } catch (error) {
      console.error('Error formatting time:', error);
      return 'Invalid time';
    }
  };

  const calculateDays = (startDate: string, endDate: string) => {
    try {
      const start = new Date(startDate);
      const end = new Date(endDate);
      const diffTime = Math.abs(end.getTime() - start.getTime());
      return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    } catch (error) {
      console.error('Error calculating days:', error);
      return 0;
    }
  };

  if (bookingState.isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Spinner size="xl" variant="primary" />
      </div>
    );
  }

  if (!user) {
    return <div className="p-4 text-center">Please log in to view your incoming bookings.</div>;
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-4 md:px-8 py-4 font-sans space-y-6 min-h-screen">

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-white/10 pb-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Incoming Bookings</h1>
          <p className="text-gray-400 mt-1">Bookings received for your vehicles</p>
        </div>

        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <Button
            onClick={() => setShowQrScanner(!showQrScanner)}
            variant="outline"
            className={`w-full md:w-auto flex items-center gap-2 border-white/20 hover:bg-white/10 text-white ${showQrScanner ? 'bg-white/10' : 'bg-transparent'}`}
          >
            <QrCode className="h-4 w-4" />
            {showQrScanner ? 'Close Scanner' : 'Scan QR'}
          </Button>

          <div className="relative w-full md:w-64 group">
            <div className="absolute inset-0 bg-white/5 blur-xl -z-10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-white transition-colors" />
            <Input
              type="text"
              placeholder="Search bookings..."
              className="pl-11 w-full bg-white/5 border-white/10 text-white placeholder-gray-500 focus:ring-1 focus:ring-white/20 focus:border-white/30 rounded-xl h-10 transition-all"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* QR Scanner Section */}
      {showQrScanner && (
        <div className="mb-6 p-6 border border-white/10 rounded-3xl bg-black/40 backdrop-blur-md relative">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-white">QR Code Scanner</h3>
            <Button
              onClick={() => setShowQrScanner(false)}
              variant="ghost"
              size="sm"
              className="text-gray-400 hover:text-white hover:bg-white/10"
            >
              ✕
            </Button>
          </div>
          <div className="flex justify-center bg-black rounded-2xl overflow-hidden border border-white/10">
            <QrScanner />
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {(['all', 'booked', 'ongoing', 'completed', 'cancelled'] as const).map((status) => (
          <button
            key={status}
            onClick={() => setStatusFilter(status)}
            className={`
                px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 capitalize
                ${statusFilter === status
                ? 'bg-white text-black shadow-[0_0_10px_rgba(255,255,255,0.3)] font-bold'
                : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white border border-white/5'
              }
            `}
          >
            {status}
          </button>
        ))}
      </div>

      {bookings.length > 0 ? (
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {bookings.map((booking) => (
              <div
                key={booking._id}
                className="group relative bg-black/40 backdrop-blur-md border border-white/10 rounded-2xl overflow-hidden hover:border-white/20 transition-all duration-300 hover:shadow-2xl hover:shadow-white/5 flex flex-col"
              >
                {/* Image Section */}
                <div className="relative h-48 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent z-10 opacity-60"></div>
                  {booking.vehicle?.image_urls && booking.vehicle.image_urls.length > 0 ? (
                    <img
                      src={`${IMG_URL}${booking.vehicle.image_urls[0]}`}
                      alt={booking.vehicle.name || 'Vehicle'}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-white/5">
                      <Car className="h-12 w-12 text-white/20" />
                    </div>
                  )}

                  {/* Status Badge Over Image */}
                  <div className="absolute top-3 right-3 z-20 flex flex-col gap-2 items-end">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider backdrop-blur-md border ${getStatusColor(booking.status)}`}>
                      {booking.status}
                    </span>
                  </div>

                  {/* Car Type Badge */}
                  {booking.vehicle?.car_type && (
                    <div className="absolute top-3 left-3 z-20">
                      <span className="px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-black/60 text-white border border-white/10 backdrop-blur-md">
                        {booking.vehicle.car_type}
                      </span>
                    </div>
                  )}
                </div>

                {/* Content Section */}
                <div className="p-5 flex-1 flex flex-col">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-bold text-xl text-white line-clamp-1" title={booking.vehicle?.name}>
                        {booking.vehicle?.name || 'Unnamed Vehicle'}
                      </h3>
                      <p className="text-sm text-gray-500 font-mono mt-1">
                        {booking.vehicle?.brand} • {booking.vehicle?.registration_number}
                      </p>
                      {booking.location && (
                        <p className="text-xs text-gray-400 flex items-center gap-1.5 mt-2">
                          <MapPin className="h-3 w-3" />
                          {booking.location.city}, {booking.location.state}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Booking Details Grid */}
                  <div className="grid grid-cols-2 gap-3 mb-6 bg-white/5 rounded-xl p-3 border border-white/5">
                    <div className="space-y-1">
                      <p className="text-[10px] text-gray-500 uppercase font-bold">Start Date</p>
                      <p className="text-sm font-medium text-white">{formatDate(booking.start_date)}</p>
                      <p className="text-[10px] text-gray-400">{formatTime(booking.start_date)}</p>
                    </div>
                    <div className="space-y-1 text-right">
                      <p className="text-[10px] text-gray-500 uppercase font-bold">End Date</p>
                      <p className="text-sm font-medium text-white">{formatDate(booking.end_date)}</p>
                      <p className="text-[10px] text-gray-400">{formatTime(booking.end_date)}</p>
                    </div>
                    <div className="col-span-2 pt-2 border-t border-white/5 flex justify-between items-center">
                      <span className="text-xs text-gray-400">Duration</span>
                      <span className="text-xs font-bold text-white">{calculateDays(booking.start_date, booking.end_date)} Days</span>
                    </div>
                  </div>

                  <div className="mt-auto pt-4 border-t border-white/5 space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-400">Total Amount</span>
                      <span className="text-lg font-bold text-white">₹{booking.total_amount.toLocaleString()}</span>
                    </div>

                    {booking.finance && (
                      <div className="grid grid-cols-2 gap-2 text-xs bg-black/20 p-2 rounded-lg">
                        <div>
                          <p className="text-gray-500">Security Deposit</p>
                          <p className="font-medium text-gray-300">₹{booking.finance.security_deposit.toLocaleString()}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-gray-500">Your Earnings</p>
                          <p className="font-bold text-green-400">₹{booking.finance.owner_earnings.toLocaleString()}</p>
                        </div>
                      </div>
                    )}

                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${['paid', 'succeeded'].includes(booking.payment_status) ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
                        <span className="text-xs font-medium text-gray-400 capitalize">{booking.payment_status}</span>
                      </div>
                      <Button
                        onClick={() => handleViewDetails(booking)}
                        className="bg-white text-black hover:bg-gray-200 font-bold text-xs h-9 px-4 rounded-lg shadow-lg hover:shadow-white/20 transition-all flex items-center gap-2"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        View Details
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center pt-8">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </div>
          )}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-center border border-dashed border-white/10 rounded-3xl bg-white/5">
          <div className="w-20 h-20 bg-black rounded-full flex items-center justify-center mb-6 shadow-[0_0_20px_rgba(255,255,255,0.1)]">
            <Car className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">No incoming bookings found</h3>
          <p className="text-gray-400 max-w-sm mx-auto">
            {search || statusFilter !== 'all' ? 'Try adjusting your search or filters to find what you are looking for.' : 'You haven\'t received any bookings yet.'}
          </p>
        </div>
      )}

      {/* Booking Details Modal */}
      <IncomingBookingDetailsModal
        booking={selectedBooking}
        isOpen={isDetailsModalOpen}
        onClose={() => handleCloseDetailsModal()}
      />
    </div>
  );
}

export default IncomingBookings;
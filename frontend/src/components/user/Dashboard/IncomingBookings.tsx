import { useEffect, useState } from 'react';
import { Calendar, Car, MapPin, Search, Clock, DollarSign, User, CreditCard, Eye, QrCode } from 'lucide-react';
import { Spinner } from "@/components/ui/spinner";
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
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

  const getPaymentStatusColor = (status: string) => {
    const statusColors = {
      'pending': 'bg-yellow-500/20 text-yellow-400',
      'succeeded': 'bg-green-500/20 text-green-400',
      'failed': 'bg-red-500/20 text-red-400',
      'paid': 'bg-blue-500/20 text-blue-400',
    };
    return statusColors[status as keyof typeof statusColors] || 'bg-gray-500/20 text-gray-400';
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
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Incoming Bookings</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">Bookings received for your vehicles</p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            onClick={() => setShowQrScanner(!showQrScanner)}
            variant={showQrScanner ? "default" : "outline"}
            size="sm"
            className="flex items-center gap-2"
          >
            <QrCode className="h-4 w-4" />
            {showQrScanner ? 'Close Scanner' : 'Scan QR Code'}
          </Button>
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Search bookings..."
              className="pl-10 w-full"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* QR Scanner Section */}
      {showQrScanner && (
        <div className="mb-6 p-4 border rounded-lg bg-white dark:bg-gray-800">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">QR Code Scanner</h3>
            <Button
              onClick={() => setShowQrScanner(false)}
              variant="ghost"
              size="sm"
            >
              ✕
            </Button>
          </div>
          <div className="flex justify-center">
            <QrScanner />
          </div>
        </div>
      )}

      <div className="mb-6">
        <div className="flex items-center space-x-2 overflow-x-auto pb-2">
          {(['all', 'booked', 'ongoing', 'completed', 'cancelled'] as const).map((status) => (
            <Button
              key={status}
              variant={statusFilter === status ? 'default' : 'outline'}
              size="sm"
              onClick={() => setStatusFilter(status)}
              className="capitalize whitespace-nowrap"
            >
              {status}
            </Button>
          ))}
        </div>
      </div>

      {bookings.length > 0 ? (
        <div className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {bookings.map((booking) => (
              <Card key={booking._id} className="h-full flex flex-col overflow-hidden transition-all hover:shadow-md">
                <CardContent className="p-4 flex flex-col h-full">
                  <div className="relative aspect-video bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden mb-4">
                    {booking.vehicle?.image_urls && booking.vehicle.image_urls.length > 0 ? (
                      <img
                        src={`${IMG_URL}${booking.vehicle.image_urls[0]}`}
                        alt={booking.vehicle.name || 'Vehicle'}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-200 dark:bg-gray-700">
                        <Car className="h-12 w-12 text-gray-400" />
                      </div>
                    )}
                    {booking.vehicle?.car_type && (
                      <Badge className="absolute top-2 left-2" variant="secondary">
                        {booking.vehicle.car_type}
                      </Badge>
                    )}
                    <div className="absolute top-2 right-2 flex gap-1">
                      <Badge variant="outline" className={getStatusColor(booking.status)}>
                        {booking.status}
                      </Badge>
                    </div>
                  </div>

                  <div className="flex flex-col flex-1 space-y-3">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg">{booking.vehicle?.name || 'Unnamed Vehicle'}</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {booking.vehicle?.brand} • {booking.vehicle?.registration_number}
                        </p>
                        {booking.location && (
                          <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1 mt-1">
                            <MapPin className="h-3.5 w-3.5" />
                            {booking.location.city}, {booking.location.state}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div>
                        <p className="text-gray-500 dark:text-gray-400 flex items-center gap-1">
                          <User className="h-3 w-3" />
                          Booking ID
                        </p>
                        <p className="font-medium">{booking.booking_id}</p>
                      </div>
                      <div>
                        <p className="text-gray-500 dark:text-gray-400 flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          Duration
                        </p>
                        <p className="font-medium">
                          {calculateDays(booking.start_date, booking.end_date)} days
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500 dark:text-gray-400 flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          Start Date
                        </p>
                        <p className="font-medium">{formatDate(booking.start_date)}</p>
                        <p className="text-xs text-gray-400">{formatTime(booking.start_date)}</p>
                      </div>
                      <div>
                        <p className="text-gray-500 dark:text-gray-400 flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          End Date
                        </p>
                        <p className="font-medium">{formatDate(booking.end_date)}</p>
                        <p className="text-xs text-gray-400">{formatTime(booking.end_date)}</p>
                      </div>
                    </div>

                    <div className="border-t pt-3 mt-auto">
                      <div className="flex justify-between items-center mb-2">
                        <div className="flex items-center gap-1">
                          <DollarSign className="h-4 w-4 text-gray-500" />
                          <span className="text-sm text-gray-500 dark:text-gray-400">Total Amount</span>
                        </div>
                        <span className="font-bold text-lg">₹{booking.total_amount.toLocaleString()}</span>
                      </div>

                      {booking.finance && (
                        <div className="grid grid-cols-2 gap-2 text-xs mb-3">
                          <div>
                            <p className="text-gray-500">Security Deposit</p>
                            <p className="font-medium">₹{booking.finance.security_deposit.toLocaleString()}</p>
                          </div>
                          <div>
                            <p className="text-gray-500">Your Earnings</p>
                            <p className="font-medium text-green-600">₹{booking.finance.owner_earnings.toLocaleString()}</p>
                          </div>
                        </div>
                      )}

                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-1">
                          <CreditCard className="h-3 w-3" />
                          <Badge variant="outline" className={getPaymentStatusColor(booking.payment_status)}>
                            {booking.payment_status}
                          </Badge>
                        </div>
                        <p className="text-xs text-gray-500">
                          via {booking.payment_type}
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="bg-gray-800 border-gray-700 hover:bg-gray-700 text-white"
                      onClick={() => handleViewDetails(booking)}
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      View Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center mt-8">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-12">
          <Car className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No incoming bookings found
          </h3>
          <p className="text-gray-500 dark:text-gray-400">
            {search || statusFilter !== 'all'
              ? 'Try adjusting your search or filter criteria'
              : 'You haven\'t received any bookings yet'}
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
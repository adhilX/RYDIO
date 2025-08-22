import { useEffect, useState } from 'react';
import { Calendar, Car, MapPin, Search } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useSelector } from 'react-redux';
import type { RootState } from '@/store/store';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import BookingDetailsModal from '../../modal/BookingDetailsModal';
import { getMyBooking } from '@/services/user/bookingService';
import type { BookingStatus, PaymentStatus, IbookedData } from '@/Types/User/Booking/bookedData';
import Pagination from '@/components/Pagination';

const IMG_URL = import.meta.env.VITE_IMAGE_URL

const MyBooking = () => {
  const user = useSelector((state: RootState) => state.auth.user);

  const [bookings, setBookings] = useState<IbookedData[]>([]);
  const [totalPages, setTotalPages] = useState(1); 
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<BookingStatus | 'all'>('all');
  const [limit] = useState(6); 
  
  const [bookingState, setBookingState] = useState({
    selected: null as IbookedData | null,
    isModalOpen: false,
    currentPage: 1,
    isLoading: false,
    debouncedSearch: ''
  })
  const { currentPage } = bookingState;

    
  if (!user) {
    return <div className="p-4 text-center">Please log in to view your bookings.</div>;
  }
  // eslint-disable-next-line react-hooks/rules-of-hooks
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

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    const fetchData = async () => {
      if (!user?._id) return;
      
      try {
        setBookingState(prev => ({ ...prev, isLoading: true }));
        const response = await getMyBooking(user._id, bookingState.debouncedSearch, statusFilter, bookingState.currentPage, limit);
        setBookings(response.bookings || []);
        setTotalPages(Math.ceil((response.total || 0) / limit));
      } catch (error) {
        console.error('Failed to fetch bookings:', error);
        toast.error('An error occurred while fetching bookings');
      } finally {
        setBookingState(prev => ({ ...prev, isLoading: false }));
      }
    };
    
    fetchData();
  }, [user?._id, bookingState.debouncedSearch, statusFilter, bookingState.currentPage, limit]);


  const getStatusColor = (status: BookingStatus) => {
    const statusColors = {
      'pending': 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
      'booked': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      'ongoing': 'bg-green-500/20 text-green-400 border-green-500/30',
      'cancelled': 'bg-red-500/20 text-red-400 border-red-500/30',
      'completed': 'bg-gray-500/20 text-gray-400 border-gray-500/30',
    };
    return statusColors[status] || 'bg-gray-500/20 text-gray-400 border-gray-500/30';
  };

  const getPaymentStatusColor = (status: PaymentStatus) => {
    const statusColors = {
      'pending': 'bg-yellow-500/20 text-yellow-400',
      'succeeded': 'bg-green-500/20 text-green-400',
      'failed': 'bg-red-500/20 text-red-400',
      'paid': 'bg-blue-500/20 text-blue-400',
    };
    return statusColors[status] || 'bg-gray-500/20 text-gray-400';
  };

  const formatDate = (dateString: string | Date) => {
    try {
      const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
      return format(date, 'MMM dd, yyyy');
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Invalid date';
    }
  };

  const calculateDays = (startDate: string | Date, endDate: string | Date) => {
    try {
      const start = typeof startDate === 'string' ? new Date(startDate) : startDate;
      const end = typeof endDate === 'string' ? new Date(endDate) : endDate;
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
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return <div className="p-4 text-center">Please log in to view your bookings.</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">My Bookings</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">Manage and track your vehicle bookings</p>
        </div>
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

      <div className="mb-6">
        <div className="flex items-center space-x-2 overflow-x-auto pb-2">
          {(['all', 'pending', 'booked', 'ongoing', 'completed', 'cancelled'] as const).map((status) => (
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {bookings.map((booking) => (
                <Card key={booking._id} className="h-full flex flex-col overflow-hidden transition-all hover:shadow-md w-full max-w-sm mx-auto">
                  <CardContent className="p-3 flex flex-col h-full">
                    <div className="relative aspect-video bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden h-32">
                      {booking.vehicle?.image_urls ? (
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
                    </div>
                    <div className="mt-3 flex flex-col flex-1 space-y-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold text-lg">{booking.vehicle?.name || 'Unnamed Vehicle'}</h3>
                          {booking.vehicle?.location_id?.city && (
                            <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
                              <MapPin className="h-3.5 w-3.5" />
                              {booking.vehicle.location_id.city}
                              {booking.vehicle.location_id.state && `, ${booking.vehicle.location_id.state}`}
                            </p>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className={getStatusColor(booking.status)}>
                            {booking.status}
                          </Badge>
                          <Badge variant="outline" className={getPaymentStatusColor(booking.payment_status)}>
                            {booking.payment_status}
                          </Badge>
                        </div>
                      </div>

                      <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
                        <div>
                          <p className="text-gray-500 dark:text-gray-400">Booking ID</p>
                          <p className="font-medium">{booking._id?.substring(0, 8)}...</p>
                        </div>
                        <div>
                          <p className="text-gray-500 dark:text-gray-400">Duration</p>
                          <p className="font-medium">
                            {calculateDays(booking.start_date, booking.end_date)} days
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-500 dark:text-gray-400">Pickup</p>
                          <p className="font-medium">{formatDate(booking.start_date)}</p>
                        </div>
                        <div>
                          <p className="text-gray-500 dark:text-gray-400">Drop-off</p>
                          <p className="font-medium">{formatDate(booking.end_date)}</p>
                        </div>
                      </div>

                      <div className="mt-4 flex justify-between items-center">
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Total Amount</p>
                          <p className="text-lg font-bold">
                            ₹{booking.total_amount?.toLocaleString() || 'N/A'}
                          </p>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setBookingState(prev => ({
                              ...prev,
                              selected: booking,
                              isModalOpen: true
                            }));
                          }}
                        >
                          View Details
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
<Pagination
  currentPage={currentPage}
  totalPages={totalPages}
  onPageChange={(page) =>
    setBookingState(prev => ({
      ...prev,
      currentPage: page
    }))
  }
/>
          </div>
        ) : (
        <div className="text-center py-12">
          <div className="mx-auto w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-4">
            <Calendar className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">No bookings found</h3>
          <p className="text-gray-500 dark:text-gray-400">
            {search || statusFilter !== 'all' ? 'Try adjusting your search or filter' : 'You have no bookings yet'}
          </p>
        </div>
      )}
      
      {bookingState.selected && bookingState.isModalOpen && (
        <BookingDetailsModal
          booking={bookingState.selected}
          isOpen={bookingState.isModalOpen}
          onClose={() => setBookingState(prev => ({ ...prev, isModalOpen: false }))}
        />
      )}
    </div>
  )
}

export default MyBooking
import { useEffect, useState } from 'react';
import { Calendar, Car, MapPin, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Spinner } from "@/components/ui/spinner";
import { Input } from '@/components/ui/input';
import { useSelector } from 'react-redux';
import type { RootState } from '@/store/store';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import BookingDetailsModal from '../../modal/BookingDetailsModal';
import { getMyBooking } from '@/services/user/bookingService';
import type { BookingStatus, IbookedData } from '@/Types/User/Booking/bookedData';
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

  // const getPaymentStatusColor = (status: PaymentStatus) => {
  //   const statusColors = {
  //     'pending': 'bg-yellow-500/20 text-yellow-400',
  //     'succeeded': 'bg-green-500/20 text-green-400',
  //     'failed': 'bg-red-500/20 text-red-400',
  //     'paid': 'bg-blue-500/20 text-blue-400',
  //   };
  //   return statusColors[status] || 'bg-gray-500/20 text-gray-400';
  // };

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
        <Spinner size="xl" variant="primary" />
      </div>
    );
  }

  if (!user) {
    return <div className="p-4 text-center">Please log in to view your bookings.</div>;
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-4 md:px-8 py-4 font-sans space-y-6 min-h-screen">

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-white/10 pb-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">My Bookings</h1>
          <p className="text-gray-400 mt-1">Manage and track your vehicle bookings</p>
        </div>

        <div className="relative w-full md:w-72 group">
          <div className="absolute inset-0 bg-white/5 blur-xl -z-10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-white transition-colors" />
          <Input
            type="text"
            placeholder="Search by vehicle or ID..."
            className="pl-11 w-full bg-white/5 border-white/10 text-white placeholder-gray-500 focus:ring-1 focus:ring-white/20 focus:border-white/30 rounded-xl h-11 transition-all"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

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

      {/* Bookings Grid */}
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
                  {booking.vehicle?.image_urls ? (
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
                      {booking.vehicle?.location_id?.city && (
                        <p className="text-sm text-gray-400 flex items-center gap-1.5 mt-1">
                          <MapPin className="h-3.5 w-3.5" />
                          {booking.vehicle.location_id.city}
                        </p>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">Total</p>
                      <p className="text-lg font-bold text-white">₹{booking.total_amount?.toLocaleString()}</p>
                    </div>
                  </div>

                  {/* Check-in / Check-out Grid */}
                  <div className="grid grid-cols-2 gap-3 mb-6 bg-white/5 rounded-xl p-3 border border-white/5">
                    <div className="space-y-1">
                      <p className="text-[10px] text-gray-500 uppercase font-bold">Pick Up</p>
                      <p className="text-sm font-medium text-white">{formatDate(booking.start_date)}</p>
                    </div>
                    <div className="space-y-1 text-right">
                      <p className="text-[10px] text-gray-500 uppercase font-bold">Drop Off</p>
                      <p className="text-sm font-medium text-white">{formatDate(booking.end_date)}</p>
                    </div>
                    <div className="col-span-2 pt-2 border-t border-white/5 flex justify-between items-center">
                      <span className="text-xs text-gray-400">Duration</span>
                      <span className="text-xs font-bold text-white">{calculateDays(booking.start_date, booking.end_date)} Days</span>
                    </div>
                  </div>

                  <div className="mt-auto pt-4 border-t border-white/5 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${booking.payment_status === 'paid' || booking.payment_status === 'succeeded' ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
                      <span className="text-xs font-medium text-gray-400 capitalize">{booking.payment_status}</span>
                    </div>
                    <Button
                      onClick={() => {
                        setBookingState(prev => ({
                          ...prev,
                          selected: booking,
                          isModalOpen: true
                        }));
                      }}
                      className="bg-white text-black hover:bg-gray-200 font-bold text-xs h-9 px-4 rounded-lg shadow-lg hover:shadow-white/20 transition-all"
                    >
                      View Details
                    </Button>
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
                onPageChange={(page) =>
                  setBookingState(prev => ({ ...prev, currentPage: page }))
                }
              />
            </div>
          )}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-center border border-dashed border-white/10 rounded-3xl bg-white/5">
          <div className="w-20 h-20 bg-black rounded-full flex items-center justify-center mb-6 shadow-[0_0_20px_rgba(255,255,255,0.1)]">
            <Calendar className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">No bookings found</h3>
          <p className="text-gray-400 max-w-sm mx-auto">
            {search || statusFilter !== 'all' ? 'Try adjusting your search or filters to find what you are looking for.' : 'You haven\'t made any bookings yet. Start your journey today!'}
          </p>
          {/* {!search && statusFilter === 'all' && (
            <Button className="mt-6 bg-white text-black hover:bg-gray-200 font-bold px-8 rounded-xl shadow-lg">
              Browse Vehicles
            </Button>
          )} */}
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
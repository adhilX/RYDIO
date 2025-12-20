import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Calendar, User, AlertCircle } from 'lucide-react';
import { Spinner } from "@/components/ui/spinner";
import { getBookings } from '@/services/admin/bookingService';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import Pagination from '../Pagination';
import { toast } from 'react-hot-toast';
import type { IbookedData } from '@/Types/User/Booking/bookedData';
import AdminBookingDetails from './modal/AdminBookingDetails';


export default function BookingList() {
  const [bookings, setBookings] = useState<IbookedData[]>([]);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalBookings, setTotalBookings] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<IbookedData | null>(null);
  const limit = 5;
  const IMG_URL = import.meta.env.VITE_IMAGE_URL

  console.log(totalBookings)
  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setCurrentPage(1);
    }, 500);

    return () => clearTimeout(timer);
  }, [search]);

  // Fetch bookings
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setIsLoading(true);
        const data = await getBookings(debouncedSearch, currentPage, limit);
        setBookings(data.bookings);
        setTotalBookings(data.total);
      } catch (error) {
        console.error('Error fetching bookings:', error);
        toast.error('Failed to load bookings');
      } finally {
        setIsLoading(false);
      }
    };

    fetchBookings();
  }, [debouncedSearch, currentPage]);

  const statusMap = {
    booked: { variant: 'secondary' as const, label: 'Booked' },
    confirmed: { variant: 'default' as const, label: 'Confirmed' },
    cancelled: { variant: 'destructive' as const, label: 'Cancelled' },
    completed: { variant: 'outline' as const, label: 'Completed' },
  } as const;

  type StatusKey = keyof typeof statusMap;
  type StatusValue = typeof statusMap[StatusKey];

  const getStatusBadge = (status: string) => {
    const statusValue = (statusMap as Record<string, StatusValue>)[status] || { variant: 'outline' as const, label: status };
    return <Badge variant={statusValue.variant}>{statusValue.label}</Badge>;
  };

  const paymentStatusMap = {
    pending: { variant: 'secondary' as const, label: 'Pending' },
    paid: { variant: 'default' as const, label: 'Paid' },
    refunded: { variant: 'outline' as const, label: 'Refunded' },
    failed: { variant: 'destructive' as const, label: 'Failed' },
  } as const;

  type PaymentStatusKey = keyof typeof paymentStatusMap;
  type PaymentStatusValue = typeof paymentStatusMap[PaymentStatusKey];

  const getPaymentStatusBadge = (status: string) => {
    const statusValue = (paymentStatusMap as Record<string, PaymentStatusValue>)[status] || { variant: 'outline' as const, label: status };
    return <Badge variant={statusValue.variant} className="ml-2">{statusValue.label}</Badge>;
  };

  const getUserData = (booking: IbookedData) => {
    if (typeof booking.user._id === 'string') {
      return booking.user || { name: 'Guest User', email: 'No email provided' };
    }
    return booking.user;
  };

  const getVehicleData = (booking: IbookedData) => {
    if (typeof booking.vehicle._id === 'string') {
      return booking.vehicle || { brand: 'Unknown', name: 'Vehicle', registration_number: 'N/A' };
    }
    return booking.vehicle;
  };

  const formatDate = (dateInput: string | Date) => {
    const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
    return format(date, 'MMM dd, yyyy');
  };


  const openDetailsModal = (booking: IbookedData) => {
    setSelectedBooking(booking);
    setIsModalOpen(true);
  };

  return (
    <motion.div
      className="p-6 space-y-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Bookings</h1>
          <p className="text-gray-400">Manage and monitor all bookings</p>
        </div>
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Search bookings..."
            className="pl-10 w-full"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Spinner size="xl" className="border-red-500 border-t-transparent" />
        </div>
      ) : bookings.length === 0 ? (
        <div className="bg-gray-900/50 rounded-lg p-8 text-center">
          <AlertCircle className="h-12 w-12 text-gray-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-white">No bookings found</h3>
          <p className="text-gray-400 mt-1">
            {debouncedSearch ? 'Try a different search term' : 'There are no bookings to display'}
          </p>
        </div>
      ) : (
        <>
          <div className="bg-gray-900/50 rounded-lg overflow-hidden border border-gray-800">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-800">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Booking ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Vehicle
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Customer
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Dates
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                  {bookings.map((booking) => (
                    <tr key={booking._id} className="hover:bg-gray-800/50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-300">
                        {booking._id?.slice(-6).toUpperCase()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-10 h-10 mr-2">
                            <img src={IMG_URL + booking.vehicle?.image_urls[0]} alt="" />
                          </div>
                          <div>
                            <div className="text-sm font-medium text-white">
                              {getVehicleData(booking).brand} {getVehicleData(booking).name}
                            </div>
                            <div className="text-xs text-gray-400">
                              {getVehicleData(booking).registration_number || 'N/A'}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <User className="h-5 w-5 text-gray-400 mr-2" />
                          <div>
                            <div className="text-sm font-medium text-white">
                              {getUserData(booking).name || 'Guest User'}
                            </div>
                            <div className="text-xs text-gray-400">
                              {getUserData(booking).email || 'No email provided'}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                          <div>
                            <div>{formatDate(booking.start_date)}</div>
                            <div className="text-xs text-gray-400">to {formatDate(booking.end_date)}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                        ₹{booking.total_amount.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-col space-y-1">
                          {booking.status && getStatusBadge(booking.status)}
                          {booking.payment_status && getPaymentStatusBadge(booking.payment_status)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <Button onClick={() => openDetailsModal(booking)} variant="outline" size="sm" className="text-xs">
                          View Details
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          {isModalOpen && (
            <AdminBookingDetails
              booking={selectedBooking}
              open={isModalOpen}
              onClose={() => {
                setIsModalOpen(false);
                setSelectedBooking(null);
              }}
            />
          )}
          <div className="flex justify-center mt-4">
            <Pagination
              currentPage={currentPage}
              totalPages={Math.ceil(totalBookings / limit)}
              onPageChange={setCurrentPage}
            />
          </div>


        </>
      )}
    </motion.div>
  );
}
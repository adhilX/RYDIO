import { useEffect, useState } from 'react'
import { Calendar, Car, MapPin, Search, Filter } from 'lucide-react'
import { motion } from 'framer-motion'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { useSelector } from 'react-redux'
import type { RootState } from '@/store/store'
// import axiosInstance from '@/axios/UserInterceptors'
// import { isAxiosError } from 'axios'
import toast from 'react-hot-toast'
import Pagination from '@/components/Pagination'
import BookingDetailsModal from './modal/BookingDetailsModal'

const IMG_URL = import.meta.env.VITE_IMAGE_URL

interface Owner {
  _id: string
  name: string
  email: string
  phone: string
  profile_image: string
  is_verified_user: boolean
}

interface Location {
  _id: string
  name: string
  address: string
  city: string
  state: string
  country: string
  pincode: string
}

interface Vehicle {
  _id: string
  owner_id: Owner
  location_id: Location
  name: string
  brand: string
  registration_number: string
  fuel_type: string
  seats: number
  car_type: string
  automatic: boolean
  price_per_day: number
  image_urls: string[]
}

interface Booking {
  _id: string
  vehicle: Vehicle
  name: string
  phone: string
  address: string
  city: string
  id_proof: string
  start_date: string
  end_date: string
  total_amount: number
  payment_intent_id: string
  booking_status: 'confirmed' | 'cancelled' | 'completed' | 'active'
  createdAt: string
}

const MyBooking = () => {
  const user = useSelector((state: RootState) => state.auth.user)
  const [bookings, setBookings] = useState<Booking[]>([])
  const [totalPages, setTotalPages] = useState(1)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [limit] = useState(6)
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [debouncedSearch, setDebouncedSearch] = useState('')

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedSearch(search)
      setCurrentPage(1)
    }, 1000)
    return () => clearTimeout(timeout)
  }, [search])

  // Dummy data for testing
  const dummyBookings: Booking[] = [
    {
      _id: '67890abcdef12345',
      vehicle: {
        _id: 'vehicle1',
        owner_id: {
          _id: 'owner1',
          name: 'Rajesh Kumar',
          email: 'rajesh@example.com',
          phone: '+91 9876543210',
          profile_image: '/avatars/rajesh.jpg',
          is_verified_user: true
        },
        location_id: {
          _id: 'location1',
          name: 'MG Road Pickup Point',
          address: '123 MG Road',
          city: 'Bangalore',
          state: 'Karnataka',
          country: 'India',
          pincode: '560001'
        },
        name: 'Honda City',
        brand: 'Honda',
        registration_number: 'KA-01-AB-1234',
        fuel_type: 'petrol',
        seats: 5,
        car_type: 'sedan',
        automatic: true,
        price_per_day: 2500,
        image_urls: ['/cars/honda-city.jpg', '/cars/honda-city-2.jpg']
      },
      name: 'John Doe',
      phone: '+91 9123456789',
      address: '456 Brigade Road',
      city: 'Bangalore',
      id_proof: 'DL123456789',
      start_date: '2024-01-15T00:00:00.000Z',
      end_date: '2024-01-18T00:00:00.000Z',
      total_amount: 7500,
      payment_intent_id: 'pi_1234567890',
      booking_status: 'confirmed',
      createdAt: '2024-01-10T10:30:00.000Z'
    },
    {
      _id: '12345abcdef67890',
      vehicle: {
        _id: 'vehicle2',
        owner_id: {
          _id: 'owner2',
          name: 'Priya Sharma',
          email: 'priya@example.com',
          phone: '+91 9876543211',
          profile_image: '/avatars/priya.jpg',
          is_verified_user: true
        },
        location_id: {
          _id: 'location2',
          name: 'Electronic City Hub',
          address: '789 Electronic City',
          city: 'Bangalore',
          state: 'Karnataka',
          country: 'India',
          pincode: '560100'
        },
        name: 'Maruti Swift',
        brand: 'Maruti Suzuki',
        registration_number: 'KA-02-CD-5678',
        fuel_type: 'petrol',
        seats: 5,
        car_type: 'hatchback',
        automatic: false,
        price_per_day: 1800,
        image_urls: ['/cars/swift.jpg', '/cars/swift-2.jpg']
      },
      name: 'John Doe',
      phone: '+91 9123456789',
      address: '456 Brigade Road',
      city: 'Bangalore',
      id_proof: 'DL123456789',
      start_date: '2024-01-20T00:00:00.000Z',
      end_date: '2024-01-22T00:00:00.000Z',
      total_amount: 3600,
      payment_intent_id: 'pi_0987654321',
      booking_status: 'active',
      createdAt: '2024-01-18T14:20:00.000Z'
    },
    {
      _id: 'abcdef1234567890',
      vehicle: {
        _id: 'vehicle3',
        owner_id: {
          _id: 'owner3',
          name: 'Amit Patel',
          email: 'amit@example.com',
          phone: '+91 9876543212',
          profile_image: '/avatars/amit.jpg',
          is_verified_user: false
        },
        location_id: {
          _id: 'location3',
          name: 'Whitefield Station',
          address: '321 Whitefield Main Road',
          city: 'Bangalore',
          state: 'Karnataka',
          country: 'India',
          pincode: '560066'
        },
        name: 'Hyundai Creta',
        brand: 'Hyundai',
        registration_number: 'KA-03-EF-9012',
        fuel_type: 'diesel',
        seats: 5,
        car_type: 'suv',
        automatic: true,
        price_per_day: 3200,
        image_urls: ['/cars/creta.jpg', '/cars/creta-2.jpg']
      },
      name: 'John Doe',
      phone: '+91 9123456789',
      address: '456 Brigade Road',
      city: 'Bangalore',
      id_proof: 'DL123456789',
      start_date: '2024-01-05T00:00:00.000Z',
      end_date: '2024-01-07T00:00:00.000Z',
      total_amount: 6400,
      payment_intent_id: 'pi_1122334455',
      booking_status: 'completed',
      createdAt: '2024-01-02T09:15:00.000Z'
    },
    {
      _id: 'fedcba0987654321',
      vehicle: {
        _id: 'vehicle4',
        owner_id: {
          _id: 'owner4',
          name: 'Sneha Reddy',
          email: 'sneha@example.com',
          phone: '+91 9876543213',
          profile_image: '/avatars/sneha.jpg',
          is_verified_user: true
        },
        location_id: {
          _id: 'location4',
          name: 'Koramangala Hub',
          address: '654 Koramangala 4th Block',
          city: 'Bangalore',
          state: 'Karnataka',
          country: 'India',
          pincode: '560034'
        },
        name: 'Tata Nexon EV',
        brand: 'Tata',
        registration_number: 'KA-04-GH-3456',
        fuel_type: 'electric',
        seats: 5,
        car_type: 'suv',
        automatic: true,
        price_per_day: 2800,
        image_urls: ['/cars/nexon-ev.jpg', '/cars/nexon-ev-2.jpg']
      },
      name: 'John Doe',
      phone: '+91 9123456789',
      address: '456 Brigade Road',
      city: 'Bangalore',
      id_proof: 'DL123456789',
      start_date: '2024-02-01T00:00:00.000Z',
      end_date: '2024-02-03T00:00:00.000Z',
      total_amount: 5600,
      payment_intent_id: 'pi_5566778899',
      booking_status: 'cancelled',
      createdAt: '2024-01-28T16:45:00.000Z'
    }
  ]

  const fetchBookings = async () => {
    if (!user?._id) return
    
    try {
      setIsLoading(true)
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Filter dummy data based on search and status
      let filteredBookings = dummyBookings
      
      if (debouncedSearch) {
        filteredBookings = filteredBookings.filter(booking => 
          booking.vehicle.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
          booking._id.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
          booking.vehicle.brand.toLowerCase().includes(debouncedSearch.toLowerCase())
        )
      }
      
      if (statusFilter !== 'all') {
        filteredBookings = filteredBookings.filter(booking => 
          booking.booking_status === statusFilter
        )
      }
      
      // Simulate pagination
      const startIndex = (currentPage - 1) * limit
      const endIndex = startIndex + limit
      const paginatedBookings = filteredBookings.slice(startIndex, endIndex)
      
      setBookings(paginatedBookings)
      setTotalPages(Math.ceil(filteredBookings.length / limit))
      
    } catch (error) {
      console.error('Failed to fetch bookings:', error)
      toast.error('Failed to load bookings')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchBookings()
  }, [debouncedSearch, currentPage, statusFilter, user])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30'
      case 'active':
        return 'bg-green-500/20 text-green-400 border-green-500/30'
      case 'completed':
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30'
      case 'cancelled':
        return 'bg-red-500/20 text-red-400 border-red-500/30'
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30'
    }
  }

  const getFuelIcon = (fuel_type: string) => {
    const iconClass = "w-4 h-4"
    switch (fuel_type) {
      case "petrol":
        return <Car className={`${iconClass} text-orange-400`} />
      case "diesel":
        return <Car className={`${iconClass} text-yellow-400`} />
      case "electric":
        return <Car className={`${iconClass} text-green-400`} />
      default:
        return <Car className={`${iconClass} text-gray-400`} />
    }
  }

  const calculateDays = (startDate: string, endDate: string) => {
    const start = new Date(startDate)
    const end = new Date(endDate)
    const diffTime = Math.abs(end.getTime() - start.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  if (!user) return null

  return (
    <div className="w-full max-w-full p-4 md:p-8 font-sans overflow-hidden">
      {/* Header */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-[#232b3a] tracking-tight">My Bookings</h1>
        
        {/* Search and Filter */}
        <motion.div className="bg-black/80 backdrop-blur-xl border border-black/60 shadow-2xl p-3 rounded-xl w-full lg:w-auto min-w-0">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative min-w-0">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search by vehicle name or booking ID..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-white/40 rounded-lg bg-transparent text-white focus:outline-none focus:ring-2 focus:ring-[#6DA5C0] min-w-0"
              />
            </div>
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="pl-10 pr-4 py-2 border border-white/40 rounded-lg bg-transparent text-white focus:outline-none focus:ring-2 focus:ring-[#6DA5C0] min-w-0"
              >
                <option value="all" className="bg-gray-800">All Status</option>
                <option value="confirmed" className="bg-gray-800">Confirmed</option>
                <option value="active" className="bg-gray-800">Active</option>
                <option value="completed" className="bg-gray-800">Completed</option>
                <option value="cancelled" className="bg-gray-800">Cancelled</option>
              </select>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Loading State */}
      {isLoading ? (
        <div className="flex flex-col justify-center items-center h-64">
          <div className="w-16 h-16 border-4 border-[#6DA5C0] border-t-transparent rounded-full animate-spin"></div>
          <span className="mt-4 text-gray-600 text-lg font-semibold animate-pulse">Loading bookings...</span>
        </div>
      ) : bookings.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Calendar className="w-12 h-12 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-600 mb-2">No bookings found</h3>
          <p className="text-gray-500">You haven't made any bookings yet.</p>
        </div>
      ) : (
        <>
          {/* Bookings Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6 mb-8 w-full">
            {bookings.map((booking, index) => (
              <motion.div
                key={booking._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="bg-gray-800 border border-gray-700 shadow-lg hover:shadow-xl transition-shadow duration-300 w-full min-w-0">
                  {/* Vehicle Image */}
                  <div className="relative">
                    <img
                      src={IMG_URL + booking.vehicle.image_urls[0] || "/placeholder.svg"}
                      alt={booking.vehicle.name}
                      className="w-full h-24 object-cover rounded-t-lg"
                    />
                    <Badge className={`absolute top-2 right-2 ${getStatusColor(booking.booking_status)}`}>
                      {booking.booking_status.charAt(0).toUpperCase() + booking.booking_status.slice(1)}
                    </Badge>
                  </div>
                  
                  <CardContent className="p-3 space-y-2">
                    {/* Vehicle Name and Brand */}
                    <div>
                      <h3 className="font-bold text-white text-sm truncate" title={booking.vehicle.name}>{booking.vehicle.name}</h3>
                      <p className="text-xs text-gray-300 truncate">{booking.vehicle.brand} - {booking.vehicle.fuel_type}</p>
                      <p className="text-xs text-gray-400 truncate">{booking.vehicle.registration_number}</p>
                    </div>

                    {/* Duration and Price */}
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-xs text-gray-400">Duration</p>
                        <p className="font-medium text-white text-sm">
                          {calculateDays(booking.start_date, booking.end_date)} day{calculateDays(booking.start_date, booking.end_date) > 1 ? 's' : ''}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-gray-400">Total</p>
                        <p className="font-bold text-[#6DA5C0] text-sm">
                          ₹{booking.total_amount.toLocaleString()}
                        </p>
                      </div>
                    </div>

                    {/* Location */}
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3 h-3 text-[#6DA5C0]" />
                      <p className="text-xs text-gray-300 truncate" title={`${booking.vehicle.location_id.city}, ${booking.vehicle.location_id.state}`}>
                        {booking.vehicle.location_id.city}, {booking.vehicle.location_id.state}
                      </p>
                    </div>

                    {/* View Details Button */}
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => {
                        setSelectedBooking(booking)
                        setIsModalOpen(true)
                      }}
                      className="w-full border-[#6DA5C0] text-[#6DA5C0] hover:bg-[#6DA5C0] hover:text-white py-1 text-xs mt-2 min-w-0"
                    >
                      View Details
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </div>
          )}
        </>
      )}
      
      {/* Booking Details Modal */}
      <BookingDetailsModal 
        booking={selectedBooking}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setSelectedBooking(null)
        }}
      />
    </div>
  )
}

export default MyBooking
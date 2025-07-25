import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Car, Fuel, Users, Settings, MapPin, Phone, Mail, Badge } from "lucide-react"
import { DatePicker } from "@/components/ui/date-picker"
import { getVehicleDetails } from "@/services/user/vehicleService"
import { useLocation, useNavigate } from "react-router"
import { MapContainer, Marker, TileLayer, Popup } from "react-leaflet"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import type { Vehicle } from "@/Types/User/addVehicle/Ivehicle"
import toast from "react-hot-toast"
import { LatLng } from 'leaflet';
import Navbar from "@/components/user/Navbar"
const IMG_URL = import.meta.env.VITE_IMAGE_URL

const VehicleDetailPage = () => {
  const [vehicle, setVehicle] = useState<Vehicle | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const { pathname } = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    const fetchVehicle = async () => {
      try {
        const id = pathname.split('/')[2]
        const response = await getVehicleDetails(id)
        setVehicle(response)
      } catch (error) {
        console.error("Error fetching vehicle:", error)
        toast.error("Error fetching vehicle")
      } finally {
        setLoading(false)
      }
    }
    fetchVehicle()
  }, [pathname])

  const handleBookNow = () => {
    if (!startDate || !endDate) return toast.error("Please select both start and end dates")
    if (new Date(startDate) >= new Date(endDate)) return toast.error("End date must be after start date")

    const days = Math.ceil((new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24))
    const totalPrice = vehicle?.price_per_day ? vehicle.price_per_day * days : 0

    navigate('/booking-confirmation', { state: { bookingData: { vehicle, startDate, endDate, total_amount:totalPrice, days } } })
  }

  const getFuelIcon = (fuel_type: string) => {
    const color = { petrol: "text-orange-400", diesel: "text-yellow-400", electric: "text-green-400" }[fuel_type] || "text-gray-400"
    return <Fuel className={`w-5 h-5 ${color}`} />
  }

  const calculateTotalPrice = () => {
    if (!startDate || !endDate || !vehicle) return 0
    const days = Math.ceil((new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24))
    return vehicle.price_per_day * days
  }

  const getLocationCoordinates = (): [number, number] => {
    const [lng, lat] = vehicle?.location_id?.location?.coordinates || []
    return (typeof lat === 'number' && typeof lng === 'number') ? [lat, lng] : [20.5937, 78.9629]
  }

  if (loading) return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen flex items-center justify-center bg-gray-900"
    >
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full"
      />
    </motion.div>
  )

  if (!vehicle) return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen flex items-center justify-center text-center bg-gray-900"
    >
      <div>
        <Car className="w-20 h-20 text-gray-500 mx-auto mb-4" />
        <h2 className="text-3xl font-bold text-white mb-2">Vehicle not found</h2>
        <p className="text-gray-400">The vehicle you're looking for doesn't exist.</p>
      </div>
    </motion.div>
  )

  const totalPrice = calculateTotalPrice()
  const locationCoordinates = new LatLng(...(getLocationCoordinates()))

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gray-900 text-white"
    >
      <Navbar />
      <div className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="flex justify-between items-center mb-8"
        >
          <div>
            <h1 className="text-4xl font-extrabold text-white">{vehicle.name}</h1>
            <p className="text-xl text-gray-400">{vehicle.brand}</p>
          </div>
          {/* <Badge className={`px-4 py-2 rounded-full font-semibold ${getStatusColor(vehicle.admin_approve)}`}>
            {vehicle.admin_approve}
          </Badge> */}
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card className="mb-8 bg-gray-800/50 backdrop-blur-sm border-none shadow-lg">
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row gap-8 items-center">
                <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Start Date</label>
                    <DatePicker
                      value={startDate}
                      onChange={setStartDate}
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full bg-gray-700 text-white border-gray-600 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">End Date</label>
                    <DatePicker
                      value={endDate}
                      onChange={setEndDate}
                      min={startDate || new Date().toISOString().split('T')[0]}
                      className="w-full bg-gray-700 text-white border-gray-600 rounded-lg"
                    />
                  </div>
                </div>
                <div className="text-center">
                  {totalPrice > 0 && (
                    <motion.div
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 0.3 }}
                      className="mb-4"
                    >
                      <p className="text-sm text-gray-400">Total Price</p>
                      <p className="text-2xl font-bold text-green-400">₹{totalPrice.toLocaleString()}</p>
                    </motion.div>
                  )}
                  <Button
                    onClick={handleBookNow}
                    className="bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300"
                    size="lg"
                    disabled={!startDate || !endDate}
                  >
                    Book Now
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="lg:col-span-2"
          >
            <Card className="bg-gray-800/50 backdrop-blur-sm border-none shadow-lg">
              <CardContent className="p-0">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={selectedImageIndex}
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    transition={{ duration: 0.4 }}
                    className="relative overflow-hidden rounded-t-lg"
                  >
                    <img
                      src={IMG_URL + vehicle.image_urls?.[selectedImageIndex] || "/placeholder.svg"}
                      alt={`${vehicle.name} - Image ${selectedImageIndex + 1}`}
                      className="object-cover h-[500px] w-full transition-transform duration-500 hover:scale-105"
                    />
                    <Badge
                      className={`absolute top-4 right-4 px-3 py-1 rounded-full font-semibold ${
                        vehicle.is_available ? "bg-green-500" : "bg-red-500"
                      } text-white`}
                    >
                      {vehicle.is_available ? "Available" : "Not Available"}
                    </Badge>
                  </motion.div>
                </AnimatePresence>
                <div className="p-4 flex gap-3 overflow-x-auto">
                  {vehicle.image_urls?.map((url, index) => (
                    <motion.button
                      key={index}
                      onClick={() => setSelectedImageIndex(index)}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      className={`w-20 h-20 rounded-lg overflow-hidden border-2 ${
                        selectedImageIndex === index ? "border-blue-500" : "border-gray-600"
                      } transition-all duration-300`}
                    >
                      <img
                        src={IMG_URL + url || "/placeholder.svg"}
                        alt={`Thumbnail ${index + 1}`}
                        className="object-cover w-full h-full"
                      />
                    </motion.button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <div className="space-y-6">
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Card className="bg-gray-800/50 backdrop-blur-sm border-none shadow-lg">
                <CardContent className="p-6 text-center">
                  <div className="text-3xl font-bold text-green-400">₹{vehicle.price_per_day.toLocaleString()}</div>
                  <p className="text-gray-400">per day</p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Card className="bg-gray-800/50 backdrop-blur-sm border-none shadow-lg">
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-4 text-white">Specifications</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-3">{getFuelIcon(vehicle.fuel_type)} <span className="text-gray-300">Fuel Type</span></div>
                      <span className="capitalize text-white">{vehicle.fuel_type}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-3"><Users className="w-5 h-5 text-gray-300" /> <span className="text-gray-300">Seats</span></div>
                      <span className="text-white">{vehicle.seats}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-3"><Car className="w-5 h-5 text-gray-300" /> <span className="text-gray-300">Type</span></div>
                      <span className="capitalize text-white">{vehicle.car_type}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-3"><Settings className="w-5 h-5 text-gray-300" /> <span className="text-gray-300">Transmission</span></div>
                      <span className="text-white">{vehicle.automatic ? "Automatic" : "Manual"}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <Card className="bg-gray-800/50 backdrop-blur-sm border-none shadow-lg">
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-2 text-white">Registration</h3>
                  <p className="text-gray-300 font-mono">{vehicle.registration_number}</p>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="mt-6"
        >
          <Card className="bg-gray-800/50 backdrop-blur-sm border-none shadow-lg">
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold mb-4 text-white">Description</h3>
              <p className="text-gray-300 leading-relaxed">{vehicle.description}</p>
            </CardContent>
          </Card>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.7 }}
          >
            <Card className="bg-gray-800/50 backdrop-blur-sm border-none shadow-lg">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4 text-white">Owner Details</h3>
                {vehicle.owner_id ? (
                  <div className="flex items-start gap-4">
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      className="relative"
                    >
                      <img
                        src={IMG_URL+vehicle.owner_id.profile_image || "/placeholder.svg?height=60&width=60"}
                        alt={vehicle.owner_id.name}
                        width={60}
                        height={60}
                        className="rounded-full object-cover border-2 border-gray-600"
                      />
                    </motion.div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold text-white">{vehicle.owner_id.name}</h4>
                        {vehicle.owner_id.is_verified_user && (
                          <svg
                            fill="#000000"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                            className="icon flat-line"
                          >
                            <path
                              d="M21.37,12c0,1-.86,1.79-1.14,2.67s-.1,2.08-.65,2.83-1.73.94-2.5,1.49-1.28,1.62-2.18,1.92S13,20.65,12,20.65s-2,.55-2.9.27S7.67,19.55,6.92,19,5,18.28,4.42,17.51s-.35-1.92-.65-2.83S2.63,13,2.63,12s.86-1.8,1.14-2.68.1-2.08.65-2.83S6.15,5.56,6.92,5,8.2,3.39,9.1,3.09s1.93.27,2.9.27,2-.55,2.9-.27S16.33,4.46,17.08,5s1.94.72,2.5,1.49.35,1.92.65,2.83S21.37,11,21.37,12Z"
                              fill="#61d0ff"
                              strokeWidth={0.696}
                            />
                            <polyline
                              points="8 12 11 15 16 10"
                              fill="none"
                              stroke="#000000"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={0.696}
                            />
                            <path
                              d="M21.37,12c0,1-.86,1.79-1.14,2.67s-.1,2.08-.65,2.83-1.73.94-2.5,1.49-1.28,1.62-2.18,1.92S13,20.65,12,20.65s-2,.55-2.9.27S7.67,19.55,6.92,19,5,18.28,4.42,17.51s-.35-1.92-.65-2.83S2.63,13,2.63,12s.86-1.8,1.14-2.68.1-2.08.65-2.83S6.15,5.56,6.92,5,8.2,3.39,9.1,3.09s1.93.27,2.9.27,2-.55,2.9-.27S16.33,4.46,17.08,5s1.94.72,2.5,1.49.35,1.92.65,2.83S21.37,11,21.37,12Z"
                              fill="none"
                              stroke="#000000"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={0.696}
                            />
                          </svg>
                        )}
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm text-gray-300"><Mail className="w-5 h-5" /> {vehicle.owner_id.email}</div>
                        {vehicle.owner_id.phone && (
                          <div className="flex items-center gap-2 text-sm text-gray-300"><Phone className="w-5 h-5" /> {vehicle.owner_id.phone}</div>
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-300">Owner ID: {typeof vehicle.owner_id === 'string' ? vehicle.owner_id : 'Owner data not available'}</p>
                )}
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.8 }}
          >
            <Card className="bg-gray-800/50 backdrop-blur-sm border-none shadow-lg">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4 text-white">Location</h3>
                {vehicle?.location_id ? (
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <MapPin className="w-6 h-6 text-gray-300 mt-0.5" />
                      <div>
                        <p className="font-medium text-white">{vehicle.location_id.name}</p>
                        <p className="text-sm text-gray-300">{vehicle.location_id.address}, {vehicle.location_id.city}</p>
                        <p className="text-sm text-gray-300">{vehicle.location_id.state}, {vehicle.location_id.country} - {vehicle.location_id.pincode}</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-300">Location ID: {typeof vehicle.location_id === 'string' ? vehicle.location_id : 'Location data not available'}</p>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {vehicle.location_id && vehicle?.location_id.location?.coordinates && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.9 }}
            className="mt-6"
          >
            <Card className="bg-gray-800/50 backdrop-blur-sm border-none shadow-lg">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4 text-white">Vehicle Location</h3>
                <div className="h-[400px] rounded-lg overflow-hidden shadow-inner">
                  <MapContainer
                    center={locationCoordinates}
                    zoom={15}
                    scrollWheelZoom={false}
                    style={{ height: "100%", width: "100%" }}
                    className="rounded-lg"
                  >
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                    <Marker position={locationCoordinates}>
                      <Popup>
                        <div className="text-center">
                          <h4 className="font-semibold text-gray-800">{vehicle.name}</h4>
                          <p className="text-sm text-gray-600">{vehicle.location_id.name}</p>
                          <p className="text-xs text-gray-500">{vehicle.location_id.address}, {vehicle.location_id.city}</p>
                        </div>
                      </Popup>
                    </Marker>
                  </MapContainer>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </motion.div>
  )
}

export default VehicleDetailPage
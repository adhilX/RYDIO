import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Car, Fuel, Users, Settings, MapPin, Phone, Mail, CheckCircle, Badge } from "lucide-react"
import { DatePicker } from "@/components/ui/date-picker"
import { getVehicleDetails } from "@/services/user/vehicleService"
import { useLocation, useNavigate } from "react-router"
import { MapContainer, Marker, TileLayer, Popup } from "react-leaflet"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import type { Vehicle } from "@/Types/User/addVehicle/Ivehicle"
import toast from "react-hot-toast"
import { LatLng } from 'leaflet';

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

    navigate('/booking-confirmation', { state: { bookingData: { vehicle, startDate, endDate, totalPrice, days } } })
  }

  const getStatusColor = (status: string) => ({
    accepted: "bg-green-100 text-green-800",
    pending: "bg-yellow-100 text-yellow-800",
    rejected: "bg-red-100 text-red-800"
  }[status] || "bg-gray-100 text-gray-800")

  const getFuelIcon = (fuel_type: string) => {
    const color = { petrol: "text-orange-400", diesel: "text-yellow-400", electric: "text-green-400" }[fuel_type] || "text-gray-400"
    return <Fuel className={`w-4 h-4 ${color}`} />
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
    <div className="min-h-screen flex items-center justify-center">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full"
      />
    </div>
  )

  if (!vehicle) return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen flex items-center justify-center text-center">
      <div>
        <Car className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Vehicle not found</h2>
        <p className="text-gray-600">The vehicle you're looking for doesn't exist.</p>
      </div>
    </motion.div>
  )

  const totalPrice = calculateTotalPrice()

const locationCoordinates = new LatLng(...(getLocationCoordinates()));
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: { staggerChildren: 0.1 } }}
      className="min-h-screen bg-gray-900 text-white"
    >
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">{vehicle.name}</h1>
            <p className="text-lg text-gray-400">{vehicle.brand}</p>
          </div>
          <Badge className={getStatusColor(vehicle.admin_approve)}>{vehicle.admin_approve}</Badge>
        </div>

        <Card className="mb-8 bg-gray-800 border-none">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row gap-6 items-center">
              <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Start Date</label>
                  <DatePicker value={startDate} onChange={setStartDate} min={new Date().toISOString().split('T')[0]} className="w-full" />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">End Date</label>
                  <DatePicker value={endDate} onChange={setEndDate} min={startDate || new Date().toISOString().split('T')[0]} className="w-full" />
                </div>
              </div>
              <div className="text-center">
                {totalPrice > 0 && (
                  <div className="mb-4">
                    <p className="text-sm text-gray-400">Total Price</p>
                    <p className="text-xl font-bold text-green-400">₹{totalPrice.toLocaleString()}</p>
                  </div>
                )}
                <Button
                  onClick={handleBookNow}
                  className="bg-green-500 hover:bg-green-600"
                  size="lg"
                  disabled={!startDate || !endDate}
                >
                  Book Now
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2 bg-gray-800 border-none">
            <CardContent className="p-0">
              <AnimatePresence mode="wait">
                <motion.div
                  key={selectedImageIndex}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="relative h-80 w-full"
                >
                  <img src={vehicle.image_urls?.[selectedImageIndex] || "/placeholder.svg"} alt={`${vehicle.name} - Image ${selectedImageIndex + 1}`} className="object-cover w-full h-full" />
                  <Badge className={`absolute top-4 right-4 ${vehicle.is_available ? "bg-green-500" : "bg-red-500"}`}>
                    {vehicle.is_available ? "Available" : "Not Available"}
                  </Badge>
                </motion.div>
              </AnimatePresence>
              <div className="p-4 flex gap-2 overflow-x-auto">
                {vehicle.image_urls?.map((url, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`w-16 h-16 rounded-md overflow-hidden border-2 ${selectedImageIndex === index ? "border-blue-500" : "border-gray-600"}`}
                  >
                    <img src={url || "/placeholder.svg"} alt={`Thumbnail ${index + 1}`} className="object-cover w-full h-full" />
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card className="bg-gray-800 border-none">
              <CardContent className="p-6 text-center">
                <div className="text-2xl font-bold text-green-400">₹{vehicle.price_per_day.toLocaleString()}</div>
                <p className="text-gray-400">per day</p>
              </CardContent>
            </Card>

            <Card className="bg-gray-800 border-none">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">Specifications</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">{getFuelIcon(vehicle.fuel_type)} <span className="text-gray-400">Fuel Type</span></div>
                    <span className="capitalize">{vehicle.fuel_type}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2"><Users className="w-4 h-4" /> <span className="text-gray-400">Seats</span></div>
                    <span>{vehicle.seats}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2"><Car className="w-4 h-4" /> <span className="text-gray-400">Type</span></div>
                    <span className="capitalize">{vehicle.car_type}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2"><Settings className="w-4 h-4" /> <span className="text-gray-400">Transmission</span></div>
                    <span>{vehicle.automatic ? "Automatic" : "Manual"}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-800 border-none">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-2">Registration</h3>
                <p className="text-gray-400 font-mono">{vehicle.registration_number}</p>
              </CardContent>
            </Card>
          </div>
        </div>

        <Card className="mt-6 bg-gray-800 border-none">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-4">Description</h3>
            <p className="text-gray-400">{vehicle.description}</p>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <Card className="bg-gray-800 border-none">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4">Owner Details</h3>
              {vehicle.owner_id ? (
                <div className="flex items-start gap-4">
                  <div className="relative">
                    <img src={vehicle.owner_id.profile_image || "/placeholder.svg?height=60&width=60"} alt={vehicle.owner_id.name} width={60} height={60} className="rounded-full object-cover" />
                    {vehicle.owner_id.is_verified_user && <CheckCircle className="absolute -bottom-1 -right-1 w-5 h-5 text-green-500 bg-white rounded-full" />}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold">{vehicle.owner_id.name}</h4>
                      {vehicle.owner_id.is_verified_user && <Badge className="text-xs">Verified</Badge>}
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-gray-400"><Mail className="w-4 h-4" /> {vehicle.owner_id.email}</div>
                      {vehicle.owner_id.phone && <div className="flex items-center gap-2 text-sm text-gray-400"><Phone className="w-4 h-4" /> {vehicle.owner_id.phone}</div>}
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-gray-400">Owner ID: {typeof vehicle.owner_id === 'string' ? vehicle.owner_id : 'Owner data not available'}</p>
              )}
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-none">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4">Location</h3>
              {vehicle?.location_id ? (
                <div className="space-y-3">
                  <div className="flex items-start gap-2">
                    <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                    <div>
                      <p className="font-medium">{vehicle.location_id.name}</p>
                      <p className="text-sm text-gray-400">{vehicle.location_id.address}, {vehicle.location_id.city}</p>
                      <p className="text-sm text-gray-400">{vehicle.location_id.state}, {vehicle.location_id.country} - {vehicle.location_id.pincode}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-gray-400">Location ID: {typeof vehicle.location_id === 'string' ? vehicle.location_id : 'Location data not available'}</p>
              )}
            </CardContent>
          </Card>
        </div>

        {vehicle.location_id! && vehicle?.location_id.location?.coordinates && (
          <Card className="mt-6 bg-gray-800 border-none">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4">Vehicle Location</h3>
              <div className="h-80 rounded-lg overflow-hidden">
                <MapContainer center={locationCoordinates} zoom={15} scrollWheelZoom={false} style={{ height: "100%", width: "100%" }} className="rounded-lg">
                  <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                  <Marker position={locationCoordinates}>
                    <Popup>
                      <div className="text-center">
                        <h4 className="font-semibold">{vehicle.name}</h4>
                        <p className="text-sm text-gray-600">{vehicle.location_id.name}</p>
                        <p className="text-xs text-gray-500">{vehicle.location_id.address}, {vehicle.location_id.city}</p>
                      </div>
                    </Popup>
                  </Marker>
                </MapContainer>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </motion.div>
  )
}

export default VehicleDetailPage
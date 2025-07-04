import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
 import { Car, Fuel, Users, Settings, MapPin, Phone, Mail, CheckCircle, Calendar, Clock } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { getVehicleDetails } from "@/services/user/vehicleService"
import { useLocation } from "react-router"

interface Vehicle {
  _id: string
  name: string
  brand: string
  registration_number: string
  fuel_type: "petrol" | "diesel" | "electric"
  seats: 2 | 4 | 5 | 7
  car_type: "sedan" | "hateback" | "xuv" | "suv" | "sports"
  automatic: boolean
  price_per_day: number
  description: string
  admin_approve: "pending" | "accepted" | "rejected"
  image_urls: string[]
  is_available: boolean
  createdAt: string
  updatedAt: string
  owner_id: User
  location_id: Location
}

interface User {
  _id: string
  name: string
  email: string
  phone?: string
  profile_image?: string
  is_verified_user?: boolean
}

interface Location {
  _id: string
  name: string
  address: string
  city: string
  state: string
  country: string
  pincode: string
  location: {
    coordinates: [number, number]
  }
}

const VehicleDetailPage = () => {
  const [vehicle, setVehicle] = useState<Vehicle | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const {pathname}= useLocation()

  useEffect(() => {
    const fetchVehicle = async () => {
      try {
        const id = pathname.split('/')
     const response = await getVehicleDetails(id[2])
        setVehicle(response)
      } catch (error) {
        console.error("Error fetching vehicle:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchVehicle()
  }, [])

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  }

  const imageVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.3,
      },
    },
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
          className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full"
        />
      </div>
    )
  }

  if (!vehicle) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen flex items-center justify-center"
      >
        <div className="text-center">
          <Car className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Vehicle not found</h2>
          <p className="text-gray-600">The vehicle you're looking for doesn't exist.</p>
        </div>
      </motion.div>
    )
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "accepted":
        return "bg-green-100 text-green-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "rejected":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getFuelIcon = (fuel_type: string) => {
    return <Fuel className="w-4 h-4" />
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div variants={itemVariants} className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">{vehicle.name}</h1>
              <p className="text-xl text-gray-300">{vehicle.brand}</p>
            </div>
            <Badge className={getStatusColor(vehicle.admin_approve)}>{vehicle.admin_approve}</Badge>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Image Gallery */}
          <motion.div variants={itemVariants} className="lg:col-span-2">
            <Card className="overflow-hidden bg-gray-900 border-gray-800">
              <CardContent className="p-0">
                <div className="relative">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={selectedImageIndex}
                      variants={imageVariants}
                      initial="hidden"
                      animate="visible"
                      exit="hidden"
                      className="relative h-96 w-full"
                    >
                      <img
                        src={vehicle.image_urls[selectedImageIndex] || "/placeholder.svg"}
                        alt={`${vehicle.name} - Image ${selectedImageIndex + 1}`}
                        className="object-cover"
                      />
                    </motion.div>
                  </AnimatePresence>

                  {/* Availability Badge */}
                  <div className="absolute top-4 right-4">
                    <Badge className={vehicle.is_available ? "bg-green-500" : "bg-red-500"}>
                      {vehicle.is_available ? "Available" : "Not Available"}
                    </Badge>
                  </div>
                </div>

                {/* Thumbnail Gallery */}
                <div className="p-4">
                  <div className="flex gap-2 overflow-x-auto">
                    {vehicle.image_urls.map((url, index) => (
                      <motion.button
                        key={index}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setSelectedImageIndex(index)}
                        className={`relative flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                          selectedImageIndex === index ? "border-blue-500" : "border-gray-700"
                        } bg-gray-800`}
                      >
                        <img
                          src={url || "/placeholder.svg"}
                          alt={`Thumbnail ${index + 1}`}
                          className="object-cover"
                        />
                      </motion.button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Vehicle Details */}
          <motion.div variants={itemVariants} className="space-y-6">
            {/* Price Card */}
            <Card className="bg-gray-900 border-gray-800">
              <CardContent className="p-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-400 mb-2">
                    ₹{vehicle.price_per_day.toLocaleString()}
                  </div>
                  <p className="text-gray-300">per day</p>
                  <Button className="w-full mt-4 bg-gradient-to-r from-green-500 to-blue-600 text-white" size="lg">
                    Book Now
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Vehicle Specifications */}
            <Card className="bg-gray-900 border-gray-800">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4 text-white">Specifications</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {getFuelIcon(vehicle.fuel_type)}
                      <span className="text-gray-300">Fuel Type</span>
                    </div>
                    <span className="font-medium capitalize text-white">{vehicle.fuel_type}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      <span className="text-gray-300">Seats</span>
                    </div>
                    <span className="font-medium text-white">{vehicle.seats}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Car className="w-4 h-4" />
                      <span className="text-gray-300">Type</span>
                    </div>
                    <span className="font-medium capitalize text-white">{vehicle.car_type}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Settings className="w-4 h-4" />
                      <span className="text-gray-300">Transmission</span>
                    </div>
                    <span className="font-medium text-white">{vehicle.automatic ? "Automatic" : "Manual"}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Registration */}
            <Card className="bg-gray-900 border-gray-800">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-2 text-white">Registration</h3>
                <p className="text-gray-300 font-mono">{vehicle.registration_number}</p>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Description */}
        <motion.div variants={itemVariants} className="mt-8">
          <Card className="bg-gray-900 border-gray-800">
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold mb-4 text-white">Description</h3>
              <p className="text-gray-300 leading-relaxed">{vehicle.description}</p>
            </CardContent>
          </Card>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
          {/* Owner Information */}
          <motion.div variants={itemVariants}>
            <Card className="bg-gray-900 border-gray-800">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4 text-white">Owner Details</h3>
                <div className="flex items-start gap-4">
                  <div className="relative">
                    <img
                      src={vehicle.owner_id.profile_image || "/placeholder.svg?height=60&width=60"}
                      alt={vehicle.owner_id.name}
                      width={60}
                      height={60}
                      className="rounded-full object-cover"
                    />
                    {vehicle.owner_id.is_verified_user && (
                      <div className="absolute -bottom-1 -right-1">
                        <CheckCircle className="w-5 h-5 text-green-500 bg-white rounded-full" />
                      </div>
                    )}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold text-white">{vehicle.owner_id.name}</h4>
                      {vehicle.owner_id.is_verified_user && (
                        <Badge variant="secondary" className="text-xs">
                          Verified
                        </Badge>
                      )}
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-gray-300">
                        <Mail className="w-4 h-4" />
                        {vehicle.owner_id.email}
                      </div>

                      {vehicle.owner_id.phone && (
                        <div className="flex items-center gap-2 text-sm text-gray-300">
                          <Phone className="w-4 h-4" />
                          {vehicle.owner_id.phone}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Location Information */}
          <motion.div variants={itemVariants}>
            <Card className="bg-gray-900 border-gray-800">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4 text-white">Location</h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-2">
                    <MapPin className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-white">{vehicle.location_id.name}</p>
                      <p className="text-sm text-gray-300">
                        {vehicle.location_id.address}, {vehicle.location_id.city}
                      </p>
                      <p className="text-sm text-gray-300">
                        {vehicle.location_id.state}, {vehicle.location_id.country} - {vehicle.location_id.pincode}
                      </p>
                    </div>
                  </div>
                </div>

                <Separator className="my-4 bg-gray-700" />

                <div className="flex items-center justify-between text-sm text-gray-400">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    Listed: {new Date(vehicle.createdAt).toLocaleDateString()}
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    Updated: {new Date(vehicle.updatedAt).toLocaleDateString()}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </motion.div>
  )
}

export default VehicleDetailPage

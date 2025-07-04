import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Fuel, Users, Settings, Star } from "lucide-react"
import type { Car } from "@/Types/User/carType"
import { useNavigate } from "react-router"

interface CarCardProps {
  car: Car
}

export function VehicleCard({ car }: CarCardProps) {
  const navigate = useNavigate()
  return (
    <div className="group relative overflow-hidden rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/15 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl">
      <div className="relative h-48 overflow-hidden">
        <img
          src={car.image_urls[0] || "/placeholder.svg?height=200&width=300"}
          alt={car.name}
          className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-110 rounded"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        <Badge
          variant="secondary"
          className="absolute top-3 right-3 bg-white/20 backdrop-blur-sm text-white border-white/30"
        >
          {car.car_type.toUpperCase()}
        </Badge>
      </div>

      <div className="p-6">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h3 className="text-xl font-bold text-white mb-1">{car.name}</h3>
            <p className="text-gray-300 text-sm">{car.brand}</p>
          </div>
          {car.rating && (
            <div className="flex items-center gap-1 text-yellow-400">
              <Star className="w-4 h-4 fill-current" />
              <span className="text-sm text-white">{car.rating}</span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-4 mb-4 text-gray-300">
          <div className="flex items-center gap-1">
            <Fuel className="w-4 h-4" />
            <span className="text-sm capitalize">{car.fuel_type}</span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="w-4 h-4" />
            <span className="text-sm">{car.seats} seats</span>
          </div>
          <div className="flex items-center gap-1">
            <Settings className="w-4 h-4" />
            <span className="text-sm">{car.automatic ? "Auto" : "Manual"}</span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <span className="text-2xl font-bold text-white">${car.price_per_day}</span>
            <span className="text-gray-300 text-sm">/day</span>
          </div>
            <Button onClick={()=>navigate(`/vehicle-details/${car._id}`)} className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300">
            View Details
            </Button>
        </div>
      </div>
    </div>
  )
}

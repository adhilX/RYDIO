import type { Vehicle } from "@/Types/User/addVehicle/Ivehicle"
import { Button } from "../ui/button"
import { motion } from "framer-motion"

type VehicleCardProps = {
  vehicle: Vehicle;
  setSelectedVehicle: (vehicle: Vehicle) => void;
};

function VehicleCard({ vehicle, setSelectedVehicle }: VehicleCardProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.03, boxShadow: '0 8px 32px 0 rgba(230,57,70,0.25)' }}
      className="bg-black/80 backdrop-blur-xl border border-black/60 shadow-2xl rounded-xl p-4 flex flex-col transition-all duration-200"
    >
      <img
        src={vehicle.image_urls[0]}
        alt={vehicle.name}
        className="w-full h-40 object-cover rounded mb-2"
      />
      <h3 className="text-lg font-bold text-white">{vehicle.name}</h3>
      <p className="text-sm text-gray-400">{vehicle.brand} - {vehicle.fuel_type}</p>
      <p className="text-sm text-gray-400">{vehicle.car_type} | {vehicle.seats} seats</p>
      <p className="text-sm font-medium mt-1 text-[#e63946]">₹{vehicle.price_per_day}/day</p>
      <Button
        className="mt-auto w-full bg-[#e63946] hover:bg-red-600 text-white rounded-lg font-semibold transition"
        onClick={() => setSelectedVehicle(vehicle)}
      >
        View Details
      </Button>
    </motion.div>
  );
}

export default VehicleCard
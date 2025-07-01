import type { Vehicle } from '@/Types/User/addVehicle/Ivehicle';
import { Card } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';

interface VehicleCardProps {
  vehicle: Vehicle;
}

export default function VehicleCard({ vehicle }: VehicleCardProps) {
  const navigate = useNavigate();
  return (
    <motion.div
      whileHover={{ scale: 1.03, boxShadow: '0 8px 32px 0 rgba(109,165,192,0.25)' }}
      className="transition-all duration-200"
    >
      <Card className="bg-black/80 border-white/10 shadow-xl rounded-2xl overflow-hidden p-0 flex flex-col h-full">
        <img
          src={vehicle.image_urls[0]}
          alt={vehicle.name}
          className="w-full h-40 object-cover rounded-t-2xl"
        />
        <div className="p-4 flex flex-col gap-2 flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-lg font-bold text-white">{vehicle.name}</span>
            <Badge className="bg-[#6DA5C0] text-black ml-auto">{vehicle.car_type}</Badge>
          </div>
          <div className="text-gray-300 text-sm">{vehicle.brand} &bull; {vehicle.fuel_type} &bull; {vehicle.seats} seats</div>
          <div className="text-[#6DA5C0] font-semibold text-base mt-1">9{vehicle.price_per_day}/day
          </div>
          <button
            className="mt-auto w-full bg-[#6DA5C0] hover:bg-[#5b8ca7] text-black rounded-lg font-semibold py-2 transition"
            onClick={() => navigate(`/vehicles/${vehicle._id}`)}
          >
            View Details
          </button>
        </div>
      </Card>
    </motion.div>
  );
} 
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { motion } from 'framer-motion';
import { AdminVehicleModal } from './modal/AdminVehicleModal';
import VehicleCard from './vehicleCard';
import type { Vehicle } from '@/Types/User/addVehicle/Ivehicle';


const dummyVehicles: Vehicle[] = Array.from({ length: 15 }, (_, i) => ({
  id: `${i + 1}`,
  name: `Car ${i + 1}`,
  brand: 'Toyota',
  fuelType: 'Petrol',
  pricePerDay: 1500,
  carType: 'SUV',
  seats: 5,
  automatic: true,
  image: `https://source.unsplash.com/400x200/?car,${i + 1}`,
  registrationNumber: `KL-${1000 + i}`,
  owner: `User ${i + 1}`,
  location: 'Kochi, Kerala',
  status: 'pending',
}));

useEffect(()=>{
  const fetchData = ()=>{
    
  }
})
export default function AdminVehicleList() {
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const perPage = 6;

  const filtered = dummyVehicles.filter(v =>
    v.name.toLowerCase().includes(search.toLowerCase())
  );

  const paginated = filtered.slice((currentPage - 1) * perPage, currentPage * perPage);
  const totalPages = Math.ceil(filtered.length / perPage);

  return (
    <motion.div
      className="p-4 space-y-6 bg-black/80 backdrop-blur-xl border border-black/60 shadow-2xl rounded-xl"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 30 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-white tracking-wider">Vehicle Management</h2>
        <Input
          placeholder="Search vehicles..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-64 bg-black/60 border border-black/60 text-white focus:outline-none focus:ring-2 focus:ring-[#e63946] rounded-lg"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {paginated.map((vehicle, idx) => (
          <motion.div
            key={vehicle.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
          >
            <VehicleCard setSelectedVehicle={setSelectedVehicle} vehicle={vehicle}/>
          </motion.div>
        ))}
      </div>

      <div className="flex justify-center items-center gap-4 pt-6">
        <Button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((p) => p - 1)}
          className="bg-[#e63946] hover:bg-red-600 text-white rounded-lg px-4 py-2 font-semibold transition disabled:opacity-50"
        >
          Previous
        </Button>
        <span className="text-sm text-white">Page {currentPage} of {totalPages}</span>
        <Button
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage((p) => p + 1)}
          className="bg-[#e63946] hover:bg-red-600 text-white rounded-lg px-4 py-2 font-semibold transition disabled:opacity-50"
        >
          Next
        </Button>
      </div>

      {selectedVehicle && (
        <AdminVehicleModal
          open={selectedVehicle}
          vehicle={selectedVehicle}
          onClose={() => setSelectedVehicle(null)}
        />
      )}

    </motion.div>
  );
}

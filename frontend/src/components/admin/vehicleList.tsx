import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { motion } from 'framer-motion';
import { AdminVehicleModal } from './modal/AdminVehicleModal';
import VehicleCard from './vehicleCard';

interface Vehicle {
  id: string;
  name: string;
  brand: string;
  fuelType: string;
  pricePerDay: number;
  carType: string;
  seats: number;
  automatic: boolean;
  image: string;
  registrationNumber: string;
  owner: string;
  location: string;
  status: 'pending' | 'accepted' | 'rejected';
}

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
      className="p-4 space-y-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Vehicle Management</h2>
        <Input
          placeholder="Search vehicles..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-64"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {paginated.map((vehicle) => (
            
        <VehicleCard setSelectedVehicle={setSelectedVehicle} vehicle={vehicle}/>
        ))}
      </div>

      <div className="flex justify-center items-center gap-4 pt-6">
        <Button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((p) => p - 1)}
        >
          Previous
        </Button>
        <span className="text-sm">Page {currentPage} of {totalPages}</span>
        <Button
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage((p) => p + 1)}
        >
          Next
        </Button>
      </div>

      {selectedVehicle && (
        <AdminVehicleModal
          vehicle={selectedVehicle}
          onClose={() => setSelectedVehicle(null)}
        />
      )}

    </motion.div>
  );
}

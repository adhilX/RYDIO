import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { motion } from 'framer-motion';
import { AdminVehicleModal } from './modal/AdminVehicleModal';
import VehicleCard from './vehicleCard';

interface Vehicle {
  id: string;
  name: string;
  brand: string;
  registration_number: string;
  image_url: string;
  status: 'requested' | 'rejected';
  owner: {
    name: string;
    email: string;
  };
}

const dummyVehicles: Vehicle[] = Array.from({ length: 25 }).map((_, i) => ({
  id: `veh-${i + 1}`,
  name: `Car ${i + 1}`,
  brand: ['Toyota', 'Honda', 'Ford'][i % 3],
  registration_number: `KL-${i + 10}-XYZ`,
  image_url: 'https://via.placeholder.com/200x120',
  status: i % 2 === 0 ? 'requested' : 'rejected',
  owner: {
    name: `Owner ${i + 1}`,
    email: `owner${i + 1}@mail.com`,
  },
}));

const ITEMS_PER_PAGE = 6;

export default function AdminRequestedVehicles() {
  const [showRejected, setShowRejected] = useState(false);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);

  const filteredVehicles = dummyVehicles.filter(
    (v) =>
      v.status === (showRejected ? 'rejected' : 'requested') &&
      v.name.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filteredVehicles.length / ITEMS_PER_PAGE);
  const currentData = filteredVehicles.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [search, showRejected]);

  return (
    <motion.div
      className="p-6 space-y-6"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex flex-col md:flex-row text-white justify-between items-center gap-4">
        <Input
          placeholder="Search vehicle..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-sm"
        />
        <Button
          variant="outline"
          onClick={() => setShowRejected((prev) => !prev)}
        >
          {showRejected ? 'Show Requested' : 'Show Rejected'}
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {currentData.map((vehicle) => (
                  <VehicleCard setSelectedVehicle={setSelectedVehicle} vehicle={vehicle}/>

        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-center items-center gap-2 pt-4">
        <Button
          variant="secondary"
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((prev) => prev - 1)}
        >
          Prev
        </Button>
        <span className="text-sm text-gray-300">
          Page {currentPage} of {totalPages}
        </span>
        <Button
          variant="secondary"
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage((prev) => prev + 1)}
        >
          Next
        </Button>
      </div>

      {selectedVehicle && (
        <AdminVehicleModal
          vehicle={selectedVehicle}
          open={!!selectedVehicle}
          onClose={() => setSelectedVehicle(null)}
        />
      )}
    </motion.div>
  );
}

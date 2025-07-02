import { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { motion } from 'framer-motion';
import { AdminVehicleModal } from './modal/AdminVehicleModal';
import VehicleCard from './VehicleCard';
import type { Iuser } from '@/Types/User/Iuser';
import type { Vehicle } from '@/Types/User/addVehicle/Ivehicle';
import type { Ilocation } from '@/Types/User/location';
import Pagination from '../Pagination';
import { getAprovedVehicle } from '@/services/admin/vehicleSevice';

export default function AdminVehicleList() {
  const [vehicles, setVehicles] = useState<(Vehicle & { owner_id: Iuser; location_id: Ilocation })[]>([]);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle & { owner_id: Iuser; location_id: Ilocation } | null>(null);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1)
  const perPage = 6;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getAprovedVehicle(search, currentPage, perPage);
        setVehicles(response.vehicle);
        setTotalPage(response?.total)

      } catch (error) {
        console.error('Failed to fetch vehicles:', error);
      }
    };
    fetchData();
  }, [search, currentPage]);

  return (
    <motion.div
      className="p-4 space-y-6 bg-transparent shadow-2xl  rounded-xl "
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      // exit={{ opacity: 0, y: 30 }}
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
        {vehicles.length ?vehicles.map((vehicle, idx) => (
          <motion.div
            key={vehicle._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
          >
            <VehicleCard setSelectedVehicle={setSelectedVehicle} vehicle={vehicle} />
          </motion.div>
        )):(<div className="col-span-full flex justify-center items-center py-12">
            <p className="text-gray-100 text-lg">No vehicles found.</p>
          </div>)}
      </div>

           {totalPage > 1 ? <Pagination currentPage={currentPage} onPageChange={setCurrentPage} totalPages={totalPage} /> : <></>}
     

      {selectedVehicle && (
        <AdminVehicleModal
          open={true}
          vehicle={selectedVehicle}
          onClose={() => setSelectedVehicle(null)}
        />
      )}
    </motion.div>
  );
}

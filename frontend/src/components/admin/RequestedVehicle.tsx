import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { AdminVehicleModal } from './modal/AdminVehicleModal';
import VehicleCard from './vehicleCard';
import type { Vehicle } from '@/Types/User/addVehicle/Ivehicle';
import { getPendingVehicle } from '@/services/admin/vehicleSevice';
import { Input } from '../ui/input';
import Pagination from '../Pagination';
import type { Iuser } from '@/Types/User/Iuser';




export default function AdminRequestedVehicles() {
  const [showRejected, setShowRejected] = useState(false);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [vehicle, setVehicles] = useState<Vehicle[]>([])
  const [totalPage,setTotalPage]= useState(1)
  const filteredVehicles = vehicle.filter((v) =>
    v.admin_approve === (showRejected ? 'rejected' : 'pending')
  );


const [debouncedSearch, setDebouncedSearch] = useState(search);

useEffect(() => {
  const delayDebounce = setTimeout(() => {
    setDebouncedSearch(search);
  }, 500); 

  return () => clearTimeout(delayDebounce);
}, [search]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await getPendingVehicle(debouncedSearch, currentPage, 6);
      setVehicles(response?.vehicles || []);
      setTotalPage(response?.total)
    };
    fetchData();
  }, [debouncedSearch, currentPage, showRejected, selectedVehicle]);


  return (
    <motion.div
      className={
        `p-6 space-y-6 0 shadow-2xl rounded-xl transition-all duration-300` +
        (selectedVehicle ? ' blur-sm ' : '')
      }
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex flex-col md:flex-row text-white justify-end p-4 items-center gap-4">
        <Input
          placeholder="Search vehicle..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-sm bg-black/60 border border-black/60 text-white focus:outline-none focus:ring-2 focus:ring-[#e63946] rounded-lg"
        />
        <Button
          variant="outline"
          onClick={() => {
            setShowRejected((prev) => !prev);
            setCurrentPage(1);
          }}
          className="bg-[#e63946] hover:bg-red-600 text-white rounded-lg font-semibold transition"
        >
          {showRejected ? 'Show Requested' : 'Show Rejected'}
        </Button>

      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 min-h-[200px]"></div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredVehicles.length? filteredVehicles.map((vehicle, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
          >
            <VehicleCard vehicle={vehicle} setSelectedVehicle={setSelectedVehicle} />
          </motion.div>
        )) : (
          <div className="col-span-full flex justify-center items-center py-12">
        <p className="text-gray-100 text-lg">No vehicles found.</p>
          </div>
        )}
      </div>

      {/* Pagination */}

{totalPage>1?<Pagination currentPage={currentPage} onPageChange={setCurrentPage} totalPages={totalPage}/>:<></>}
   {selectedVehicle && typeof selectedVehicle.owner_id !== 'string' && (
  <AdminVehicleModal
    vehicle={selectedVehicle as Vehicle & { owner_id: Iuser }}
    open={!!selectedVehicle}
    onClose={() => setSelectedVehicle(null)}
  />
)}

    </motion.div>
  );
}

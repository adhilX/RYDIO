import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, X } from 'lucide-react';
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
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    category: 'all', 
    fuelType: 'all', 
    transmission: 'all'
  });

   const [debouncedSearch, setDebouncedSearch] = useState(search);
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      setDebouncedSearch(search.trim());
    }, 1000);
   return () => clearTimeout(delayDebounce);
  }, [search]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getAprovedVehicle(debouncedSearch, currentPage, perPage, filters);
        setVehicles(response.vehicle);
        setTotalPage(Math.ceil(response?.total/perPage))

      } catch (error) {
        console.error('Failed to fetch vehicles:', error);
      }
    };
    fetchData();
  }, [debouncedSearch, currentPage, filters]);

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setFilters({
      category: 'all',
      fuelType: 'all',
      transmission: 'all'
    });
    setCurrentPage(1);
  };

  const hasActiveFilters = filters.category !== 'all' || filters.fuelType !== 'all' || filters.transmission !== 'all';

  return (
    <motion.div
      className="p-4 space-y-6 rounded-xl "
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      // exit={{ opacity: 0, y: 30 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-white tracking-wider">Vehicle Management</h2>
      </div>

      {/* Search and Filters */}
      <motion.div className="bg-black/80 backdrop-blur-xl border border-black/60 shadow-2xl p-4 rounded-xl">
        <div className="flex flex-col gap-4">
          {/* Search Bar */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search by vehicle name or brand..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-black/60 rounded-lg bg-transparent text-white focus:outline-none focus:ring-2 focus:ring-[#e63946]"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all duration-200 ${
                showFilters || hasActiveFilters
                  ? 'bg-[#e63946]/20 border-[#e63946] text-[#e63946]'
                  : 'border-black/60 text-gray-400 hover:border-gray-500'
              }`}
            >
              <Filter size={18} />
              Filters
              {hasActiveFilters && (
                <span className="bg-[#e63946] text-white text-xs px-2 py-1 rounded-full">!</span>
              )}
            </button>
          </div>

          {/* Filter Panel */}
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="border-t border-black/60 pt-4"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Category Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Category</label>
                  <select
                    value={filters.category}
                    onChange={(e) => handleFilterChange('category', e.target.value)}
                    className="w-full px-3 py-2 border border-black/60 rounded-lg bg-black/60 text-white focus:outline-none focus:ring-2 focus:ring-[#e63946]"
                  >
                    <option value="all">All Categories</option>
                    <option value="car">Car</option>
                    <option value="bike">Bike</option>
                    <option value="truck">Truck</option>
                    <option value="suv">SUV</option>
                  </select>
                </div>

                {/* Fuel Type Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Fuel Type</label>
                  <select
                    value={filters.fuelType}
                    onChange={(e) => handleFilterChange('fuelType', e.target.value)}
                    className="w-full px-3 py-2 border border-black/60 rounded-lg bg-black/60 text-white focus:outline-none focus:ring-2 focus:ring-[#e63946]"
                  >
                    <option value="all">All Fuel Types</option>
                    <option value="petrol">Petrol</option>
                    <option value="diesel">Diesel</option>
                    <option value="electric">Electric</option>
                    <option value="hybrid">Hybrid</option>
                  </select>
                </div>

                {/* Transmission Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Transmission</label>
                  <select
                    value={filters.transmission}
                    onChange={(e) => handleFilterChange('transmission', e.target.value)}
                    className="w-full px-3 py-2 border border-black/60 rounded-lg bg-black/60 text-white focus:outline-none focus:ring-2 focus:ring-[#e63946]"
                  >
                    <option value="all">All Transmissions</option>
                    <option value="manual">Manual</option>
                    <option value="automatic">Automatic</option>
                  </select>
                </div>
              </div>

              {/* Clear Filters */}
              {hasActiveFilters && (
                <div className="flex justify-end mt-4">
                  <button
                    onClick={clearFilters}
                    className="flex items-center gap-2 px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors"
                  >
                    <X size={16} />
                    Clear Filters
                  </button>
                </div>
              )}
            </motion.div>
          )}
        </div>
      </motion.div>

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

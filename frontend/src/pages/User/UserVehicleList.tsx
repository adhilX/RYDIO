import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, X } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import Pagination from '@/components/Pagination';
import VehicleCard from '@/components/user/VehicleCard';
import FilterSidebar from '@/components/user/FilterSidebar';
import Navbar from '@/components/user/Navbar';

// Dummy data for vehicles
const dummyVehicles = [
  {
    _id: '1',
    owner_id: '',
    name: 'Tesla Model S',
    brand: 'Tesla',
    registration_number: 'TSLA1234',
    fuel_type: 'electric',
    seats: 5,
    car_type: 'sedan',
    automatic: true,
    price_per_day: 3500,
    description: 'A luxury electric sedan with autopilot.',
    image_urls: [
      'https://images.unsplash.com/photo-1511918984145-48de785d4c4e?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?auto=format&fit=crop&w=800&q=80',
    ],
    admin_approve: 'accepted',
    is_available: true,
  },
  {
    _id: '2',
    owner_id: '',
    name: 'BMW X5',
    brand: 'BMW',
    registration_number: 'BMW5678',
    fuel_type: 'diesel',
    seats: 7,
    car_type: 'suv',
    automatic: true,
    price_per_day: 4200,
    description: 'Spacious SUV for family trips.',
    image_urls: [
      'https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1461632830798-3adb3034e4c8?auto=format&fit=crop&w=800&q=80',
    ],
    admin_approve: 'accepted',
    is_available: true,
  },
  // ...more dummy vehicles
];

export default function UserVehicleList() {
  const [showFilters, setShowFilters] = useState(false);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 3;

  // Filtered and paginated dummy data (replace with API call later)
  const filteredVehicles = dummyVehicles.filter(v =>
    v.name.toLowerCase().includes(search.toLowerCase()) ||
    v.brand.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
    
      <Navbar/>
    <div className="min-h-screen bg-black text-white font-sans  flex  flex-col md:flex-row">
      {/* Sidebar (collapsible on mobile) */}
      <AnimatePresence>
        {(showFilters || window.innerWidth >= 768) && (
          <motion.aside
            initial={{ x: -320, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -320, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="z-20 w-full md:w-72 md:sticky top-0 h-full bg-gradient-to-b from-[#232b3a] via-[#181f23] to-[#232b3a] border-r border-white/10 p-0 flex flex-col shadow-2xl md:translate-x-0 fixed md:relative left-0"
          >
            <div className="flex items-center justify-between px-6 py-4 md:hidden">
              <span className="text-lg font-bold text-[#6DA5C0]">Filters</span>
              <button onClick={() => setShowFilters(false)} className="text-white hover:text-[#6DA5C0]">
                <X size={24} />
              </button>
            </div>
            <FilterSidebar />
          </motion.aside>
        )}
      </AnimatePresence>
      {/* Filter toggle button (mobile) */}
      <button
        className="md:hidden fixed top-5 left-5 z-30 bg-[#6DA5C0] text-white p-2 rounded-full shadow-lg"
        onClick={() => setShowFilters(true)}
        aria-label="Open filters"
      >
        <Filter size={20} />
      </button>
      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 md:px-8 py-10">
        {/* Search Bar */}
        <Card className="max-w-3xl mx-auto p-6 rounded-2xl shadow-2xl bg-white/10 backdrop-blur-md border-white/20 mb-10">
          <div className="flex items-center gap-4">
            <Search className="text-gray-300" size={22} />
            <Input
              type="text"
              placeholder="Search by car, brand, type..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="bg-white/10 text-white placeholder:text-gray-300 border-white/30 focus:border-[#6DA5C0] h-12 rounded-xl text-lg"
            />
          </div>
        </Card>
        {/* Vehicle Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredVehicles.length === 0 ? (
            <div className="col-span-full text-center text-gray-400 py-20">No vehicles found.</div>
          ) : (
            filteredVehicles.map(vehicle => (
              <VehicleCard key={vehicle._id} vehicle={vehicle} />
            ))
          )}
        </div>
        {/* Pagination */}
        <div className="mt-12 flex justify-center">
          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
        </div>
      </main>
    </div>
    </>
  );
}

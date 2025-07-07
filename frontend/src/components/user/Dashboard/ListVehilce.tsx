import { useEffect, useState } from 'react';
import { PlusCircle, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getMyVehicle } from '@/services/user/vehicleService';
import { useSelector } from 'react-redux';
import type { RootState } from '@/store/store';
import type { Vehicle } from '@/Types/User/addVehicle/Ivehicle';
import { motion } from 'framer-motion';
import Pagination from '@/components/Pagination';


const ListVehilce = () => {
  const user = useSelector((state: RootState) => state.auth.user)
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [totalPages, setTotalPages] = useState(1)
  const [search, setSearch] = useState('')
  const [limit] = useState(6)
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false)
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [disableAddBtn,setDisableAddBtn] = useState(false)
  const navigate = useNavigate();

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedSearch(search);
      setCurrentPage(1);
    }, 1000);
    return () => clearTimeout(timeout);
  }, [search]);

  useEffect(() => {
    const fetchData = async () => {
      if (user && user._id) {
        setIsLoading(true)
        const response = await getMyVehicle(user._id, debouncedSearch, currentPage, limit);
        if (response && response.vehicle) {
          setVehicles(response.vehicle);
          setTotalPages(Math.ceil(response.total / limit));
        }
        setIsLoading(false)
      }
    };
    const changeAddBtn=()=>{
      console.log(user?.idproof_id)
      console.log(vehicles.length)
      if(!user?.idproof_id &&vehicles.length >1 ){
        setDisableAddBtn(true)
      }
    }
  fetchData();
  changeAddBtn()
  }, [debouncedSearch, currentPage, user, limit, vehicles.length]);

  if (!user) return null;
  return (
    <div className="w-full p-4 md:p-8 font-sans">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-[#232b3a] tracking-tight">My Vehicles</h1>
        <motion.div className="bg-black/80 backdrop-blur-xl border border-black/60 shadow-2xl p-3 rounded-xl">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search by email or name..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-white/40 rounded-lg bg-transparent text-white focus:outline-none focus:ring-2 focus:ring-[#e63946]"
              />
            </div>
          </div>
        </motion.div>
  {disableAddBtn && (
  <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded-lg shadow-sm text-sm font-medium max-w-md">
    Submit ID proof to add more vehicles.
  </div>
)}
         <button
          disabled={disableAddBtn}
          onClick={() => navigate('/userProfile/add-vehicle')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-semibold shadow transition
            ${disableAddBtn
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-[#6DA5C0] text-white hover:bg-[#232b3a]'
            }`
          }
        >
          <PlusCircle className="w-5 h-5" />
          Add Vehicle
        </button>
      </div>
      <div className="overflow-x-auto">

        {isLoading ? (
          <div className="flex flex-col justify-center items-center h-64">
            <div className="w-16 h-16 border-4 border-red-500 border-t-transparent rounded-full animate-spin"></div>
            <span className="mt-4 text-white/80 text-lg font-semibold animate-pulse">Loading vehicle...</span>
          </div>
        ) : vehicles.length === 0 ? (
          <div className="p-6  h-100 flex text-center justify-center text-gray-400">No vehicle found</div>
        ) : (<table className="min-w-full bg-stone-950 rounded-xl shadow divide-y divide-gray-100">
          <thead>
            <tr className="bg-[#6DA5C0] text-[#232b3a]">
              <th className="px-4 py-3 text-left font-semibold">Image</th>
              <th className="px-4 py-3 text-left font-semibold">Name</th>
              <th className="px-4 py-3 text-left font-semibold">Model</th>
              <th className="px-4 py-3 text-left font-semibold">Year</th>
              <th className="px-4 py-3 text-left font-semibold">Status</th>
            </tr>
          </thead>
          <tbody>
            {vehicles.map((vehicle, index) => (
              <tr key={index} className="hover:bg-stone-700 transition">
                <td className="px-4 py-3">
                  <img src={vehicle.image_urls[0]} alt={vehicle.name} className="w-16 h-10 object-cover rounded-lg shadow" />
                </td>
                <td className="px-4 py-3 font-medium ">{vehicle.name}</td>
                <td className="px-4 py-3 ">{vehicle.brand}</td>
                <td className="px-4 py-3 ">{vehicle.fuel_type}</td>
                <td className="px-4 py-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${vehicle.is_available ? 'bg-[#eaf6fa] text-[#6DA5C0]' : 'bg-gray-200 text-gray-500'}`}>{vehicle.admin_approve}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>)}
      </div>
      {/* Pagination Controls */}

      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}
    </div>
  );
}
export default ListVehilce
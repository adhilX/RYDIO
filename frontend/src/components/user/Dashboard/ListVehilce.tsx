import { useEffect, useState } from 'react';
import { PlusCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getMyVehicle } from '@/services/user/vehicleService';
import { useSelector } from 'react-redux';
import type { RootState } from '@/store/store';
import type { Vehicle } from '@/Types/User/addVehicle/Ivehicle';

const dummyVehicles = [
  { id: 1, name: 'Hyundai i20', model: 'Asta', year: 2022, status: 'Active', image: 'https://images.pexels.com/photos/358070/pexels-photo-358070.jpeg?auto=compress&w=400' },
  { id: 2, name: 'Maruti Swift', model: 'VXi', year: 2021, status: 'Inactive', image: 'https://images.pexels.com/photos/358070/pexels-photo-358070.jpeg?auto=compress&w=400' },
  { id: 3, name: 'Honda City', model: 'ZX', year: 2023, status: 'Active', image: 'https://images.pexels.com/photos/358070/pexels-photo-358070.jpeg?auto=compress&w=400' },
  { id: 4, name: 'Tata Nexon', model: 'XZ+', year: 2020, status: 'Active', image: 'https://images.pexels.com/photos/358070/pexels-photo-358070.jpeg?auto=compress&w=400' },
  { id: 5, name: 'Kia Seltos', model: 'GTX', year: 2022, status: 'Inactive', image: 'https://images.pexels.com/photos/358070/pexels-photo-358070.jpeg?auto=compress&w=400' },
  { id: 6, name: 'Toyota Innova', model: 'Crysta', year: 2021, status: 'Active', image: 'https://images.pexels.com/photos/358070/pexels-photo-358070.jpeg?auto=compress&w=400' },
];

 const  ListVehilce=()=> {
  const user = useSelector((state:RootState)=>state.auth.user)
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [page, setPage] = useState(1);
  const perPage = 3;
  const totalPages = Math.ceil(dummyVehicles.length / perPage);
  const navigate = useNavigate();
  
  useEffect(() => {
    const fetchData = async () => {
      if (user && user._id) {
          const response = await getMyVehicle(user._id as string);
          if (response && response.vehicle) {
            setVehicles(response.vehicle);
          }
      }
    };
    fetchData();
  }, [user]);

  if (!user) return null;
  console.log(vehicles);
  return (
    <div className="w-full p-4 md:p-8 font-sans">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-[#232b3a] tracking-tight">My Vehicles</h1>
        <button
          onClick={() => navigate('/userProfile/add-vehicle')}
          className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#6DA5C0] text-white font-semibold shadow hover:bg-[#232b3a] transition"
        >
          <PlusCircle className="w-5 h-5" />
          Add Vehicle
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-xl shadow divide-y divide-gray-100">
          <thead>
            <tr className="bg-[#eaf6fa] text-[#232b3a]">
              <th className="px-4 py-3 text-left font-semibold">Image</th>
              <th className="px-4 py-3 text-left font-semibold">Name</th>
              <th className="px-4 py-3 text-left font-semibold">Model</th>
              <th className="px-4 py-3 text-left font-semibold">Year</th>
              <th className="px-4 py-3 text-left font-semibold">Status</th>
            </tr>
          </thead>
          <tbody>
            {vehicles.map((vehicle ,index)=> (
              <tr key={index} className="hover:bg-[#f6fbfd] transition">
                <td className="px-4 py-3">
                  <img src={vehicle.image_urls[0]} alt={vehicle.name} className="w-16 h-10 object-cover rounded-lg shadow" />
                </td>
                <td className="px-4 py-3 font-medium text-[#232b3a]">{vehicle.name}</td>
                <td className="px-4 py-3 text-[#232b3a]">{vehicle.brand}</td>
                <td className="px-4 py-3 text-[#232b3a]">{vehicle.fuel_type}</td>
                <td className="px-4 py-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${vehicle.is_available ? 'bg-[#eaf6fa] text-[#6DA5C0]' : 'bg-gray-200 text-gray-500'}`}>{vehicle.admin_approve}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Pagination Controls */}
      <div className="flex justify-end gap-2 mt-6">
        <button
          className="px-4 py-2 rounded-lg bg-[#232b3a] text-white/80 hover:bg-[#6DA5C0] hover:text-white font-semibold transition disabled:opacity-40"
          onClick={() => setPage(page - 1)}
          disabled={page === 1}
        >
          Previous
        </button>
        <span className="px-2 text-[#232b3a]/60 self-center">Page {page} of {totalPages}</span>
        <button
          className="px-4 py-2 rounded-lg bg-[#232b3a] text-white/80 hover:bg-[#6DA5C0] hover:text-white font-semibold transition disabled:opacity-40"
          onClick={() => setPage(page + 1)}
          disabled={page === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
}
export default ListVehilce
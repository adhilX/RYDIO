import { useState, useEffect, useCallback } from "react";
import { useLocation} from "react-router";
import { toast } from "react-hot-toast";
import type { FilterState } from "@/Types/User/carType";
import type { Vehicle } from "@/Types/User/addVehicle/Ivehicle";
import type { SearchParams } from "@/Types/User/searchTypes";
import { SearchVehicle } from "@/services/user/vehicleService";
import FilterSidebar from "@/components/user/FilterSidebar";
import { VehicleCard } from "@/components/user/VehicleCard";
import Pagination from "@/components/Pagination";
import Navbar from "@/components/user/Navbar";
import VehicleSearchBar from "@/components/user/VehicleSearchBar";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";

const CARS_PER_PAGE = 6;

export default function UserVehicleList() {
  const location = useLocation();
  const [cars, setCars] = useState<Vehicle[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const user = useSelector((state: RootState) => state.auth.user);

  const [filters, setFilters] = useState<FilterState>({
    search: "",
    fuel_types: [],
    seats: [],
    car_types: [],
    transmission: [],
    price_range: [0, 10000],
    distance_range: 50,
    available_only: false,
  });

  const searchParams = location.state as SearchParams | undefined
  useEffect(() => {
    if (!user || !searchParams) return;

    const fetchVehicles = async () => {
      try {
        setIsLoading(true);
   const data = await SearchVehicle(
      searchParams.latitude,
      searchParams.longitude,
      searchParams.pickupDate,
      searchParams.returnDate || "",
      currentPage,
      CARS_PER_PAGE,
      user._id!,
      filters
    );

      setCars(data.vehicles);
      setTotalPages(Math.ceil(data.total / CARS_PER_PAGE));
    } catch (error) {
    console.error("Error fetching vehicles:", error);
    toast.error("Failed to load vehicles");
      } finally {
        setIsLoading(false);
      }
    }
    fetchVehicles();
  }, [user, searchParams, currentPage, filters]);

  const handleFilter = useCallback((updated: Partial<FilterState>) => {
    setFilters((prev) => ({ ...prev, ...updated }));
    setCurrentPage(1);
  }, []);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex flex-col">
      <Navbar />
      <div className="flex-1 pt-16">
        <div className="container mx-auto px-4 sm:px-6 pb-16 h-full">
          <div className="mb-8">
            <VehicleSearchBar />
          </div>
          <div className="flex flex-col lg:flex-row gap-4 md:gap-6 lg:gap-8 px-15">
            <div className="lg:w-1/4 w-full">
              <FilterSidebar 
                filters={filters} 
                onFiltersChange={handleFilter} 
              />
            </div>
            <div className="lg:w-3/4 w-full">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                <h2 className="text-xl font-semibold text-white">Available Vehicles</h2>
                <div className="flex items-center space-x-2 sm:space-x-4 w-full sm:w-auto">
                  <label htmlFor="distance-range" className="text-sm font-medium text-gray-300 whitespace-nowrap">Within:</label>
                  <select
                    id="distance-range"
                    value={filters.distance_range}
                    onChange={(e) => handleFilter({ distance_range: Number(e.target.value) })}
                    className="w-full sm:w-auto bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-sm text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value={10}>10 km</option>
                    <option value={25}>25 km</option>
                    <option value={50}>50 km</option>
                    <option value={100}>100 km</option>
                    <option value={0}>Any distance</option>
                  </select>
                </div>
              </div>
              {isLoading ? (
                <div className="flex justify-center items-center h-64">
                  <div className="text-white">Loading more vehicles...</div>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                    {cars?.length ? (
                      cars.map((car) => (
                        <div key={car._id} className="w-full h-full">
                          <VehicleCard car={car} />
                        </div>
                      ))
                    ) : (
                      <div className="col-span-full flex flex-col items-center justify-center py-16 px-4 text-center">
                        <div className="w-24 h-24 mb-4 text-gray-400">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.631 8.41m5.96 5.96a14.926 14.926 0 01-5.841 2.58m-.119-8.54a6 6 0 00-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 00-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 01-2.448-2.448 14.9 14.9 0 01.06-.31m-2.24 2.39a4.493 4.493 0 00-1.757 4.306 4.493 4.493 0 004.306-1.758M16.5 9a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                          </svg>
                        </div>
                        <h3 className="text-xl font-semibold text-white mb-2">No vehicles found</h3>
                        <p className="text-gray-400 max-w-md mb-6">We couldn't find any vehicles matching your search criteria. Try adjusting your filters or search location.</p>
                      </div>
                    )}
                  </div>
                  {totalPages >1 && (
                    <div className="mt-8">
                      <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={handlePageChange}
                      />
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

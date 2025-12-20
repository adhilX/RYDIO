import { useState, useEffect, useCallback } from "react";
import { useLocation } from "react-router";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";

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
    <div className="min-h-screen bg-black text-white relative">
      <Navbar />

      {/* Background Gradient/Image Effect similar to Landing if desired, or just clean black */}
      <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-gray-900 via-black to-black"></div>
      </div>

      <div className="relative z-10 pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-6 h-full">
          <div className="mb-8">
            <VehicleSearchBar />
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Filter Sidebar */}
            <div className="lg:w-80 flex-shrink-0">
              <FilterSidebar
                filters={filters}
                onFiltersChange={handleFilter}
              />
            </div>

            {/* Main Content */}
            <div className="flex-1">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4 bg-white/5 p-4 rounded-xl border border-white/10 backdrop-blur-sm">
                <h2 className="text-2xl font-bold text-white">
                  Available Vehicles
                  <span className="text-sm font-normal text-gray-400 ml-3">
                    {cars?.length || 0} results found
                  </span>
                </h2>

                <div className="flex items-center space-x-3 w-full sm:w-auto">
                  <label htmlFor="distance-range" className="text-sm font-medium text-gray-300 whitespace-nowrap">
                    Distance:
                  </label>
                  <Select
                    value={filters.distance_range.toString()}
                    onValueChange={(value) => handleFilter({ distance_range: Number(value) })}
                  >
                    <SelectTrigger className="w-[120px] bg-black/50 border-white/20 text-white focus:ring-white/50 h-10">
                      <SelectValue placeholder="Distance" />
                    </SelectTrigger>
                    <SelectContent className="bg-black/90 border-white/20 text-white backdrop-blur-xl">
                      <SelectItem value="10" className="focus:bg-white/10 focus:text-white cursor-pointer">10 km</SelectItem>
                      <SelectItem value="25" className="focus:bg-white/10 focus:text-white cursor-pointer">25 km</SelectItem>
                      <SelectItem value="50" className="focus:bg-white/10 focus:text-white cursor-pointer">50 km</SelectItem>
                      <SelectItem value="100" className="focus:bg-white/10 focus:text-white cursor-pointer">100 km</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {isLoading ? (
                <div className="flex justify-center items-center h-64">
                  <Spinner size="lg" variant="light" />
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {cars?.length ? (
                      cars.map((car) => (
                        <div key={car._id} className="w-full">
                          <VehicleCard car={car} />
                        </div>
                      ))
                    ) : (
                      <div className="col-span-full flex flex-col items-center justify-center py-20 px-4 text-center bg-white/5 rounded-2xl border border-white/10 border-dashed">
                        <div className="w-20 h-20 mb-6 text-gray-500 bg-white/5 rounded-full flex items-center justify-center">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} className="w-10 h-10">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                          </svg>
                        </div>
                        <h3 className="text-xl font-semibold text-white mb-2">No vehicles found</h3>
                        <p className="text-gray-400 max-w-md mb-8">
                          We couldn't find any vehicles matching your search criteria. Try expanding your search radius or changing dates.
                        </p>
                        <button
                          onClick={() => handleFilter({
                            fuel_types: [],
                            seats: [],
                            car_types: [],
                            transmission: [],
                            price_range: [0, 10000],
                            distance_range: 100
                          })}
                          className="px-6 py-2 bg-white text-black font-semibold rounded-lg hover:bg-gray-200 transition-colors"
                        >
                          Clear Filters
                        </button>
                      </div>
                    )}
                  </div>

                  {totalPages > 1 && (
                    <div className="mt-12 flex justify-center">
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

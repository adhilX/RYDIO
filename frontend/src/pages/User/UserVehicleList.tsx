import { useState, useEffect } from "react"
import type { FilterState } from "@/Types/User/carType"
import { FilterSidebar } from "@/components/user/FilterSidebar"
import { VehicleCard } from "@/components/user/VehicleCard"
import Pagination from "@/components/Pagination"
import Navbar from "@/components/user/Navbar"
import { useLocation } from "react-router"
import { SearchVehicle } from "@/services/user/vehicleService"

const CARS_PER_PAGE = 6

export default function UserVehileList() {
  const location = useLocation()
  const [cars,setCars]= useState([])
  useEffect(()=>{
    const fetchvehilce = async()=>{
      const {latitude,longitude}= location.state
      console.log(latitude,longitude)
      const data = await SearchVehicle(latitude,longitude)
      setCars(data.vehicles)
    }
    fetchvehilce()
  },[location.state])
  const [filters, setFilters] = useState<FilterState>({
    fuel_types: [],
    seats: [],
    car_types: [],
    transmission: [],
    price_range: [0, 500],
    available_only: false,
  })
  const [currentPage, setCurrentPage] = useState(1)


  const totalPages = Math.ceil(cars.length / CARS_PER_PAGE)
  const startIndex = (currentPage - 1) * CARS_PER_PAGE
  const paginatedCars = cars.slice(startIndex, startIndex + CARS_PER_PAGE)

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  return (
    <>
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900  relative">
      <Navbar/>
      <div className="relative top-15 z-10">
        {/* Main Content */}
        <div className="container mx-auto px-4 py-8">
          <div className="flex gap-8">
            {/* Sidebar */}
            <FilterSidebar filters={filters} onFiltersChange={setFilters} />

            {/* Main Content */}
            <div className="flex-1">
              <div className="mb-6">
                <h2 className="text-3xl font-bold text-white mb-2">Available Cars</h2>
                <p className="text-gray-300">Choose from our premium collection of vehicles</p>
              </div>

              {/* Car Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {paginatedCars.map((car) => (
                  <VehicleCard key={car._id} car={car} />
                ))}
              </div>

              {/* No Results */}
              {cars.length === 0 && (
                <div className="text-center py-12">
                  <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8 max-w-md mx-auto">
                    <h3 className="text-xl font-semibold text-white mb-2">No cars found</h3>
                    <p className="text-gray-300">Try adjusting your filters to see more results.</p>
                  </div>
                </div>
              )}

              {/* Pagination */}
              {cars.length > 0 && (
                <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  )
}

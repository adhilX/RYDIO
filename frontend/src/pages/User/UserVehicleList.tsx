import { useState, useMemo } from "react"
import type { Car, FilterState } from "@/Types/User/carType"
import { FilterSidebar } from "@/components/user/FilterSidebar"
import { VehicleCard } from "@/components/user/VehicleCard"
import Pagination from "@/components/Pagination"
import Navbar from "@/components/user/Navbar"

// Mock data
const mockCars: Car[] = [
  {
    id: "1",
    name: "Model S",
    brand: "Tesla",
    price_per_day: 120,
    fuel_type: "electric",
    seats: 5,
    car_type: "sedan",
    automatic: true,
    is_available: true,
    image_urls: ["/placeholder.svg?height=200&width=300"],
    rating: 4.8,
    reviews: 124,
  },
  {
    id: "2",
    name: "Mustang GT",
    brand: "Ford",
    price_per_day: 95,
    fuel_type: "petrol",
    seats: 4,
    car_type: "sports",
    automatic: true,
    is_available: true,
    image_urls: ["/placeholder.svg?height=200&width=300"],
    rating: 4.6,
    reviews: 89,
  },
  {
    id: "3",
    name: "X5",
    brand: "BMW",
    price_per_day: 110,
    fuel_type: "diesel",
    seats: 7,
    car_type: "suv",
    automatic: true,
    is_available: true,
    image_urls: ["/placeholder.svg?height=200&width=300"],
    rating: 4.7,
    reviews: 156,
  },
  {
    id: "4",
    name: "Civic",
    brand: "Honda",
    price_per_day: 45,
    fuel_type: "petrol",
    seats: 5,
    car_type: "sedan",
    automatic: false,
    is_available: true,
    image_urls: ["/placeholder.svg?height=200&width=300"],
    rating: 4.3,
    reviews: 67,
  },
  {
    id: "5",
    name: "Corolla",
    brand: "Toyota",
    price_per_day: 40,
    fuel_type: "petrol",
    seats: 5,
    car_type: "sedan",
    automatic: true,
    is_available: true,
    image_urls: ["/placeholder.svg?height=200&width=300"],
    rating: 4.4,
    reviews: 92,
  },
  {
    id: "6",
    name: "Wrangler",
    brand: "Jeep",
    price_per_day: 85,
    fuel_type: "petrol",
    seats: 5,
    car_type: "suv",
    automatic: true,
    is_available: true,
    image_urls: ["/placeholder.svg?height=200&width=300"],
    rating: 4.5,
    reviews: 78,
  },
]

const CARS_PER_PAGE = 6

export default function UserVehileList() {
  const [filters, setFilters] = useState<FilterState>({
    fuel_types: [],
    seats: [],
    car_types: [],
    transmission: [],
    price_range: [0, 500],
    available_only: false,
  })
  const [currentPage, setCurrentPage] = useState(1)

  const filteredCars = useMemo(() => {
    return mockCars.filter((car) => {
      // Fuel type filter
      if (filters.fuel_types.length > 0 && !filters.fuel_types.includes(car.fuel_type)) {
        return false
      }

      // Seats filter
      if (filters.seats.length > 0 && !filters.seats.includes(car.seats)) {
        return false
      }

      // Car type filter
      if (filters.car_types.length > 0 && !filters.car_types.includes(car.car_type)) {
        return false
      }

      // Transmission filter
      if (filters.transmission.length > 0) {
        const isAutomatic = car.automatic
        const hasAutomatic = filters.transmission.includes("automatic")
        const hasManual = filters.transmission.includes("manual")

        if (hasAutomatic && hasManual) {
          // Both selected, show all
        } else if (hasAutomatic && !isAutomatic) {
          return false
        } else if (hasManual && isAutomatic) {
          return false
        }
      }

      // Price range filter
      if (car.price_per_day < filters.price_range[0] || car.price_per_day > filters.price_range[1]) {
        return false
      }

      // Available only filter
      if (filters.available_only && !car.is_available) {
        return false
      }

      return true
    })
  }, [filters])

  const totalPages = Math.ceil(filteredCars.length / CARS_PER_PAGE)
  const startIndex = (currentPage - 1) * CARS_PER_PAGE
  const paginatedCars = filteredCars.slice(startIndex, startIndex + CARS_PER_PAGE)

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
                  <VehicleCard key={car.id} car={car} />
                ))}
              </div>

              {/* No Results */}
              {filteredCars.length === 0 && (
                <div className="text-center py-12">
                  <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8 max-w-md mx-auto">
                    <h3 className="text-xl font-semibold text-white mb-2">No cars found</h3>
                    <p className="text-gray-300">Try adjusting your filters to see more results.</p>
                  </div>
                </div>
              )}

              {/* Pagination */}
              {filteredCars.length > 0 && (
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

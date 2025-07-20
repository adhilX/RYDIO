import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Input } from "@/components/ui/input"
import { Filter, X, RotateCcw, Search } from "lucide-react"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetClose } from "@/components/ui/sheet"
import { Separator } from "@/components/ui/separator"
import type { FilterState } from "@/Types/User/carType"

interface FilterSidebarProps {
  filters: FilterState & { search?: string }
  onFiltersChange: (filters: FilterState & { search?: string }) => void
}

export function FilterSidebar({ filters, onFiltersChange }: FilterSidebarProps) {
  const [isOpen, setIsOpen] = useState(false)

  const handleFilterChange = (key: keyof (FilterState & { search?: string }), value: string | number | (string | number)[]) => {
    onFiltersChange({ ...filters, [key]: value })
  }

  const handleArrayFilterChange = (key: keyof FilterState, value: string | number, checked: boolean) => {
    const currentArray = filters[key] as (string | number)[]
    if (checked) {
      handleFilterChange(key, [...currentArray, value])
    } else {
      handleFilterChange(
        key,
        currentArray.filter((item) => item !== value),
      )
    }
  }

  const clearFilters = () => {
    onFiltersChange({
      search: "",
      fuel_types: [],
      seats: [],
      car_types: [],
      transmission: [],
      price_range: [0, 500],
      available_only: false,
    })
  }

  const getActiveFiltersCount = () => {
    let count = 0
    if (filters.search && filters.search.trim() !== "") count++
    if (filters.fuel_types.length > 0) count++
    if (filters.seats.length > 0) count++
    if (filters.car_types.length > 0) count++
    if (filters.transmission.length > 0) count++
    if (filters.price_range[0] > 0 || filters.price_range[1] < 500) count++
    if (filters.available_only) count++
    return count
  }

  const FilterContent = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h2 className="text-lg font-semibold text-white">Filters</h2>
          {getActiveFiltersCount() > 0 && (
            <span className="bg-blue-600 text-white text-xs font-medium px-2 py-1 rounded-full">
              {getActiveFiltersCount()}
            </span>
          )}
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={clearFilters}
          className="text-gray-300 hover:text-white hover:bg-white/10 h-8 px-2 text-sm"
          disabled={getActiveFiltersCount() === 0}
        >
          <RotateCcw className="w-3 h-3 mr-1" />
          Clear
        </Button>
      </div>

      <Separator className="bg-white/20" />

      {/* Search Bar */}
      <div className="space-y-3">
        <Label className="text-sm font-medium text-gray-300">Search Cars</Label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search by make, model, or features..."
            value={filters.search || ""}
            onChange={(e) => handleFilterChange("search", e.target.value)}
            className="pl-10 bg-white/5 border-white/20 text-white placeholder:text-gray-400 focus:border-blue-500"
          />
        </div>
      </div>

      {/* Price Range */}
      <div className="space-y-3">
        <Label className="text-sm font-medium text-gray-300">Price Range (per day)</Label>
        <div className="bg-white/5 rounded-lg p-4 border border-white/10">
          <Slider
            value={filters.price_range}
            onValueChange={(value) => handleFilterChange("price_range", value as [number, number])}
            max={500}
            min={0}
            step={10}
            className="w-full"
          />
          <div className="flex justify-between text-sm text-gray-300 mt-3">
            <span className="font-medium bg-white/10 px-2 py-1 rounded">${filters.price_range[0]}</span>
            <span className="font-medium bg-white/10 px-2 py-1 rounded">${filters.price_range[1]}</span>
          </div>
        </div>
      </div>

      {/* Fuel Type */}
      <div className="space-y-3">
        <Label className="text-sm font-medium text-gray-300">Fuel Type</Label>
        <div className="bg-white/5 rounded-lg p-3 border border-white/10">
          <div className="space-y-2">
            {[
              { value: "petrol", label: "Petrol" },
              { value: "diesel", label: "Diesel" },
              { value: "electric", label: "Electric" },
            ].map((fuel) => (
              <div key={fuel.value} className="flex items-center space-x-3">
                <Checkbox
                  id={fuel.value}
                  checked={filters.fuel_types.includes(fuel.value)}
                  onCheckedChange={(checked) => handleArrayFilterChange("fuel_types", fuel.value, checked as boolean)}
                  className="border-white/30 data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500"
                />
                <Label 
                  htmlFor={fuel.value} 
                  className="text-sm text-gray-300 cursor-pointer font-normal"
                >
                  {fuel.label}
                </Label>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Seats */}
      <div className="space-y-3">
        <Label className="text-sm font-medium text-gray-300">Number of Seats</Label>
        <div className="bg-white/5 rounded-lg p-3 border border-white/10">
          <div className="grid grid-cols-2 gap-2">
            {[2, 4, 5, 7].map((seat) => (
              <div key={seat} className="flex items-center space-x-2">
                <Checkbox
                  id={`seat-${seat}`}
                  checked={filters.seats.includes(seat)}
                  onCheckedChange={(checked) => handleArrayFilterChange("seats", seat, checked as boolean)}
                  className="border-white/30 data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500"
                />
                <Label 
                  htmlFor={`seat-${seat}`} 
                  className="text-sm text-gray-300 cursor-pointer font-normal"
                >
                  {seat} seats
                </Label>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Car Type */}
      <div className="space-y-3">
        <Label className="text-sm font-medium text-gray-300">Vehicle Type</Label>
        <div className="bg-white/5 rounded-lg p-3 border border-white/10">
          <div className="space-y-2">
            {[
              { value: "sedan", label: "Sedan" },
              { value: "hatchback", label: "Hatchback" },
              { value: "xuv", label: "XUV" },
              { value: "suv", label: "SUV" },
              { value: "sports", label: "Sports" },
            ].map((type) => (
              <div key={type.value} className="flex items-center space-x-3">
                <Checkbox
                  id={type.value}
                  checked={filters.car_types.includes(type.value)}
                  onCheckedChange={(checked) => handleArrayFilterChange("car_types", type.value, checked as boolean)}
                  className="border-white/30 data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500"
                />
                <Label 
                  htmlFor={type.value} 
                  className="text-sm text-gray-300 cursor-pointer font-normal"
                >
                  {type.label}
                </Label>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Transmission */}
      <div className="space-y-3">
        <Label className="text-sm font-medium text-gray-300">Transmission</Label>
        <div className="bg-white/5 rounded-lg p-3 border border-white/10">
          <div className="space-y-2">
            {[
              { value: "automatic", label: "Automatic" },
              { value: "manual", label: "Manual" },
            ].map((trans) => (
              <div key={trans.value} className="flex items-center space-x-3">
                <Checkbox
                  id={trans.value}
                  checked={filters.transmission.includes(trans.value)}
                  onCheckedChange={(checked) =>
                    handleArrayFilterChange("transmission", trans.value, checked as boolean)
                  }
                  className="border-white/30 data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500"
                />
                <Label 
                  htmlFor={trans.value} 
                  className="text-sm text-gray-300 cursor-pointer font-normal"
                >
                  {trans.label}
                </Label>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Available Only */}
      <div className="bg-green-500/10 rounded-lg p-3 border border-green-500/20">
        <div className="flex items-center space-x-3">
          <Checkbox
            id="available"
            checked={filters.available_only}
            onCheckedChange={(checked) => handleFilterChange("available_only", checked)}
            className="border-white/30 data-[state=checked]:bg-green-500 data-[state=checked]:border-green-500"
          />
          <Label 
            htmlFor="available" 
            className="text-sm text-green-300 cursor-pointer font-normal"
          >
            Show available cars only
          </Label>
        </div>
      </div>
    </div>
  )

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:block w-80 h-fit sticky top-6">
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6 shadow-xl">
          <FilterContent />
        </div>
      </div>

      {/* Mobile Filter Button */}
      <div className="lg:hidden fixed bottom-6 right-6 z-50">
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button
              size="lg"
              className="rounded-full bg-blue-600 hover:bg-blue-700 shadow-lg hover:shadow-xl transition-all duration-200 relative"
            >
              <Filter className="w-5 h-5 mr-2" />
              Filters
              {getActiveFiltersCount() > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-medium">
                  {getActiveFiltersCount()}
                </span>
              )}
            </Button>
          </SheetTrigger>
          <SheetContent 
            side="left" 
            className="bg-black/95 backdrop-blur-md border-white/20 w-80 overflow-y-auto"
          >
            <SheetHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <SheetTitle className="text-white text-lg font-semibold">
                Filter Cars
              </SheetTitle>
              <SheetClose asChild>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-gray-300 hover:text-white hover:bg-white/10 h-8 w-8 p-0"
                >
                  <X className="w-4 h-4" />
                </Button>
              </SheetClose>
            </SheetHeader>
            <div className="mt-6">
              <FilterContent />
            </div>
            <div className="sticky bottom-0 bg-black/95 pt-4 mt-6 border-t border-white/20">
              <SheetClose asChild>
                <Button
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                  onClick={() => setIsOpen(false)}
                >
                  Apply Filters
                </Button>
              </SheetClose>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </>
  )
}
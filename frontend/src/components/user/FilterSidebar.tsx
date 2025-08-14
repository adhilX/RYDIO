import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
// import { Select, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Filter, X, RotateCcw, Search } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetClose } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import type { FilterState } from "@/Types/User/carType";

export type SortOption = 'price_low_high' | 'price_high_low' | 'distance' | 'rating' | 'newest' | 'oldest';

interface FilterSidebarProps {
  filters: FilterState & { search?: string; sortBy?: SortOption };
  onFiltersChange: (filters: FilterState & { search?: string; sortBy?: SortOption }) => void;
}

// Define sort options outside component to prevent recreation
// const SORT_OPTIONS = [
//   { value: 'price_low_high' as SortOption, label: 'Price: Low to High' },
  // { value: 'price_high_low' as SortOption, label: 'Price: High to Low' },
  // { value: 'distance' as SortOption, label: 'Distance: Nearest First' },
  // { value: 'rating' as SortOption, label: 'Rating: Highest First' },
  // { value: 'newest' as SortOption, label: 'Newest First' },
  // { value: 'oldest' as SortOption, label: 'Oldest First' },
// ];

// Define filter option arrays outside component
const FUEL_TYPE_OPTIONS = [
  { value: "petrol", label: "Petrol" },
  { value: "diesel", label: "Diesel" },
  { value: "electric", label: "Electric" },
];

const SEAT_OPTIONS = [2, 4, 5, 7].map((seat) => ({ value: seat, label: `${seat} seats` }));

const CAR_TYPE_OPTIONS = [
  { value: "sedan", label: "Sedan" },
  { value: "hatchback", label: "Hatchback" },
  { value: "xuv", label: "XUV" },
  { value: "suv", label: "SUV" },
  { value: "sports", label: "Sports" },
];

const TRANSMISSION_OPTIONS = [
  { value: "true", label: "Automatic" },
  { value: "false", label: "Manual" },
];

const FilterSidebar: React.FC<FilterSidebarProps> = ({ filters, onFiltersChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchValue, setSearchValue] = useState(filters.search || "");
  const searchValueRef = useRef(searchValue);
  const isInitialMount = useRef(true);
  const filtersRef = useRef(filters);
  const onFiltersChangeRef = useRef(onFiltersChange);

  // Update refs to latest values
  useEffect(() => {
    filtersRef.current = filters;
    onFiltersChangeRef.current = onFiltersChange;
  });

  useEffect(() => {
    if (filters.search !== searchValueRef.current) {
      setSearchValue(filters.search || "");
      searchValueRef.current = filters.search || "";
    }
  }, [filters.search]);

  // Debounce search input - using refs to prevent infinite re-renders
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    
    const handler = setTimeout(() => {
      if (searchValue !== filtersRef.current.search) {
        onFiltersChangeRef.current({ ...filtersRef.current, search: searchValue });
      }
    }, 500);
    
    return () => clearTimeout(handler);
  }, [searchValue]);

  // Memoize update functions to prevent recreation
  const updateFilters = useCallback((key: keyof (FilterState & { search?: string; sortBy?: SortOption }), value: string | number | (string | number)[] | SortOption) => {
    onFiltersChange({ ...filters, [key]: value });
  }, [filters, onFiltersChange]);

  const toggleArrayFilter = useCallback((key: keyof FilterState, value: string | number, checked: boolean) => {
    const currentArray = filters[key] as (string | number)[];
    const newArray = checked ? [...currentArray, value] : currentArray.filter((item) => item !== value);
    updateFilters(key, newArray);
  }, [filters, updateFilters]);

  // Memoize clear filters function
  const clearFilters = useCallback(() => {
    setSearchValue("");
    onFiltersChange({
      search: "",
      fuel_types: [],
      seats: [],
      car_types: [],
      transmission: [],
      price_range: [0, 10000],
      distance_range: 100,
      available_only: false,
      sortBy: undefined,
    });
  }, [onFiltersChange]);

  // Memoize active filter count calculation
  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (filters.search?.trim()) count++;
    if (filters.fuel_types.length) count++;
    if (filters.seats.length) count++;
    if (filters.car_types.length) count++;
    if (filters.transmission.length) count++;
    if (filters.price_range[0] > 0 || filters.price_range[1] < 10000) count++;
    if (filters.available_only) count++;
    return count;
  }, [filters]);

  // Memoize CheckboxGroup component to prevent recreation
  const CheckboxGroup = useCallback(({
    label,
    items,
    filterKey,
  }: {
    label: string;
    items: { value: string | number; label: string }[];
    filterKey: keyof FilterState;
  }) => (
    <div className="space-y-3">
      <Label className="text-sm font-medium text-gray-300">{label}</Label>
      <div className="bg-white/5 rounded-lg p-3 border border-white/10">
        <div className={filterKey === "seats" ? "grid grid-cols-2 gap-2" : "space-y-2"}>
          {items.map((item) => (
            <div key={item.value} className="flex items-center space-x-3">
              <Checkbox
                id={`${filterKey}-${item.value}`}
                checked={(filters[filterKey] as (string | number)[]).includes(item.value)}
                onCheckedChange={(checked) => toggleArrayFilter(filterKey, item.value, checked as boolean)}
                className="border-white/30 data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500"
              />
              <Label htmlFor={`${filterKey}-${item.value}`} className="text-sm text-gray-300 cursor-pointer font-normal">
                {item.label}
              </Label>
            </div>
          ))}
        </div>
      </div>
    </div>
  ), [filters, toggleArrayFilter]);

  // Memoize FilterContent component to prevent recreation
  const FilterContent = useCallback(() => (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h2 className="text-lg font-semibold text-white">Filters</h2>
          {activeFiltersCount > 0 && (
            <span className="bg-blue-600 text-white text-xs font-medium px-2 py-1 rounded-full">
              {activeFiltersCount}
            </span>
          )}
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={clearFilters}
          className="text-gray-300 hover:text-white hover:bg-white/10 h-8 px-2 text-sm"
          disabled={activeFiltersCount === 0}
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
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                searchValueRef.current = searchValue;
                onFiltersChange({ ...filters, search: searchValue });
              }
            }}
            className="pl-10 bg-white/5 border-white/20 text-white placeholder:text-gray-400 focus:border-blue-500"
          />
        </div>
      </div>

      {/* Sort Options */}
      {/* <div className="space-y-3">
        <Label className="text-sm font-medium text-gray-300">Sort By</Label>
        <div className="bg-white/5 rounded-lg p-3 border border-white/10">
          <Select
            value={filters.sortBy || ''}
            onValueChange={(value) => updateFilters('sortBy', value as SortOption)}
          >
            <SelectTrigger className="bg-transparent border-white/20 text-white focus:border-blue-500">
              <div className="flex items-center gap-2">
                <ArrowUpDown className="w-4 h-4 text-gray-400" />
                <SelectValue placeholder="Select sorting option" />
              </div>
            </SelectTrigger> */}
            {/* <SelectContent className="bg-gray-900 border-white/20">
              {SORT_OPTIONS.map((option) => (
                <SelectItem 
                  key={option.value} 
                  value={option.value}
                  className="text-white hover:bg-white/10 focus:bg-white/10"
                >
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent> */}
          {/* </Select>
        </div>
      </div> */}

      {/* Filter Groups */}
      <CheckboxGroup
        label="Fuel Type"
        filterKey="fuel_types"
        items={FUEL_TYPE_OPTIONS}
      />
      <CheckboxGroup
        label="Number of Seats"
        filterKey="seats"
        items={SEAT_OPTIONS}
      />
      <CheckboxGroup
        label="Vehicle Type"
        filterKey="car_types"
        items={CAR_TYPE_OPTIONS}
      />
      <CheckboxGroup
        label="Transmission"
        filterKey="transmission"
        items={TRANSMISSION_OPTIONS}
      />
    </div>
  ), [activeFiltersCount, clearFilters, searchValue, filters, onFiltersChange, CheckboxGroup]);

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
              {activeFiltersCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-medium">
                  {activeFiltersCount}
                </span>
              )}
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="bg-black/95 backdrop-blur-md border-white/20 w-80 overflow-y-auto">
            <SheetHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <SheetTitle className="text-white text-lg font-semibold">Filter Cars</SheetTitle>
              <SheetClose asChild>
                <Button variant="ghost" size="sm" className="text-gray-300 hover:text-white hover:bg-white/10 h-8 w-8 p-0">
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
                  onClick={()=> setIsOpen(false)}
                >
                  Apply Filters
                </Button>
              </SheetClose>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
};

export default React.memo(FilterSidebar);
import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';

const carTypes = ['sedan', 'hateback', 'xuv', 'suv', 'sports'];
const brands = ['Tesla', 'BMW', 'Audi', 'Toyota', 'Honda'];
const fuelTypes = ['petrol', 'diesel', 'electric'];
const seatOptions = [2, 4, 5, 7];

export default function FilterSidebar() {
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedBrand, setSelectedBrand] = useState('');
  const [selectedFuel, setSelectedFuel] = useState('');
  const [selectedSeats, setSelectedSeats] = useState<number | null>(null);
  const [priceRange, setPriceRange] = useState([1000, 5000]);

  return (
    <div className="p-6 flex flex-col gap-8">
      <Card className="bg-white/5 border-white/10 shadow-lg rounded-xl p-4">
        <div className="mb-4 text-lg font-bold text-[#6DA5C0]">Filter Vehicles</div>
        {/* Car Type */}
        <div className="mb-4">
          <div className="font-semibold text-white mb-2">Car Type</div>
          <div className="flex flex-wrap gap-2">
            {carTypes.map(type => (
              <label key={type} className="flex items-center gap-2 text-gray-200 text-sm">
                <Checkbox
                  checked={selectedTypes.includes(type)}
                  onCheckedChange={checked => {
                    setSelectedTypes(checked ? [...selectedTypes, type] : selectedTypes.filter(t => t !== type));
                  }}
                />
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </label>
            ))}
          </div>
        </div>
        {/* Brand */}
        <div className="mb-4">
          <div className="font-semibold text-white mb-2">Brand</div>
          <Select value={selectedBrand} onValueChange={setSelectedBrand}>
            <SelectTrigger className="w-full bg-white/10 border-white/20 text-white">
              <SelectValue placeholder="Select brand" />
            </SelectTrigger>
            <SelectContent>
              {brands.map(brand => (
                <SelectItem key={brand} value={brand}>{brand}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        {/* Fuel Type */}
        <div className="mb-4">
          <div className="font-semibold text-white mb-2">Fuel Type</div>
          <Select value={selectedFuel} onValueChange={setSelectedFuel}>
            <SelectTrigger className="w-full bg-white/10 border-white/20 text-white">
              <SelectValue placeholder="Select fuel type" />
            </SelectTrigger>
            <SelectContent>
              {fuelTypes.map(fuel => (
                <SelectItem key={fuel} value={fuel}>{fuel.charAt(0).toUpperCase() + fuel.slice(1)}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        {/* Seats */}
        <div className="mb-4">
          <div className="font-semibold text-white mb-2">Seats</div>
          <Select value={selectedSeats ? String(selectedSeats) : ''} onValueChange={val => setSelectedSeats(Number(val))}>
            <SelectTrigger className="w-full bg-white/10 border-white/20 text-white">
              <SelectValue placeholder="Select seats" />
            </SelectTrigger>
            <SelectContent>
              {seatOptions.map(seat => (
                <SelectItem key={seat} value={String(seat)}>{seat} seats</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        {/* Price Range */}
        <div className="mb-2">
          <div className="font-semibold text-white mb-2">Price Range (9{priceRange[0]} - 9{priceRange[1]})</div>
          <Slider
            min={500}
            max={10000}
            value={priceRange}
            onValueChange={setPriceRange}
            className="mt-2"
          />
        </div>
      </Card>
    </div>
  );
} 
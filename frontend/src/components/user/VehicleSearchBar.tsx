import { useEffect, useState } from "react";
import { Calendar, MapPin, Search, Sparkles } from "lucide-react";
import { Card } from "../ui/card";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { fetchLocationSuggestions } from "@/services/user/locationService";

// Type for suggestions
interface Suggestion {
  display_name: string;
  lat: number;
  lon: number;
}

interface VehicleSearchBarProps {
  isFormComplete: boolean;
  location: string;
  setLocation: (value: string) => void;
  setNewLocation: ({latitude, longitude}: { latitude : number; longitude: number }) => void;
  pickupDate: string;
  handleDateChange: (setter: (value: string) => void, value: string) => void;
  setPickupDate: (value: string) => void;
  returnDate: string;
  handleVehicleSearch: () => void;
  setReturnDate: (value: string) => void;
  showSparkles: boolean;
}

function VehicleSearchBar({
  isFormComplete,
  location,
  setNewLocation,
  setLocation,
  pickupDate,
  handleDateChange,
  setPickupDate,
  returnDate,
  handleVehicleSearch,
  setReturnDate,
  showSparkles,
}: VehicleSearchBarProps) {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [debouncedLocation, setDebouncedLocation] = useState(location);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedLocation(location);
    }, 400);
    return () => clearTimeout(handler);
  }, [location]);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (!debouncedLocation.trim()) {
        setSuggestions([]);
        setShowSuggestions(false);
        return;
      }
       const mapped = await  fetchLocationSuggestions(debouncedLocation)
        setSuggestions(mapped);
        setShowSuggestions(true);
    };

    fetchSuggestions();
  }, [debouncedLocation]);

  const handleSuggestionClick = (suggestion: Suggestion) => {
    setLocation(suggestion.display_name);
    setNewLocation({ latitude: suggestion.lat, longitude: suggestion.lon });
    setShowSuggestions(false);
  };

  return (
    <div className="max-w-7xl mx-auto mt-20 mb-16 relative">
      <Card
        className={`max-w-6xl mx-auto p-8  rounded-2xl shadow-2xl bg-white/10 backdrop-blur-md border-white/20 transition-all duration-500 ${
          isFormComplete ? "ring-2 ring-white/50 shadow-white/20" : ""
        }`}
      >
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Location */}
          <div className="relative group">
            <label className="block text-sm font-medium text-gray-200 mb-2">
              Pick-up Location
            </label>
            <div className="relative">
              <Input
                type="text"
                placeholder="Enter city or airport"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="pl-12 h-14 rounded-xl border-2 border-white/30 focus:border-white transition-all duration-300 hover:scale-[1.02] text-lg bg-white/10 backdrop-blur-sm text-white placeholder:text-gray-300"
              />
              <MapPin
                className={`absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-300 transition-all duration-300 ${
                  location ? "animate-bounce text-white" : ""
                }`}
                size={20}
              />
              {showSuggestions && suggestions.length > 0 && (
                <ul className="absolute z-10 mt-2 bg-white text-black rounded-lg shadow-lg w-full max-h-40 overflow-y-auto border border-gray-200">
                  {suggestions.map((s, i) => (
                    <li
                      key={i}
                      onClick={() => handleSuggestionClick(s)}
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                    >
                      {s.display_name}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          {/* Pickup Date */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-200 mb-2">
              Pick-up Date
            </label>
            <div className="relative">
              <Input
                type="date"
                value={pickupDate}
                onChange={(e) =>
                  handleDateChange(setPickupDate, e.target.value)
                }
                className="pl-12 h-14 rounded-xl border-2 border-white/30 focus:border-white transition-all duration-300 hover:scale-[1.02] text-lg bg-white/10 backdrop-blur-sm text-white"
              />
              <Calendar
                className={`absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-300 transition-all duration-300 ${
                  pickupDate ? "animate-pulse text-white" : ""
                }`}
                size={20}
              />
            </div>
          </div>

          {/* Return Date */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-200 mb-2">
              Return Date
            </label>
            <div className="relative">
              <Input
                type="date"
                value={returnDate}
                onChange={(e) =>
                  handleDateChange(setReturnDate, e.target.value)
                }
                className="pl-12 h-14 rounded-xl border-2 border-white/30 focus:border-white transition-all duration-300 hover:scale-[1.02] text-lg bg-white/10 backdrop-blur-sm text-white"
              />
              <Calendar
                className={`absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-300 transition-all duration-300 ${
                  returnDate ? "animate-pulse text-white" : ""
                }`}
                size={20}
              />
            </div>
          </div>

          {/* Search Button */}
          <div className="flex items-end">
            <Button
              className="w-full h-14 bg-white hover:bg-gray-200 text-black rounded-xl text-lg font-semibold transition-all duration-300 hover:scale-105 active:rotate-3 transform cursor-pointer shadow-lg hover:shadow-xl"
              onClick={handleVehicleSearch}
            >
              <Search className="mr-2" size={20} />
              Search Cars
            </Button>
          </div>
        </div>

        {/* Sparkles */}
        {showSparkles && (
          <div className="absolute inset-0 pointer-events-none">
            <Sparkles
              className="absolute top-4 right-4 text-white animate-ping"
              size={16}
            />
            <Sparkles
              className="absolute bottom-4 left-4 text-white animate-ping animation-delay-200"
              size={12}
            />
            <Sparkles
              className="absolute top-1/2 left-1/2 text-white animate-ping animation-delay-400"
              size={14}
            />
          </div>
        )}
      </Card>
    </div>
  );
}

export default VehicleSearchBar;

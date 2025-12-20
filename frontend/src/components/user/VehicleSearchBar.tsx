import { useEffect, useState, useCallback } from "react";
import { Calendar, MapPin, Search, Sparkles, AlertCircle } from "lucide-react";
import { Card } from "../ui/card";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { fetchLocationSuggestions, findLocation } from "@/services/user/locationService";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "@/store/store";
import { useNavigate } from "react-router";
import toast from "react-hot-toast";
import type { SearchParams, LocationCoords } from "@/Types/User/searchTypes";
import React from "react";
import { setSearchDate } from "@/store/slice/user/SearchDateSlice";
import { Spinner } from "@/components/ui/spinner";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

// Type for location suggestions
interface Suggestion {
  display_name: string;
  lat: number;
  lon: number;
}

function VehicleSearchBar() {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [locationInput, setLocationInput] = useState('');
  const [selectedLocation, setSelectedLocation] = useState<LocationCoords | null>(null);
  const [showSparkles, setShowSparkles] = useState(false);
  const [pickupDate, setPickupDate] = useState('');
  const [returnDate, setReturnDate] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useSelector((state: RootState) => state.location);
  const user = useSelector((state: RootState) => state.auth.user);
  const dates = useSelector((state: RootState) => state.searchDate.searchDate);
  // Set initial location from Redux store if available
  useEffect(() => {
    const getCurrentLocation = async () => {
      if (location.latitude && location.longitude) {
        try {
          setIsLoading(true);
          if (dates.startDate) setPickupDate(dates.startDate);
          if (dates.endDate) setReturnDate(dates.endDate);

          const data = await findLocation(location.latitude, location.longitude);
          if (data.display_name) {
            setLocationInput(data.display_name);
            setSelectedLocation({
              latitude: location.latitude,
              longitude: location.longitude
            });
          }
        } catch (error) {
          console.error('Error fetching location details:', error);
          toast.error('Failed to load your current location');
        } finally {
          setIsLoading(false);
        }
      }
    };

    getCurrentLocation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.latitude, location.longitude]);

  // Validate search parameters
  const validateSearch = (): { isValid: boolean; error?: string } => {
    if (!selectedLocation) {
      return { isValid: false, error: 'Please select a location' };
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (!pickupDate) {
      return { isValid: false, error: 'Please select a pickup date' };
    }
    if (!returnDate) {
      return { isValid: false, error: 'Please select a return date' };
    }

    const selectedPickupDate = new Date(pickupDate);
    if (selectedPickupDate < today) {
      return { isValid: false, error: 'Pickup date cannot be in the past' };
    }

    if (returnDate) {
      const selectedReturnDate = new Date(returnDate);
      if (selectedReturnDate <= selectedPickupDate) {
        return { isValid: false, error: 'Return date must be after pickup date' };
      }
    }
    return { isValid: true };
  };

  const handleVehicleSearch = useCallback(async () => {
    const { isValid, error } = validateSearch();
    if (!isValid) {
      toast.error(error || 'Invalid search parameters');
      return;
    }

    if (!user) {
      toast.error('Please login to perform search');
      return;
    }
    setShowSparkles(true);
    setIsLoading(true);

    try {
      const searchParams: SearchParams = {
        latitude: selectedLocation!.latitude,
        longitude: selectedLocation!.longitude,
        pickupDate,
        returnDate
      };

      navigate('/vehicle-list', { state: searchParams, replace: true });
    } catch (error) {
      console.error('Search error:', error);
      toast.error('Failed to perform search. Please try again.');
    } finally {
      const timer = setTimeout(() => {
        setShowSparkles(false);
        setIsLoading(false);
      }, 1000);

      // eslint-disable-next-line no-unsafe-finally
      return () => clearTimeout(timer);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedLocation, pickupDate, returnDate, navigate]);

  // Handle location input changes with debounce
  useEffect(() => {
    const handler = setTimeout(() => {
      if (locationInput.trim()) {
        fetchLocationSuggestions(locationInput)
          .then(mapped => {
            setSuggestions(mapped);
            setShowSuggestions(true);
          })
          .catch(error => {
            console.error('Error fetching suggestions:', error);
            toast.error('Failed to fetch location suggestions');
          });
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    }, 500);

    return () => clearTimeout(handler);
  }, [locationInput]);

  const handleSuggestionClick = useCallback((suggestion: Suggestion) => {
    setLocationInput(suggestion.display_name);
    setSelectedLocation({
      latitude: suggestion.lat,
      longitude: suggestion.lon
    });
    setShowSuggestions(false);
    setShowSparkles(true);
    setError(null);

    const timer = setTimeout(() => setShowSparkles(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleDateChange = useCallback((setter: (value: string) => void, value: string) => {
    setter(value);
    if (setter == setPickupDate) {
      dispatch(setSearchDate({ startDate: value }));
    }
    else if (setter == setReturnDate) {
      dispatch(setSearchDate({ endDate: value }));
    }
    setShowSparkles(true);
    setError(null);
    const timer = setTimeout(() => setShowSparkles(false), 1000);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Set minimum date for date pickers to today
  // const today = new Date().toISOString().split('T')[0];

  return (
    <div className="max-w-7xl mx-auto mt-20 mb-16 relative z-50">
      <Card
        className={`max-w-6xl mx-auto p-8 rounded-2xl shadow-2xl bg-black/40 backdrop-blur-md border-white/10 transition-all duration-500 ${showSparkles ? 'ring-2 ring-white/50' : ''
          }`}
      >
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Location */}
          <div className="relative group z-50">
            <label className="block text-sm font-medium text-gray-200 mb-2">
              Pick-up Location
            </label>
            <div className="relative">
              <Input
                type="text"
                placeholder="Enter city or airport"
                value={locationInput}
                onChange={(e) => {
                  setLocationInput(e.target.value);
                  setError(null);
                }}
                disabled={isLoading}
                className={`pl-12 h-14 rounded-xl border-2 ${error && !selectedLocation ? 'border-red-400' : 'border-white/10 focus:border-white'
                  } transition-all duration-300 hover:scale-[1.02] text-lg bg-black/40 backdrop-blur-sm text-white placeholder:text-gray-400`}
              />
              <MapPin
                className={`absolute left-4 top-1/2 transform -translate-y-1/2 transition-all duration-300 ${selectedLocation ? 'text-white animate-bounce' : 'text-gray-300'
                  }`}
                size={20}
              />
              {showSuggestions && suggestions.length > 0 && (
                <ul className="absolute z-[100] mt-2 bg-black/95 backdrop-blur-xl text-white rounded-xl shadow-2xl w-full max-h-60 overflow-y-auto border border-white/20 animate-in fade-in slide-in-from-top-2 duration-200 custom-scrollbar">
                  {suggestions.map((suggestion, i) => (
                    <li
                      key={i}
                      onClick={() => handleSuggestionClick(suggestion)}
                      className="px-4 py-3 hover:bg-white/10 cursor-pointer text-sm transition-all duration-200 border-b border-white/5 last:border-b-0 flex items-start gap-3 group hover:pl-5"
                    >
                      <MapPin className="flex-shrink-0 mt-0.5 text-gray-400 group-hover:text-white transition-colors duration-200" size={16} />
                      <span className="text-gray-300 group-hover:text-white transition-colors duration-200 leading-relaxed font-semibold">{suggestion.display_name}</span>
                    </li>
                  ))}
                </ul>
              )}
              {error && !selectedLocation && !showSuggestions && (
                <div className="absolute -bottom-6 left-0 text-red-400 text-xs flex items-center">
                  <AlertCircle size={14} className="mr-1" />
                  {error}
                </div>
              )}
            </div>
          </div>

          {/* Pickup Date */}
          <div className="relative z-40">
            <label className="block text-sm font-medium text-gray-200 mb-2">
              Pick-up Date
            </label>
            <div className="relative">
              <DatePicker
                selected={pickupDate ? new Date(pickupDate) : null}
                onChange={(date: Date | null) => {
                  if (date) {
                    // Adjust to local date string YYYY-MM-DD
                    const offset = date.getTimezoneOffset();
                    const localDate = new Date(date.getTime() - (offset * 60 * 1000));
                    handleDateChange(setPickupDate, localDate.toISOString().split('T')[0]);
                  } else {
                    handleDateChange(setPickupDate, '');
                  }
                }}
                minDate={new Date()}
                placeholderText="Select Date"
                className={`pl-12 w-full h-14 rounded-xl border-2 ${error && !pickupDate ? 'border-red-400' : 'border-white/10 focus:border-white'
                  } transition-all duration-300 hover:scale-[1.02] text-lg bg-black/40 backdrop-blur-sm text-white placeholder:text-gray-400 focus:outline-none`}
                wrapperClassName="w-full"
                dateFormat="MMM dd, yyyy"
              />
              <Calendar
                className={`absolute left-4 top-1/2 transform -translate-y-1/2 transition-all duration-300 ${pickupDate ? 'text-white animate-pulse' : 'text-gray-300'
                  } z-10 pointer-events-none`}
                size={20}
              />
            </div>
          </div>

          {/* Return Date */}
          <div className="relative z-40">
            <label className="block text-sm font-medium text-gray-200 mb-2">
              Return Date
            </label>
            <div className="relative">
              <DatePicker
                selected={returnDate ? new Date(returnDate) : null}
                onChange={(date: Date | null) => {
                  if (date) {
                    const offset = date.getTimezoneOffset();
                    const localDate = new Date(date.getTime() - (offset * 60 * 1000));
                    handleDateChange(setReturnDate, localDate.toISOString().split('T')[0]);
                  } else {
                    handleDateChange(setReturnDate, '');
                  }
                }}
                minDate={pickupDate ? new Date(pickupDate) : new Date()}
                disabled={isLoading || !pickupDate}
                placeholderText="Select Date"
                className={`pl-12 w-full h-14 rounded-xl border-2 ${error && returnDate && new Date(returnDate) <= new Date(pickupDate)
                  ? 'border-red-400'
                  : 'border-white/10 focus:border-white'
                  } transition-all duration-300 hover:scale-[1.02] text-lg bg-black/40 backdrop-blur-sm text-white placeholder:text-gray-400 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed`}
                wrapperClassName="w-full"
                dateFormat="MMM dd, yyyy"
              />
              <Calendar
                className={`absolute left-4 top-1/2 transform -translate-y-1/2 transition-all duration-300 ${returnDate ? 'text-white animate-pulse' : 'text-gray-300'
                  } z-10 pointer-events-none`}
                size={20}
              />
            </div>
          </div>

          {/* Search Button */}
          <div className="flex items-end">
            <Button
              onClick={handleVehicleSearch}
              disabled={isLoading}
              className={`w-full h-14 rounded-xl text-lg font-semibold transition-all duration-300 transform shadow-lg ${isLoading
                ? 'bg-white/50 cursor-not-allowed'
                : 'bg-white hover:bg-gray-200 hover:scale-105 active:rotate-3 hover:shadow-xl text-black'
                }`}
            >
              {isLoading ? (
                <div className="flex items-center">
                  <Spinner size="sm" variant="default" className="mr-2 border-black border-t-transparent" />
                  Searching...
                </div>
              ) : (
                <>
                  <Search className="mr-2" size={20} />
                  Search Cars
                </>
              )}
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

export default React.memo(VehicleSearchBar);

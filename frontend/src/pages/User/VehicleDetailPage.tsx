import { useEffect, useState } from "react";
import { Car, Fuel, Users, Settings, MapPin, Phone, Mail, Calendar, Info } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { MapContainer, Marker, TileLayer, Popup } from "react-leaflet";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format } from "date-fns";
import { getVehicleDetails } from "@/services/user/vehicleService";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";
import type { Vehicle } from "@/Types/User/addVehicle/Ivehicle";
import toast from "react-hot-toast";
import Navbar from "@/components/user/Navbar";
import "leaflet/dist/leaflet.css";
import type { Iuser } from "@/Types/User/Iuser";
import { getBookedDate } from "@/services/user/bookingService";
import { getUser } from "@/services/user/authService";
import { Spinner } from "@/components/ui/spinner";
import L from 'leaflet';

// Fix for default marker icon - Using Red Marker
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import Particles from "@/components/common/Particles";

let DefaultIcon = L.icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

const IMG_URL = import.meta.env.VITE_IMAGE_URL;

const VehicleDetailPage = () => {
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [user, setUser] = useState<Iuser | null>(null);
  const [unavailableDates, setUnavailableDates] = useState<string[]>([]);
  const userId = useSelector((state: RootState) => state.auth.user!);
  const { pathname } = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      const user = await getUser(userId._id);
      setUser(user);
    };
    fetchUser();
    const fetchVehicle = async () => {
      setLoading(true);
      try {
        const id = pathname.split("/")[2];
        const response = await getVehicleDetails(id);
        setVehicle(response);

        const booking = await getBookedDate(id);
        // Normalize all dates to yyyy-MM-dd format for consistent comparison
        // Assuming booking.bookedVehicles returns an array of date strings or Date objects
        const formattedDates = (booking?.bookedVehicles || []).map((date: string | Date) => {
          try {
            return format(new Date(date), 'yyyy-MM-dd');
          } catch (e) {
            console.error("Invalid date format received:", date);
            return null;
          }
        }).filter((date: string | null): date is string => Boolean(date));

        setUnavailableDates(formattedDates);
      } catch (error) {
        console.error("Error fetching vehicle:", error);
        toast.error("Failed to load vehicle details");
      } finally {
        setLoading(false);
      }
    };
    fetchVehicle();
  }, [pathname]);

  // Function to check if a date is available
  const isDateAvailable = (date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    return !unavailableDates.includes(dateStr);
  };

  const calculateTotalPrice = () => {
    if (!startDate || !endDate || !vehicle) return 0;
    const days = Math.ceil(
      (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
    );
    return vehicle.price_per_day * days;
  };

  const handleBookNow = () => {
    if (!startDate || !endDate) {
      toast.error("Please select both start and end dates");
      return;
    }

    if (startDate >= endDate) {
      toast.error("End date must be after start date");
      return;
    }

    const dayMs = 1000 * 60 * 60 * 24;
    const datesBetween = [];

    for (let d = new Date(startDate); d <= endDate; d = new Date(d.getTime() + dayMs)) {
      const formatted = format(d, 'yyyy-MM-dd');
      datesBetween.push(formatted);
    }

    const conflictDates = datesBetween.filter(d => unavailableDates.includes(d));

    if (conflictDates.length > 0) {
      toast.error("Selected date range includes unavailable dates.");
      return;
    }

    if (user?.idproof_id?.status !== 'approved') {
      toast.error("Please submit your ID proof to book a vehicle.");
      navigate("/userProfile");
      return;
    }

    const days = Math.ceil(
      (new Date(endDate).getTime() - new Date(startDate).getTime()) / dayMs
    );
    const totalPrice = vehicle?.price_per_day ? vehicle.price_per_day * days : 0;

    navigate("/booking-confirmation", {
      state: { bookingData: { vehicle, startDate, endDate, total_amount: totalPrice, days } },
    });
  };

  const getFuelIcon = (fuelType: string) => {
    const color = {
      petrol: "text-orange-400",
      diesel: "text-yellow-400",
      electric: "text-green-400",
    }[fuelType] || "text-gray-400";
    return <Fuel className={`w-5 h-5 ${color}`} />;
  };

  const getLocationCoordinates = () => {
    const [lng, lat] = vehicle?.location_id?.location?.coordinates || [];
    return typeof lat === "number" && typeof lng === "number" ? [lat, lng] : [20.5937, 78.9629];
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <Particles className="absolute inset-0 z-0 animate-fade-in" quantity={100} ease={80} refresh />
        <Spinner size="xl" variant="light" />
      </div>
    );
  }

  if (!vehicle) {
    return (
      <div className="min-h-screen flex items-center justify-center text-center bg-[#121212] text-white">
        <div>
          <Car className="w-16 h-16 text-gray-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold">Vehicle not found</h2>
          <p className="text-gray-400">The vehicle you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  const totalPrice = calculateTotalPrice();
  const [lat, lng] = getLocationCoordinates();

  const getDayClassName = (date: Date) => {
    return !isDateAvailable(date) ? "booked-date" : "";
  };

  return (
    <div className="min-h-screen bg-black text-white pb-12">
      <Particles className="absolute inset-0 z-0 animate-fade-in" quantity={100} ease={80} refresh />
      <Navbar />

      <style>{`
        .booked-date {
          color: #ef4444 !important;
          font-weight: bold !important;
          text-decoration: line-through;
        }
        .booked-date:hover {
          background-color: transparent !important;
          cursor: not-allowed !important;
        }
        .react-datepicker__today-button {
          background-color: #000 !important;
          color: #fff !important;
          border-top: 1px solid rgba(255, 255, 255, 0.1) !important;
          padding: 10px 0 !important;
          font-weight: 600 !important;
        }
      `}</style>

      {/* Hero Section / Content Container */}
      <div className="container mx-auto px-4 pt-24 pb-12 max-w-7xl">

        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
          <div className="space-y-1">
            <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">{vehicle.name}</h1>
            <p className="text-xl text-gray-400 font-light flex items-center gap-2">
              <span className="bg-white/10 px-3 py-1 rounded text-sm font-medium border border-white/10">{vehicle.brand}</span>
              <span className="text-gray-500">•</span>
              <span className="text-sm font-mono tracking-wider">{vehicle.registration_number}</span>
            </p>
          </div>
          <div className="flex flex-col items-end gap-2">
            <div className="flex items-center gap-3">
              <span className={`px-4 py-1.5 rounded-full text-sm font-medium border ${vehicle.is_available
                ? "bg-green-500/10 text-green-400 border-green-500/20"
                : "bg-red-500/10 text-red-400 border-red-500/20"
                }`}>
                {vehicle.is_available ? "Available Now" : "Currently Unavailable"}
              </span>
              <div className="text-right">
                <span className="text-3xl font-bold text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.6)]">₹{vehicle.price_per_day.toLocaleString()}</span>
                <span className="text-sm text-gray-400 ml-1">/ day</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* LEFT COLUMN - Images & Details */}
          <div className="lg:col-span-2 space-y-8">

            {/* Image Gallery */}
            <div className="rounded-2xl overflow-hidden bg-white/5 border border-white/10 shadow-2xl backdrop-blur-sm group/gallery">
              <div className="relative aspect-video w-full overflow-hidden bg-black/50 group">
                <img
                  src={IMG_URL + (vehicle.image_urls?.[selectedImage] || "/placeholder.svg")}
                  alt={`${vehicle.name} - View ${selectedImage + 1}`}
                  className="object-cover w-full h-full transition-transform duration-700 group-hover/gallery:scale-105"
                />
              </div>
              <div className="p-4 flex gap-3 overflow-x-auto custom-scrollbar bg-black/40 border-t border-white/5">
                {vehicle.image_urls?.map((url, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`relative w-24 h-16 flex-shrink-0 rounded-lg overflow-hidden transition-all duration-300 ${selectedImage === index
                      ? "ring-2 ring-white opacity-100 scale-105 shadow-[0_0_15px_rgba(255,255,255,0.3)]"
                      : "opacity-60 hover:opacity-100 hover:scale-105 ring-1 ring-white/10"
                      }`}
                  >
                    <img
                      src={IMG_URL + url || "/placeholder.svg"}
                      alt={`Thumbnail ${index + 1}`}
                      className="object-cover w-full h-full"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Specifications Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: 'Fuel Type', value: vehicle.fuel_type, icon: getFuelIcon(vehicle.fuel_type) },
                { label: 'Seats', value: `${vehicle.seats} Seats`, icon: <Users className="w-5 h-5 text-gray-200" /> },
                { label: 'Transmission', value: vehicle.automatic ? "Automatic" : "Manual", icon: <Settings className="w-5 h-5 text-gray-400" /> },
                { label: 'Type', value: vehicle.car_type, icon: <Car className="w-5 h-5 text-gray-200" /> },
              ].map((spec, idx) => (
                <div key={idx} className="bg-white/5 border border-white/10 rounded-xl p-4 flex flex-col items-center justify-center text-center gap-2 hover:bg-white/10 transition-colors group">
                  <div className="p-2 bg-white/5 rounded-full group-hover:bg-white/10 transition-colors">{spec.icon}</div>
                  <div>
                    <p className="text-xs text-gray-400 uppercase tracking-wide">{spec.label}</p>
                    <p className="font-semibold text-white capitalize drop-shadow-sm">{spec.value}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Description */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2 text-white">
                <Info className="w-5 h-5 text-white" />
                Description
              </h3>
              <p className="text-gray-300 leading-relaxed font-light">{vehicle.description}</p>
            </div>

            {/* Map */}
            {vehicle.location_id && typeof vehicle.location_id !== "string" && vehicle.location_id.location?.coordinates && (
              <div className="bg-white/5 border border-white/10 rounded-2xl p-1 overflow-hidden backdrop-blur-sm">
                <div className="p-4 pb-2">
                  <h3 className="text-lg font-semibold flex items-center gap-2 mb-2 text-white">
                    <MapPin className="w-5 h-5 text-white" />
                    Vehicle Location
                  </h3>
                  <p className="text-sm text-gray-400 mb-4">{vehicle.location_id.address}, {vehicle.location_id.city}</p>
                </div>
                <div className="h-80 rounded-xl overflow-hidden relative z-0 border border-white/5">
                  <MapContainer center={[lat, lng]} zoom={15} scrollWheelZoom={false} style={{ height: "100%", width: "100%" }}>
                    <TileLayer
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    />
                    <Marker position={[lat, lng]}>
                      <Popup className="custom-popup">
                        <div className="p-2 text-center">
                          <p className="font-medium text-black text-sm">
                            {vehicle.location_id.address}, {vehicle.location_id.city}
                          </p>
                        </div>
                      </Popup>
                    </Marker>
                  </MapContainer>
                </div>
              </div>
            )}
          </div>

          {/* RIGHT COLUMN - Booking & Key Info - STICKY CONTAINER */}
          <div className="space-y-6 sticky top-24 h-fit">

            {/* Booking Card */}
            <Card className="bg-white/5 border-white/10 shadow-2xl backdrop-blur-md overflow-hidden">
              <div className="bg-gradient-to-r from-white/20 to-transparent p-[1px]"></div>
              <CardContent className="p-6 space-y-6">
                <div className="text-center mb-2">
                  <h3 className="text-xl font-bold text-white mb-1 drop-shadow-sm">Book This Vehicle</h3>
                  <p className="text-sm text-gray-400">Select dates to calculate price</p>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-white" /> Start Date
                    </label>
                    <div className="relative group">
                      <DatePicker
                        selected={startDate}
                        onChange={(date: Date | null) => {
                          if (date) {
                            setStartDate(date);
                            if (endDate && (date >= endDate || !isDateAvailable(date))) {
                              setEndDate(null);
                            }
                          }
                        }}
                        minDate={new Date()}
                        filterDate={isDateAvailable}
                        placeholderText="Select start date"
                        className="w-full p-3 rounded-lg border border-white/10 bg-black/50 text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-white focus:border-white/50 transition-all hover:border-white/30"
                        dateFormat="MMM dd, yyyy"
                        dayClassName={getDayClassName}
                        selectsStart
                        startDate={startDate}
                        endDate={endDate}
                        todayButton="Today"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-white" /> End Date
                    </label>
                    <div className="relative group">
                      <DatePicker
                        selected={endDate}
                        onChange={(date: Date | null) => date && setEndDate(date)}
                        minDate={startDate || new Date()}
                        filterDate={isDateAvailable}
                        placeholderText="Select end date"
                        className="w-full p-3 rounded-lg border border-white/10 bg-black/50 text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-white focus:border-white/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:border-white/30"
                        dateFormat="MMM dd, yyyy"
                        dayClassName={getDayClassName}
                        selectsEnd
                        startDate={startDate}
                        endDate={endDate}
                        disabled={!startDate}
                        todayButton="Today"
                      />
                    </div>
                  </div>
                </div>

                {/* Price Summary */}
                <div className="bg-black/30 rounded-xl p-4 border border-white/5 space-y-3">
                  <div className="flex justify-between text-sm text-gray-400">
                    <span>Rate per day</span>
                    <span>₹{vehicle.price_per_day.toLocaleString()}</span>
                  </div>
                  {startDate && endDate && (
                    <div className="flex justify-between text-sm text-gray-400">
                      <span>Duration</span>
                      <span>
                        {Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))} Days
                      </span>
                    </div>
                  )}
                  <div className="border-t border-white/10 pt-3 flex justify-between items-center">
                    <span className="font-semibold text-white">Total</span>
                    <span className="text-2xl font-bold text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]">
                      {totalPrice > 0 ? `₹${totalPrice.toLocaleString()}` : "—"}
                    </span>
                  </div>
                </div>

                {user?.idproof_id?.status !== 'approved' && (
                  <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 text-center">
                    <p className="text-red-400 text-sm mb-2">ID Proof verification required</p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate("/userProfile")}
                      className="w-full text-xs border-red-500/30 text-red-400 hover:bg-red-500/20 hover:text-red-300"
                    >
                      Verify Now
                    </Button>
                  </div>
                )}

                <Button
                  onClick={handleBookNow}
                  className="w-full bg-white hover:bg-gray-100 text-black font-bold py-6 text-lg shadow-[0_0_20px_rgba(255,255,255,0.3)] transition-all hover:shadow-[0_0_30px_rgba(255,255,255,0.5)] transform hover:-translate-y-0.5"
                  disabled={!startDate || !endDate || user?.idproof_id?.status !== 'approved'}
                >
                  Book Now
                </Button>
              </CardContent>
            </Card>

            {/* Owner Info */}
            <Card className="bg-white/5 border-white/10 backdrop-blur-md">
              <CardContent className="p-6">
                <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Vehicle Owner</h3>
                {vehicle.owner_id && typeof vehicle.owner_id !== "string" ? (
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <img
                        src={IMG_URL + (vehicle.owner_id.profile_image || "/placeholder.svg")}
                        alt={vehicle.owner_id.name}
                        className="w-14 h-14 rounded-full object-cover border-2 border-white/10"
                      />
                      {vehicle.owner_id.is_verified_user && (
                        <div className="absolute -bottom-1 -right-1 bg-black rounded-full p-0.5 border border-white/10" title="Verified Owner">
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-4 h-4">
                            <path d="M22.5 12.5C22.5 10.92 21.625 9.55 20.352 8.9C20.506 8.465 20.59 7.995 20.59 7.5C20.59 5.29 18.88 3.502 16.772 3.502C16.302 3.502 15.852 3.586 15.436 3.752C14.818 2.415 13.51 1.5 12 1.5C10.49 1.5 9.184 2.417 8.563 3.75C8.15 3.585 7.697 3.5 7.227 3.5C5.117 3.5 3.409 5.29 3.409 7.5C3.409 7.995 3.492 8.465 3.647 8.9C2.375 9.55 1.5 10.92 1.5 12.5C1.5 14.078 2.375 15.448 3.647 16.098C3.493 16.533 3.409 17.003 3.409 17.5C3.409 19.71 5.119 21.5 7.227 21.5C7.697 21.5 8.147 21.414 8.563 21.25C9.183 22.583 10.489 23.5 12 23.5C13.512 23.5 14.818 22.583 15.437 21.25C15.851 21.415 16.303 21.5 16.772 21.5C18.882 21.5 20.59 19.71 20.59 17.5C20.59 17.005 20.507 16.535 20.353 16.1C21.625 15.45 22.5 14.08 22.5 12.5Z" fill="#1877F2" />
                            <path d="M10 16.5L6 12.5L7.41 11.09L10 13.67L16.59 7.09L18 8.5L10 16.5Z" fill="white" />
                          </svg>
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-white truncate">{vehicle.owner_id.name}</h4>
                      <div className="flex flex-col text-sm text-gray-400 mt-1 space-y-0.5">
                        <span className="flex items-center gap-2 truncate">
                          <Mail className="w-3.5 h-3.5" /> {vehicle.owner_id.email}
                        </span>
                        {vehicle.owner_id.phone && (
                          <span className="flex items-center gap-2">
                            <Phone className="w-3.5 h-3.5" /> {vehicle.owner_id.phone}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-400 text-sm">Owner details not available</p>
                )}
              </CardContent>
            </Card>

          </div>
        </div>
      </div>
    </div>
  );
};

export default VehicleDetailPage;
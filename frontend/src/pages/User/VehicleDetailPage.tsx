import { useEffect, useState } from "react";
import { Car, Fuel, Users, Settings, MapPin, Phone, Mail } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { MapContainer, Marker, TileLayer, Popup } from "react-leaflet";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format, parseISO } from "date-fns";
import { getVehicleDetails } from "@/services/user/vehicleService";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";
import type { Vehicle } from "@/Types/User/addVehicle/Ivehicle";
import toast from "react-hot-toast";
import Navbar from "@/components/user/Navbar";
import "leaflet/dist/leaflet.css";
import type { Iuser } from "@/Types/User/Iuser";
import { getBookedDate } from "@/services/user/bookingService";


const IMG_URL = import.meta.env.VITE_IMAGE_URL;

const VehicleDetailPage = () => {
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  const [unavailableDates, setUnavailableDates] = useState<string[]>([]);

  const { pathname } = useLocation();
  const navigate = useNavigate();
  const user: Iuser = useSelector((state: RootState) => state.auth.user!);

  useEffect(() => {
    const fetchVehicle = async () => {
      setLoading(true);
      try {
        const id = pathname.split("/")[2];
        const booking = await getBookedDate(id);
        setUnavailableDates(booking);
        const response = await getVehicleDetails(id);
        setVehicle(response);
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

  if (user.idproof_id?.status !== 'approved') {
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
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!vehicle) {
    return (
      <div className="min-h-screen flex items-center justify-center text-center bg-gray-900 text-white">
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

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-white">{vehicle.name}</h1>
            <p className="text-lg text-gray-300">{vehicle.brand}</p>
          </div>
          <span
            className={`px-3 py-1 rounded-full text-sm font-semibold ${vehicle.is_available ? "bg-green-500" : "bg-red-500"
              } text-white`}
          >
            {vehicle.is_available ? "Available" : "Not Available"}
          </span>
        </div>

        <Card className="mb-6 bg-gray-800/80 border-none">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-6 items-center">
              <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-300 mb-1">Start Date</label>
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
                    className="w-full p-2 rounded-md border border-gray-600 bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    dateFormat="yyyy-MM-dd"
                    excludeDates={unavailableDates.map(date => parseISO(date))}
                    selectsStart
                    startDate={startDate}
                    endDate={endDate}
                    todayButton="Today"
                    showDisabledMonthNavigation
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-300 mb-1">End Date</label>
                  <DatePicker
                    selected={endDate}
                    onChange={(date: Date | null) => date && setEndDate(date)}
                    minDate={startDate || new Date()}
                    filterDate={isDateAvailable}
                    placeholderText="Select end date"
                    className="w-full p-2 rounded-md border border-gray-600 bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    dateFormat="yyyy-MM-dd"
                    excludeDates={unavailableDates.map(date => parseISO(date))}
                    selectsEnd
                    startDate={startDate}
                    endDate={endDate}
                    disabled={!startDate}
                    todayButton="Today"
                    showDisabledMonthNavigation
                  />
                </div>
                {user.idproof_id?.status !== 'approved' && (
                  <div>

                    <div className="col-span-2 text-red-500 text-sm">
                      Please submit your ID proof to book a vehicle.
                    </div>
                    <Button
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                      onClick={() => navigate("/userProfile")}>go to profile</Button>
                  </div>
                )}
              </div>
              <div className="text-center">
                {totalPrice > 0 && (
                  <div className="mb-4">
                    <p className="text-sm text-gray-400">Total Price</p>
                    <p className="text-xl font-bold text-blue-400">₹{totalPrice.toLocaleString()}</p>
                  </div>
                )}
                <Button
                  onClick={handleBookNow}
                  className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-full"
                  disabled={!startDate || !endDate||user.idproof_id?.status !== 'approved' }
                >
                  Book Now
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card className="bg-gray-800/80 border-none">
              <CardContent className="p-0">
                <div className="relative rounded-t-md overflow-hidden">
                  <img
                    src={IMG_URL + (vehicle.image_urls?.[selectedImage] || "/placeholder.svg")}
                    alt={`${vehicle.name} - Image ${selectedImage + 1}`}
                    className="object-cover h-96 w-full"
                  />
                </div>
                <div className="p-4 flex gap-2 overflow-x-auto">
                  {vehicle.image_urls?.map((url, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`w-16 h-16 rounded-md border-2 ${selectedImage === index ? "border-blue-500" : "border-gray-600"
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
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="bg-gray-800/80 border-none">
              <CardContent className="p-6 text-center">
                <p className="text-2xl font-bold text-blue-400">₹{vehicle.price_per_day.toLocaleString()}</p>
                <p className="text-sm text-gray-400">per day</p>
              </CardContent>
            </Card>

            <Card className="bg-gray-800/80 border-none">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-3 text-white">Specifications</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <div className="flex items-center gap-2">{getFuelIcon(vehicle.fuel_type)} Fuel</div>
                    <span className="capitalize">{vehicle.fuel_type}</span>
                  </div>
                  <div className="flex justify-between">
                    <div className="flex items-center gap-2"><Users className="w-5 h-5 text-gray-300" /> Seats</div>
                    <span>{vehicle.seats}</span>
                  </div>
                  <div className="flex justify-between">
                    <div className="flex items-center gap-2"><Car className="w-5 h-5 text-gray-300" /> Type</div>
                    <span className="capitalize">{vehicle.car_type}</span>
                  </div>
                  <div className="flex justify-between">
                    <div className="flex items-center gap-2"><Settings className="w-5 h-5 text-gray-300" /> Transmission</div>
                    <span>{vehicle.automatic ? "Automatic" : "Manual"}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-800/80 border-none">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-3 text-white">Registration</h3>
                <p className="text-gray-300 font-mono">{vehicle.registration_number}</p>
              </CardContent>
            </Card>
          </div>
        </div>

        <Card className="mt-6 bg-gray-800/80 border-none">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-3 text-white">Description</h3>
            <p className="text-gray-300">{vehicle.description}</p>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <Card className="bg-gray-800/80 border-none">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-3 text-white">Owner Details</h3>
              {vehicle.owner_id && typeof vehicle.owner_id !== "string" ? (
                <div className="flex items-start gap-4">
                  <img
                    src={IMG_URL + (vehicle.owner_id.profile_image || "/placeholder.svg")}
                    alt={vehicle.owner_id.name}
                    className="w-12 h-12 rounded-full object-cover border border-gray-600"
                  />
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-semibold text-white">{vehicle.owner_id.name}</h4>
                      {vehicle.owner_id.is_verified_user && (
                        <svg className="w-5 h-5 text-blue-400" viewBox="0 0 24 24" fill="none">
                          <path
                            d="M21.37,12c0,1-.86,1.79-1.14,2.67s-.1,2.08-.65,2.83-1.73.94-2.5,1.49-1.28,1.62-2.18,1.92S13,20.65,12,20.65s-2,.55-2.9.27S7.67,19.55,6.92,19,5,18.28,4.42,17.51s-.35-1.92-.65-2.83S2.63,13,2.63,12s.86-1.8,1.14-2.68.1-2.08.65-2.83S6.15,5.56,6.92,5,8.2,3.39,9.1,3.09s1.93.27,2.9.27,2-.55,2.9-.27S16.33,4.46,17.08,5s1.94.72,2.5,1.49.35,1.92.65,2.83S21.37,11,21.37,12Z"
                            fill="#61d0ff"
                          />
                          <polyline points="8 12 11 15 16 10" stroke="#000000" strokeWidth="0.696" />
                        </svg>
                      )}
                    </div>
                    <div className="text-sm text-gray-300 space-y-1">
                      <div className="flex items-center gap-2"><Mail className="w-4 h-4" /> {vehicle.owner_id.email}</div>
                      {vehicle.owner_id.phone && (
                        <div className="flex items-center gap-2"><Phone className="w-4 h-4" /> {vehicle.owner_id.phone}</div>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-gray-300">Owner data not available</p>
              )}
            </CardContent>
          </Card>

          <Card className="bg-gray-800/80 border-none">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-3 text-white">Location</h3>
              {vehicle.location_id && typeof vehicle.location_id !== "string" ? (
                <div className="flex items-start gap-3 text-sm text-gray-300">
                  <MapPin className="w-5 h-5 mt-0.5" />
                  <div>
                    <p className="font-medium text-white">{vehicle.location_id.name}</p>
                    <p>{vehicle.location_id.address}, {vehicle.location_id.city}</p>
                    <p>{vehicle.location_id.state}, {vehicle.location_id.country} - {vehicle.location_id.pincode}</p>
                  </div>
                </div>
              ) : (
                <p className="text-gray-300">Location data not available</p>
              )}
            </CardContent>
          </Card>
        </div>

        {vehicle.location_id && typeof vehicle.location_id !== "string" && vehicle.location_id.location?.coordinates && (
          <Card className="mt-6 bg-gray-800/80 border-none">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-3 text-white">Vehicle Location</h3>
              <div className="h-80 rounded-md overflow-hidden">
                <MapContainer center={[lat, lng]} zoom={15} scrollWheelZoom={false} style={{ height: "100%", width: "100%" }}>
                  <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                  <Marker position={[lat, lng]}>
                    <Popup>
                      <div className="text-center">
                        <h4 className="font-semibold">{vehicle.name}</h4>
                        <p className="text-sm">{vehicle.location_id.name}</p>
                        <p className="text-xs">{vehicle.location_id.address}, {vehicle.location_id.city}</p>
                      </div>
                    </Popup>
                  </Marker>
                </MapContainer>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default VehicleDetailPage;
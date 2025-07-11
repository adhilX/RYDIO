import { useState, useEffect, useRef } from 'react';
import { MapPin, Car, Sparkles} from 'lucide-react';

import { Card } from '@/components/ui/card';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import Navbar from '@/components/user/Navbar';
import { useNavigate } from 'react-router';
import { useSelector } from 'react-redux';
import type { RootState } from '@/store/store';
import { findLocation } from '@/services/user/locationService';
import VehicleSearchBar from '@/components/user/VehicleSearchBar';

const LandingPage = () => {
  const [location, setLocation] = useState('');
  const [pickupDate, setPickupDate] = useState('');
  const [returnDate, setReturnDate] = useState('');
  const [isFormComplete, setIsFormComplete] = useState(false);
  const [showSparkles, setShowSparkles] = useState(false);

  // Hero carousel images
  const heroImages = [
    "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
    "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
    "https://images.unsplash.com/photo-1471479917193-f00955256257?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
    "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
  ];

  // Auto-play plugin for the carousel
  const plugin = useRef(
    Autoplay({ delay: 5000, stopOnInteraction: false })
  );

const navigate = useNavigate()
const {latitude,longitude} = useSelector((state:RootState)=>state.location)
   const [newLocation, setNewLocation] = useState({ latitude: 0, longitude: 0 });
const fetchLocation = async (latitude: number, longitude: number) => {
  const data = await findLocation(latitude, longitude);
  return data.display_name;
}

useEffect(() => {
  const complete = location && pickupDate && returnDate;
  setIsFormComplete(!!complete);
  if (latitude && longitude) {
    (async () => {
      const address = await fetchLocation(latitude, longitude);
      setLocation(address);
    })();
  }
// eslint-disable-next-line react-hooks/exhaustive-deps
}, [latitude, longitude, pickupDate, returnDate]);

  const handleDateChange = (setter: (value: string) => void, value: string) => {
    setter(value);
    setShowSparkles(true);
    setTimeout(() => setShowSparkles(false), 1000);
  };

  const handleVehicleSearch =async()=>{
    if(!location&&!pickupDate&&!returnDate){
      console.log('data not filed')
      return 
    }
    const final = {latitude:newLocation?.latitude || latitude,longitude:newLocation?.longitude || longitude}
    navigate('/vehicle-list',{state:{...final}})
    
  }
  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Full-screen auto-changing carousel background */}
      <div className="fixed inset-0 z-0 h-screen w-full">
        <Carousel 
          className="w-full h-full"
          plugins={[plugin.current]}
          onMouseEnter={plugin.current.stop}
          onMouseLeave={plugin.current.reset}
          opts={{ loop: true }}
        >
          <CarouselContent className="h-full">
            {heroImages.map((image, index) => (
              <CarouselItem key={index} className="h-full">
                <div className="relative w-full h-full">
                  <img 
                    src={image} 
                    alt={`Hero image ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/60"></div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>

      {/* Easter Egg Car */}

      {/* Header */}
      <Navbar/>

      {/* Hero Content */}
      <main className="relative px-6 pt-32 pb-16 z-10">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-6xl md:text-7xl font-bold text-white mb-6 animate-fade-in">
            Your adventure
            <br />
            <span className="text-white">starts here</span>
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto animate-fade-in">
            Premium vehicles, warm service, and unforgettable journeys await you
          </p>
        </div>

        {/* Search Form */}
        <VehicleSearchBar handleDateChange={handleDateChange} setNewLocation={setNewLocation} handleVehicleSearch={handleVehicleSearch} isFormComplete={isFormComplete} location={location} pickupDate={pickupDate} returnDate={returnDate} setLocation={setLocation} setPickupDate={setPickupDate} setReturnDate={setReturnDate} showSparkles={showSparkles}/>
        {/* Feature Cards */}
        <div className="max-w-7xl mx-auto pb-24">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <Card className="p-8 rounded-2xl bg-white/10 backdrop-blur-sm border-white/20 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 group">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:animate-bounce">
                <Car className="text-white" size={32} />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Premium Fleet</h3>
              <p className="text-gray-300">Luxury vehicles maintained to perfection</p>
            </Card>

            <Card className="p-8 rounded-2xl bg-white/10 backdrop-blur-sm border-white/20 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 group">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:animate-bounce">
                <MapPin className="text-white" size={32} />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Convenient Locations</h3>
              <p className="text-gray-300">Pick up and drop off wherever you need</p>
            </Card>

            <Card className="p-8 rounded-2xl bg-white/10 backdrop-blur-sm border-white/20 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 group">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:animate-bounce">
                <Sparkles className="text-white" size={32} />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">White Glove Service</h3>
              <p className="text-gray-300">Personal attention to every detail</p>
            </Card>
          </div>
        </div>
      </main>

      {/* Floating Action Hint */}
      <div className="fixed bottom-8 right-8 z-30">
        <div className="bg-white text-black px-4 py-2 rounded-full shadow-lg animate-bounce">
          <span className="text-sm font-medium">🚗 Ready to drive?</span>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
import { useState, useEffect, useRef } from 'react';
import { Calendar, MapPin, Search, Car, Sparkles} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import Navbar from '@/components/user/Navbar';
import { useNavigate } from 'react-router';

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

  useEffect(() => {
    const complete = location && pickupDate && returnDate;
    setIsFormComplete(!!complete);
  }, [location, pickupDate, returnDate]);

  const handleDateChange = (setter: (value: string) => void, value: string) => {
    setter(value);
    setShowSparkles(true);
    setTimeout(() => setShowSparkles(false), 1000);
  };

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
        <div className="max-w-7xl mx-auto mt-50 mb-16">
          <Card className={`max-w-4xl mx-auto p-8 rounded-2xl shadow-2xl bg-white/10 backdrop-blur-md border-white/20 transition-all duration-500 ${
            isFormComplete ? 'ring-2 ring-white/50 shadow-white/20' : ''
          }`}>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
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
                      location ? 'animate-bounce text-white' : ''
                    }`} 
                    size={20} 
                  />
                </div>
              </div>

              <div className="relative">
                <label className="block text-sm font-medium text-gray-200 mb-2">
                  Pick-up Date
                </label>
                <div className="relative">
                  <Input
                    type="date"
                    value={pickupDate}
                    onChange={(e) => handleDateChange(setPickupDate, e.target.value)}
                    className="pl-12 h-14 rounded-xl border-2 border-white/30 focus:border-white transition-all duration-300 hover:scale-[1.02] text-lg bg-white/10 backdrop-blur-sm text-white"
                  />
                  <Calendar 
                    className={`absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-300 transition-all duration-300 ${
                      pickupDate ? 'animate-pulse text-white' : ''
                    }`} 
                    size={20} 
                  />
                </div>
              </div>

              <div className="relative">
                <label className="block text-sm font-medium text-gray-200 mb-2">
                  Return Date
                </label>
                <div className="relative">
                  <Input
                    type="date"
                    value={returnDate}
                    onChange={(e) => handleDateChange(setReturnDate, e.target.value)}
                    className="pl-12 h-14 rounded-xl border-2 border-white/30 focus:border-white transition-all duration-300 hover:scale-[1.02] text-lg bg-white/10 backdrop-blur-sm text-white"
                  />
                  <Calendar 
                    className={`absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-300 transition-all duration-300 ${
                      returnDate ? 'animate-pulse text-white' : ''
                    }`} 
                    size={20} 
                  />
                </div>
              </div>

              <div className="flex items-end">
                <Button 
                  className="w-full h-14 bg-white hover:bg-gray-200 text-black rounded-xl text-lg font-semibold transition-all duration-300 hover:scale-105 active:rotate-3 transform cursor-pointer  shadow-lg hover:shadow-xl"
                  onClick={() => {
                     navigate('/vehicle-list')
                  }}
                >
                  <Search className="mr-2" size={20} />
                  Search Cars
                </Button>
              </div>
            </div>

            {showSparkles && (
              <div className="absolute inset-0 pointer-events-none">
                <Sparkles className="absolute top-4 right-4 text-white animate-ping" size={16} />
                <Sparkles className="absolute bottom-4 left-4 text-white animate-ping animation-delay-200" size={12} />
                <Sparkles className="absolute top-1/2 left-1/2 text-white animate-ping animation-delay-400" size={14} />
              </div>
            )}
          </Card>
        </div>

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
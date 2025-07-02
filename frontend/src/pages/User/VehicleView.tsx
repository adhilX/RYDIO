import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

// Dummy data (should be replaced with API call)
const dummyVehicle = {
  _id: '1',
  owner_id: '',
  name: 'Tesla Model S',
  brand: 'Tesla',
  registration_number: 'TSLA1234',
  fuel_type: 'electric',
  seats: 5,
  car_type: 'sedan',
  automatic: true,
  price_per_day: 3500,
  description: 'A luxury electric sedan with autopilot, long range, and premium features. Enjoy a smooth, silent ride with cutting-edge technology.',
  image_urls: [
    'https://images.unsplash.com/photo-1511918984145-48de785d4c4e?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=800&q=80',
  ],
  admin_approve: 'accepted',
  is_available: true,
};

export default function VehicleView() {
  // In real app, fetch vehicle by ID from params
  const { id } = useParams();
  const vehicle = dummyVehicle; // Replace with fetched data
  const [imgIdx, setImgIdx] = useState(0);

  const nextImg = () => setImgIdx((imgIdx + 1) % vehicle.image_urls.length);
  const prevImg = () => setImgIdx((imgIdx - 1 + vehicle.image_urls.length) % vehicle.image_urls.length);

  return (
    <div className="min-h-screen bg-black text-white font-sans flex items-center justify-center py-10 px-4">
      <Card className="w-full max-w-5xl mx-auto bg-black/80 border-white/10 shadow-2xl rounded-2xl overflow-hidden flex flex-col md:flex-row">
        {/* Image Carousel */}
        <div className="md:w-1/2 w-full relative flex flex-col items-center justify-center bg-black/60">
          <motion.img
            key={imgIdx}
            src={vehicle.image_urls[imgIdx]}
            alt={vehicle.name}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="w-full h-80 object-cover rounded-t-2xl md:rounded-l-2xl md:rounded-tr-none shadow-lg"
          />
          {vehicle.image_urls.length > 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
              {vehicle.image_urls.map((_, idx) => (
                <button
                  key={idx}
                  className={`w-3 h-3 rounded-full ${idx === imgIdx ? 'bg-[#6DA5C0]' : 'bg-white/30'} transition`}
                  onClick={() => setImgIdx(idx)}
                  aria-label={`Go to image ${idx + 1}`}
                />
              ))}
            </div>
          )}
          {/* Carousel Arrows */}
          {vehicle.image_urls.length > 1 && (
            <>
              <button onClick={prevImg} className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/70 p-2 rounded-full text-white">
                <ChevronLeft size={20} />
              </button>
              <button onClick={nextImg} className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/70 p-2 rounded-full text-white">
                <ChevronRight size={20} />
              </button>
            </>
          )}
        </div>
        {/* Details */}
        <div className="md:w-1/2 w-full p-8 flex flex-col gap-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl font-bold text-white">{vehicle.name}</span>
            <Badge className="bg-[#6DA5C0] text-black ml-auto">{vehicle.car_type}</Badge>
          </div>
          <div className="text-gray-300 text-base mb-2">{vehicle.brand} &bull; {vehicle.fuel_type} &bull; {vehicle.seats} seats</div>
          <div className="text-[#6DA5C0] font-semibold text-xl mb-2">9{vehicle.price_per_day}/day
          </div>
          <div className="text-white/80 text-base mb-4">{vehicle.description}</div>
          <div className="flex flex-wrap gap-3 mb-4">
            <Badge className="bg-white/10 text-white border-white/20">Automatic: {vehicle.automatic ? 'Yes' : 'No'}</Badge>
            <Badge className="bg-white/10 text-white border-white/20">Registration: {vehicle.registration_number}</Badge>
            <Badge className="bg-white/10 text-white border-white/20">Status: {vehicle.is_available ? 'Available' : 'Unavailable'}</Badge>
          </div>
          <Button className="w-full bg-[#6DA5C0] hover:bg-[#5b8ca7] text-black font-bold text-lg py-3 rounded-xl mt-auto">Book Now</Button>
        </div>
      </Card>
    </div>
  );
} 
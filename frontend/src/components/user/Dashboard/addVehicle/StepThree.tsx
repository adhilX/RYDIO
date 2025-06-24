
// src/components/AddVehicleForm/StepThree.tsx
import  { useState } from 'react';
import { Button } from '@/components/ui/button';
import { MapPicker } from '../mapPicker';

interface StepThreeProps {
  onSubmit: (data: StepThreeFormData) => void;
  defaultValues?: StepThreeFormData;
}

interface StepThreeFormData {
  location: string;
}

export default function StepThree({ onSubmit, defaultValues }: StepThreeProps) {
  const [isMapOpen, setIsMapOpen] = useState(false);
  const [location, setLocation] = useState<string>(defaultValues?.location || '');

  const handleLocationSelect = (loc: string) => {
    setLocation(loc);
  };

  const handleSubmit = () => {
    if (!location) {
      alert('Please select a location');
      return;
    }
    onSubmit({ location });
  };

  return (
    <div className="space-y-4">
      <div>
        <p className="text-sm font-medium">Selected Location: {location || 'None'}</p>
        <Button onClick={() => setIsMapOpen(true)} className="mt-2">
          {location ? 'Change Location' : 'Select Location'}
        </Button>
      </div>
      <MapPicker
        open={isMapOpen}
        onOpenChange={setIsMapOpen}
        onLocationSelect={handleLocationSelect}
        initialPosition={{ lat: 9.9354269819516, lng: 76.27097549767149 }}
      />
      <button onClick={handleSubmit} className="hidden" aria-label="Submit Step Three"></button>
    </div>
  );
}

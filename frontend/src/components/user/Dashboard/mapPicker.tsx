import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { Button } from "@/components/ui/button"; 
import type { LatLngTuple } from "leaflet"; 

interface MapPickerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onLocationSelect: (location: string) => void;
  initialPosition?: { lat: number; lng: number };
}

export function MapPicker({
  open,
  onOpenChange,
  onLocationSelect,
  initialPosition = { lat:9.9354269819516, lng: 76.27097549767149},
}: MapPickerProps) {
  const [markerPosition, setMarkerPosition] = useState<LatLngTuple | null>(
    initialPosition ? [initialPosition.lat, initialPosition.lng] : null
  );

  function MapClickHandler() {
    useMapEvents({
      click(e) {
        const { lat, lng } = e.latlng;
        setMarkerPosition([lat, lng]);
        onLocationSelect(`${lat},${lng}`);
      },
    });
    return null;
  }

  const handleConfirm = () => {
    onOpenChange(false);
  };

  return (
<Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[90vw] max-w-2xl bg-gray-800 text-white border border-gray-700">
        <DialogHeader>
          <DialogTitle className="text-gray-100">Select Vehicle Location</DialogTitle>
        </DialogHeader>
        <div className="relative w-full h-96 rounded-lg overflow-hidden shadow-inner">
          <MapContainer
            center={[initialPosition.lat, initialPosition.lng] as LatLngTuple}
            zoom={13}
            scrollWheelZoom={false}
            style={{ height: "100%", width: "100%" }}
          >
            <TileLayer
              attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            
            <MapClickHandler />
            {markerPosition && (
              <Marker position={markerPosition}>
                <Popup>
                  Selected Location <br /> Lat: {markerPosition[0]}, Lng: {markerPosition[1]}
                </Popup>
              </Marker>
            )}
          </MapContainer>
        </div>
        <DialogFooter className="mt-4">
          <Button
            onClick={() => onOpenChange(false)}
            className="bg-gray-600 hover:bg-gray-700 text-white"
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={!markerPosition}
            className="bg-indigo-600 hover:bg-indigo-700 text-white"
          >
            Confirm Location
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
// Types for vehicle search functionality

import type { Vehicle } from '@/Types/User/addVehicle/Ivehicle';

export interface LocationCoords {
  latitude: number;
  longitude: number;
}

export interface SearchParams extends LocationCoords {
  pickupDate: string;
  returnDate: string;
}

export interface VehicleSearchResult {
  vehicles: Vehicle[];
  total: number;
  currentPage: number;
  totalPages: number;
}

export type { Vehicle };

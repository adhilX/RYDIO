import { Location } from "../../../entities/LocationEnties";

//=================== Base Vehicle DTO ===================

export interface BaseVehicleDto {
  _id?: string;
  name: string;
  brand: string;
  fuel_type: 'petrol' | 'diesel' | 'electric';
  seats: 2 | 4 | 5 | 7;
  car_type: 'sedan' | 'hateback' | 'xuv' | 'suv' | 'sports';
  automatic: boolean;
  price_per_day: number;
  image_urls: string[];
}

//=================== Add Vehicle DTO ===================
export interface AddVehicleInputDto {
  vehicle: {
    owner_id: string;
    name: string;
    brand: string;
    registration_number: string;
    fuel_type: 'petrol' | 'diesel' | 'electric';
    seats: 2 | 4 | 5 | 7;
    car_type: 'sedan' | 'hateback' | 'xuv' | 'suv' | 'sports';
    automatic: boolean;
    price_per_day: number;
    description: string;
    image_urls: string[];
  };
  location: Location;
}

export interface AddVehicleOutputDto extends BaseVehicleDto {
  owner_id: string | object;
  location_id: string | object;
  registration_number: string;
  description: string;
  admin_approve: 'pending' | 'accepted' | 'rejected';
  reject_reason?: string;
  is_available: boolean;
  created_at: Date;
}

//=================== My Vehicle DTO ===================
export interface MyVehicleInputDto {
  owner_id: string;
  search: string;
  page: string;
  limit: string;
}

export interface MyVehicleOutputDto {
  vehicles: AddVehicleOutputDto[];
  total: number;
}

//=================== Search Vehicle DTO ===================
export interface SearchVehicleInputDto {
  lat: number;
  lon: number;
  search: string;
  pickupDate: string;
  returnDate: string;
  currentPage: number;
  limit: number;
  user_id: string;
  filters: {
    fuel_types?: string[];
    seats?: number[];
    car_types?: string[];
    transmission?: string[];
    distance_range?: number;
  };
}

export interface SearchVehicleOutputDto {
  vehicles: BaseVehicleDto[];
  total: number;
}

//=================== Vehicle Details DTO ===================
export interface VehicleDetailsInputDto {
  id: string;
}

export interface VehicleDetailsOutputDto extends AddVehicleOutputDto {}

//=================== Change Vehicle Status DTO ===================
export interface ChangeVehicleStatusInputDto {
  vehicleId: string;
}

export interface ChangeVehicleStatusOutputDto {
  success: boolean;
  message: string;
}

//=================== Delete Vehicle DTO ===================
export interface DeleteVehicleInputDto {
  vehicleId: string;
}

export interface DeleteVehicleOutputDto {
  success: boolean;
  message: string;
}

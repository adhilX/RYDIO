import { ObjectId } from "mongoose";

export interface IVehicle {
    _id?:ObjectId
    owner_id: string;
    location_id: string;
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
    admin_approve : 'pending'| 'accepted'| 'rejected'
    is_available?: boolean;
    created_at?: Date;
}
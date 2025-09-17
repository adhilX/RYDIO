import type { Iuser } from "../Iuser";
import type { Ilocation } from "../location";

export interface Vehicle {
    _id?:string 
    owner_id: Iuser
    location_id?: Ilocation;
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
    admin_approve : 'pending'| 'accepted'| 'rejected' | 'reapplied'
    reject_reason?: string;
    is_available?: boolean;
    created_at?: Date;
}
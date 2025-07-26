import type { Vehicle } from "../addVehicle/Ivehicle"
import type { Iuser } from "../Iuser"
import type { Ilocation } from "../location"



export type BookingStatus = 'pending' | 'booked' | 'ongoing' | 'cancelled' | 'completed'
export type PaymentStatus = 'pending' | 'succeeded' | 'failed' | 'paid'

export interface IbookedData {
    _id?: string
    vehicle: Vehicle
    location:Ilocation
    user: Iuser
    name: string
    phone: number
    address: string
    city: string
    start_date: Date
    end_date: Date
    total_amount: number
    payment_intent_id: string
    status: BookingStatus      
    payment_status: PaymentStatus
    createdAt: Date
}

import type { Vehicle } from "../addVehicle/Ivehicle"
import type { Iuser } from "../Iuser"
import type { Ilocation } from "../location"



export type BookingStatus = 'pending' | 'booked' | 'ongoing' | 'cancelled' | 'completed'
export type PaymentStatus = 'pending' | 'succeeded' | 'failed' | 'paid'
export type PaymentType = 'card' | 'wallet'

export interface IFinance {
    security_deposit: number;
    fine_amount: number;
    admin_commission: number;
    owner_earnings: number;
    is_late_return: boolean;
    user_withdraw: boolean;
    owner_withdraw: boolean;
}
export interface IbookedData {
    _id?: string
    booking_id: string
    user_id: string
    vehicle: Vehicle
    location: Ilocation
    user: Iuser
    name: string
    phone: number
    address: string
    city: string
    start_date: Date
    end_date: Date
    ride_start_time: string
    ride_end_time: string
    total_amount: number
    finance: IFinance
    payment_type: PaymentType
    status: BookingStatus
    payment_status: PaymentStatus
    payment_intent_id: string
    cancellation_reason?: string
    createdAt: Date
}

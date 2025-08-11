import type { Vehicle } from "../addVehicle/Ivehicle";
import type { Iuser } from "../Iuser";

export type BookingStatus = {
  Pending: 'pending',
  Booked: 'booked',
  Ongoing: 'ongoing',
  Cancelled: 'cancelled',
  Completed: 'completed',
}

export type PaymentStatus = {
  Pending: 'pending',
  Succeeded: 'succeeded',
  Failed: 'failed',
  Paid: 'paid',
}
export type PaymentType = {
  Card: 'card',
  Wallet: 'wallet',
} 


export interface Ibooking {
  booking_id: string;
  _id?: string;
  user_id: Iuser;
  vehicle_id: Vehicle;
  address: string;
  city: string;

  start_date: Date;
  end_date: Date;
  ride_start_time?: Date;
  ride_end_time?: Date;
  total_amount: number;

  finance: {
    security_deposit: number;
    fine_amount: number;
    admin_commission: number;
    owner_earnings: number;
    is_late_return: boolean;
  };

  payment_type: PaymentType;
  status: BookingStatus;
  cancellation_reason?: string;
  payment_intent_id?: string;
  payment_status: PaymentStatus;
}

export interface BookingData {
  vehicle: Vehicle
  startDate: string
  endDate: string
  total_amount: number
  days: number
  user_id:string
}

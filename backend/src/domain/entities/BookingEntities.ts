import { ObjectId } from "mongoose";
import { IVerificationRequest } from "./VerificationRequest";

export enum BookingStatus {
  Pending = 'pending',
   booked='booked',
   ongoing = 'ongoing',
  Cancelled = 'cancelled',
  Completed = 'completed',
}

export enum PaymentStatus {
  Pending = 'pending',
  Succeeded = 'succeeded',
  Failed = 'failed',
  Paid = 'paid',
}
export enum PaymentType {
  Card = 'card',
  Wallet = 'wallet',
}

export interface Ibooking {
  booking_id: string;
  _id?: string;
  user_id: string|ObjectId;
  vehicle_id: string|ObjectId;
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
    user_withdraw: boolean;
    owner_withdraw: boolean;
  };
  
  payment_type: PaymentType;
  status: BookingStatus;
  cancellation_reason?: string;
  payment_intent_id?: string;
  payment_status: PaymentStatus;
}

export interface BookingData {
  vehicle_id: string
  start_date: Date
  end_date: Date
  total_amount: number
  days: number
  user_id:string
  address:string
  city:string
  id_proof:IVerificationRequest
}
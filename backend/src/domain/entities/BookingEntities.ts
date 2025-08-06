import { ObjectId } from "mongoose";
import { IVerificationRequest } from "./IVerificationRequest";
import path from "path";

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
  _id?: ObjectId;
  user_id: string|ObjectId;
  vehicle_id: ObjectId|string;
  address: string;
  city: string;
  start_date: Date;
  end_date: Date;
  total_amount: number;
  payment_type: PaymentType;
  status: BookingStatus;
  cancellation_reason?: string;
  payment_intent_id: string;
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
import { ObjectId } from "mongoose";
import { IVerificationRequest } from "./IVerificationRequest";

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

export interface Ibooking {
  _id?: ObjectId;
  user_id: string|ObjectId;
  vehicle_id: ObjectId|string;
  address: string;
  city: string;
  id_proof: string|ObjectId;
  start_date: Date;
  end_date: Date;
  total_amount: number;
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
import { ObjectId } from "mongoose";

export enum BookingStatus {
  Pending = 'pending',
  Confirmed = 'confirmed',
  Cancelled = 'cancelled',
  Completed = 'completed',
}

export enum PaymentStatus {
  Pending = 'pending',
  Succeeded = 'succeeded',
  Failed = 'failed',
}

export interface Ibooking {
  _id?: ObjectId;
  user_id: string;
  vehicle_id: string;
  name: string;
  phone: number;
  address: string;
  city: string;
  id_proof: string;
  id_proof_verified: boolean;
  start_date: Date;
  end_date: Date;
  total_amount: number;
  status: BookingStatus;
  cancellation_reason: string;
  payment_intent_id: string;
  payment_status: PaymentStatus;
}

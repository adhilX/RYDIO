import type { Vehicle } from "../addVehicle/Ivehicle";
import type { Iuser } from "../Iuser";
import type { Ilocation } from "../location";

export interface Finance {
  security_deposit: number;
  fine_amount: number;
  admin_commission: number;
  owner_earnings: number;
  is_late_return: boolean;
  user_withdraw: boolean;
  owner_withdraw: boolean;
}

export interface IncomingBooking {
  _id: string;
  booking_id: string;
  user: Iuser;
  vehicle_id: string;
  address: string;
  city: string;
  start_date: string;
  end_date: string;
  total_amount: number;
  finance: Finance;
  status: 'pending' | 'booked' | 'ongoing' | 'completed' | 'cancelled';
  payment_type: string;
  cancellation_reason: string;
  payment_intent_id: string;
  payment_status: 'pending' | 'paid' | 'failed' | 'succeeded';
  createdAt: string;
  updatedAt: string;
  vehicle: Vehicle;
  location: Ilocation
}

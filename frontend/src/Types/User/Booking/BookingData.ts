import type { Vehicle } from "../addVehicle/Ivehicle";
import type { Iuser } from "../Iuser";

export interface IBooking {
  _id?: string;
  user_id: string| Iuser
  vehicle_id: string | Vehicle
  name: string;
  phone: number;
  address: string;
  city: string;
  id_proof: string;
  id_proof_verified: boolean;
  start_date: Date;
  end_date: Date;
  total_amount: number;
  payment_intent_id: string;
}


export interface BookingData {
  vehicle: Vehicle
  startDate: string
  endDate: string
  total_amount: number
  days: number
  user_id:string
}

import type { Vehicle } from "../addVehicle/Ivehicle"

export interface BookingData {
  vehicle: Vehicle
  startDate: string
  endDate: string
  totalPrice: number
  days: number
}
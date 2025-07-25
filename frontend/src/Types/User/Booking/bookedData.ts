import type { Vehicle } from "../addVehicle/Ivehicle"

export interface IbookedData {
    _id?: string
    vehicle: Vehicle
    name: string
    phone: number
    address: string
    city: string
    id_proof: string
    start_date: Date
    end_date: Date
    total_amount: number
    payment_intent_id: string
}

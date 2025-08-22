import { Ibooking } from "../../entities/BookingEntities";

export interface IbookingRepostory {
    createBooking(booking: Ibooking): Promise<Ibooking>
    findByPaymentIntentId(payment_intent_id: string): Promise<Ibooking | null>
    findByUserId(user_id: string, limit: number, page: number, search: string,status:string): Promise<{ bookings: Ibooking[], total: number } | null>
    getBookingData(search: string, limit: number, page: number): Promise<{ bookings: Ibooking[], total: number } | null>
   bookedVehicle(pickupDate: string, returnDate: string): Promise<string[]>
   getBookedVehiclesByVehicleId(vehicle_id:string): Promise<string[]|null>
   getBookingById(booking_id:string): Promise<Ibooking | null>
   changeBookingStatus(booking_id:string,status:string): Promise<Ibooking | null>
   getOwnerBookings(userId:string,limit:number,page:number,search:string,status:string): Promise<{bookings:Ibooking[],total:number}|null>
   cancelBooking(booking_id:string,reason:string): Promise<boolean>
}
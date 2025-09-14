import { BaseRepository } from "../../../adapters/repository/base/BaseRepo";
import { IBooking } from "../../entities/BookingEntities";

export interface IBookingRepository extends BaseRepository<IBooking>{
    findByPaymentIntentId(payment_intent_id: string): Promise<IBooking | null>
    findByUserId(user_id: string, limit: number, page: number, search: string,status:string): Promise<{ bookings: IBooking[], total: number } | null>
    getBookingData(search: string, limit: number, page: number): Promise<{ bookings: IBooking[], total: number } | null>
   bookedVehicle(pickupDate: string, returnDate: string): Promise<string[]>
   getBookedBookingsByVehicleId(vehicle_id: string): Promise<IBooking[]|null> 
   changeBookingStatus(booking_id:string,status:string): Promise<IBooking | null>
   getOwnerBookings(userId:string,limit:number,page:number,search:string,status:string): Promise<{bookings:IBooking[],total:number}|null>
   cancelBooking(booking_id:string,reason:string): Promise<boolean>
   endRide(booking:IBooking): Promise<IBooking | null>
   updateBookingFinance(booking_id: string, updateData: any): Promise<IBooking | null>
   findByBookingId(booking_id:string): Promise<IBooking | null>
   checkBookingExistsBetweenUserAndOwner(userId: string, ownerId: string): Promise<IBooking | null>
}
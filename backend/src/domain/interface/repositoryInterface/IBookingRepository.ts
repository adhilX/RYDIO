import { BaseRepository } from "../../../adapters/repository/base/BaseRepo";
import { IBooking, BookingStatus } from "../../entities/BookingEntities";
import { ICancleFinalce } from "../DTOs/bookingDto/BookingDto";

export interface IBookingRepository extends BaseRepository<IBooking>{
    findByPaymentIntentId(payment_intent_id: string): Promise<IBooking | null>
    findByUserId(user_id: string, limit: number, page: number, search: string,status:string): Promise<{ bookings: IBooking[], total: number } | null>
    getBookingData(search: string, limit: number, page: number): Promise<{ bookings: IBooking[], total: number } | null>
   bookedVehicle(pickupDate: string, returnDate: string): Promise<string[]>
   getBookedBookingsByVehicleId(vehicle_id: string): Promise<IBooking[]|null> 
   changeBookingStatus(booking_id:string,status:BookingStatus): Promise<IBooking | null>
   getOwnerBookings(userId:string,limit:number,page:number,search:string,status:string): Promise<{bookings:IBooking[],total:number}|null>
   cancelBooking(booking_id:string,reason:string, financeUpdate?: ICancleFinalce): Promise<boolean>
   endRide(booking:IBooking): Promise<IBooking | null>
   updateBookingFinance(booking_id: string, updateData: any): Promise<IBooking | null>
   findByBookingId(booking_id:string): Promise<IBooking | null>
   checkBookingExistsBetweenUserAndOwner(userId: string, ownerId: string): Promise<IBooking | null>
   
   // Dashboard Analytics Methods
   getTotalRevenue(): Promise<number>
   getLastMonthRevenue(): Promise<number>
   getRevenueChartData(): Promise<number[]>
   getTotalBookingsCount(): Promise<number>
   getLastMonthBookingsCount(): Promise<number>
   getBookingsChartData(): Promise<number[]>
   getTotalCommission(): Promise<number>
   getTotalPenalties(): Promise<number>
   getTotalRefunds(): Promise<number>
   getAverageRevenuePerBooking(): Promise<number>
   getWeeklyBookingData(): Promise<Array<{ day: string; bookings: number }>>
   getActiveCitiesCount(): Promise<number>
   getTopCityByBookings(): Promise<{ name: string; bookings: number }>
}
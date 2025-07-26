import { Ibooking } from "../../../../entities/BookingEntities";

export interface IgetBookingUsecase{
     getBookingData(search:string,limit:number,page:number):Promise<{bookings:Ibooking[],total: number}|null>
}
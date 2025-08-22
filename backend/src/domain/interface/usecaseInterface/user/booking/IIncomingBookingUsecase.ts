import { Ibooking } from "../../../../entities/BookingEntities";

export interface IIncomingBookingUsecase {
     execute(userId:string,limit:number,page:number,search:string,status:string):Promise<{bookings:Ibooking[],total:number}|null>
}
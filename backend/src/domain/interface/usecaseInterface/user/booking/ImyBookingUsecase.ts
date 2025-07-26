import { Ibooking } from "../../../../entities/BookingEntities";

export interface ImyBookingUsecase {
    execute(user_id: string,limit: number,page: number,search: string,status:string): Promise<{bookings:Ibooking[],total:number}|null>;
}
import { Ibooking } from "../../../domain/entities/BookingEntities";
import { IbookingRepostory } from "../../../domain/interface/repositoryInterface/IbookingRepository";
import { ImyBookingUsecase } from "../../../domain/interface/usecaseInterface/user/booking/ImyBookingUsecase";

export class MyBookingUsecase implements ImyBookingUsecase{
    constructor(private bookingRepository:IbookingRepostory){
        this.bookingRepository = bookingRepository
    }

    async execute(user_id: string,limit: number,page: number,search: string,status:string): Promise<{bookings:Ibooking[],total:number}|null> {
        return await this.bookingRepository.findByUserId(user_id,limit,page,search,status)
    }
}
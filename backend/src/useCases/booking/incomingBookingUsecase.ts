import { IIncomingBookingUsecase } from "../../domain/interface/usecaseInterface/user/booking/IIncomingBookingUsecase"
import { Ibooking } from "../../domain/entities/BookingEntities"
import { IbookingRepostory } from "../../domain/interface/repositoryInterface/IbookingRepository"

export class IncomingBookingUsecase implements IIncomingBookingUsecase{
    
    constructor(private _bookingRepository: IbookingRepostory){}

    async execute(userId:string,limit:number,page:number,search:string,status:string):Promise<{bookings:Ibooking[],total:number}|null>{
        const result = await this._bookingRepository.getOwnerBookings(userId,limit,page,search,status)
        return result
    }
}
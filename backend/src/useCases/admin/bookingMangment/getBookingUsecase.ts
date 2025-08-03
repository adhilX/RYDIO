import { IgetBookingUsecase } from "../../../domain/interface/usecaseInterface/admin/BookingMangment/IgetBookingUsecase";
import { Ibooking } from "../../../domain/entities/BookingEntities";
import { IbookingRepostory } from "../../../domain/interface/repositoryInterface/IbookingRepository";

export class GetBookingUsecase implements IgetBookingUsecase{

    constructor(private bookingRepository: IbookingRepostory){
        this.bookingRepository = bookingRepository
    }
     async      getBookingData(search:string,limit:number,page:number):Promise<{bookings:Ibooking[],total: number}|null>
     {

   return await this.bookingRepository.getBookingData(search,limit,page)


     }
}
import { IgetBookingUsecase } from "../../../domain/interface/usecaseInterface/admin/BookingMangment/IgetBookingUsecase";
import { Ibooking } from "../../../domain/entities/BookingEntities";
import { IbookingRepostory } from "../../../domain/interface/repositoryInterface/IbookingRepository";

export class GetBookingUsecase implements IgetBookingUsecase{

    constructor(private _bookingRepository: IbookingRepostory){
        this._bookingRepository = _bookingRepository
    }
     async      getBookingData(search:string,limit:number,page:number):Promise<{bookings:Ibooking[],total: number}|null>
     {

   return await this._bookingRepository.getBookingData(search,limit,page)


     }
}
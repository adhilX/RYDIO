import { GetBookingInputDto, GetBookingOutputDto } from "../../domain/interface/DTOs/adminDto/AdminDto";
import { IBookingRepository } from "../../domain/interface/repositoryInterface/IbookingRepository";
import { IgetBookingUsecase } from "../../domain/interface/usecaseInterface/bookings/IgetBookingUsecase";

export class GetBookingUsecase implements IgetBookingUsecase{

    constructor(private _bookingRepository: IBookingRepository){
        this._bookingRepository = _bookingRepository
    }
     async getBookingData(input: GetBookingInputDto): Promise<GetBookingOutputDto | null> {
        const result = await this._bookingRepository.getBookingData(input.search || '', input.limit, input.page)
        if (!result) return null;
        return {
            bookings: result.bookings,
            total: result.total
        };
     }
}
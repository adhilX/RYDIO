import { GetBookingInputDto, GetBookingOutputDto } from "../../DTOs/adminDto/AdminDto";

export interface IGetBookingUsecase{
     getBookingData(input: GetBookingInputDto): Promise<GetBookingOutputDto | null>
}
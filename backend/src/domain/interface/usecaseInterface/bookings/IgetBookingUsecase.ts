import { GetBookingInputDto, GetBookingOutputDto } from "../../DTOs/adminDto/AdminDto";

export interface IgetBookingUsecase{
     getBookingData(input: GetBookingInputDto): Promise<GetBookingOutputDto | null>
}
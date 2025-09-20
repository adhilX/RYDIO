import { IncomingBookingInputDto, IncomingBookingOutputDto } from "../../DTOs/bookingDto/BookingDto";

export interface IIncomingBookingUsecase {
     execute(input:IncomingBookingInputDto): Promise<IncomingBookingOutputDto | null>
}
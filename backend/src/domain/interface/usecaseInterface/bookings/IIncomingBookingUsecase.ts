import { IncomingBookingInputDto, IncomingBookingOutputDto } from "../../DTOs/bookingDto/BookingDto";

export interface IIncomingBookingUsecase {
     execute({ owner_id, page, limit,search,status }: IncomingBookingInputDto): Promise<IncomingBookingOutputDto | null>
}
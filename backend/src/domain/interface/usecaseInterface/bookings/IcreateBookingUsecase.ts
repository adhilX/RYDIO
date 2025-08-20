import { CreateBookingInputDto, CreateBookingOutputDto } from "../../DTOs/bookingDto/BookingDto";

export interface IcreateBookingUsecase {
    createBooking(input: CreateBookingInputDto): Promise<CreateBookingOutputDto>
}
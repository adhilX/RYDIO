import { CreateBookingInputDto, CreateBookingOutputDto } from "../../DTOs/bookingDto/BookingDto";

export interface ICreateBookingUsecase {
    createBooking(input: CreateBookingInputDto): Promise<CreateBookingOutputDto>
}
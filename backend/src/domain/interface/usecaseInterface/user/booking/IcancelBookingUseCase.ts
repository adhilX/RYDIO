import { CancelBookingInputDto, CancelBookingOutputDto } from "../../../DTOs/bookingDto/BookingDto";

export interface IcancelBookingUseCase {
    execute({ booking_id, cancellation_reason }: CancelBookingInputDto): Promise<CancelBookingOutputDto>
}
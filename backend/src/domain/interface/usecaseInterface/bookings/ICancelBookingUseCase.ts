import { CancelBookingInputDto, CancelBookingOutputDto } from "../../DTOs/bookingDto/BookingDto";

export interface ICancelBookingUseCase {
    execute({ booking_id, cancellation_reason }: CancelBookingInputDto): Promise<CancelBookingOutputDto>
}
import { RideStartInputDto, RideStartOutputDto } from "../../DTOs/bookingDto/BookingDto";

export interface IrideStartUsecase {
    rideStart(input: RideStartInputDto, scanner_user_id: string): Promise<RideStartOutputDto>
}
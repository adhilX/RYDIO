import { RideEndInputDto, RideEndOutputDto } from "../../DTOs/bookingDto/BookingDto";

export interface IRideEndUsecase {
    execute(input: RideEndInputDto, scanner_user_id: string): Promise<RideEndOutputDto>
}
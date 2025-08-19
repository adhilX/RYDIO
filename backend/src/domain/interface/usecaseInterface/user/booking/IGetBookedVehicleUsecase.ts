import { GetBookedVehicleInputDto, GetBookedVehicleOutputDto } from "../../../DTOs/bookingDto/BookingDto";

export interface IGetBookedVehicleUsecase {
  execute(input: GetBookedVehicleInputDto): Promise<GetBookedVehicleOutputDto | null>;
}
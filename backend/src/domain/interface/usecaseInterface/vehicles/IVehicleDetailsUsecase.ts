import { VehicleDetailsInputDto, VehicleDetailsOutputDto } from "../../DTOs/userDto/VehicleDto";

export interface IVehicleDetailsUsecase {
    getVehicleDetails({ id }: VehicleDetailsInputDto): Promise<VehicleDetailsOutputDto | null>
}
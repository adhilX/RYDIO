import { VehicleDetailsInputDto, VehicleDetailsOutputDto } from "../../../DTOs/userDto/VehicleDto";

export interface IvehicleDetailsUsecase {
    getVehicleDetails({ id }: VehicleDetailsInputDto): Promise<VehicleDetailsOutputDto | null>
}
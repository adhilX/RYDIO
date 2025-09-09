import { ChangeVehicleStatusInputDto, ChangeVehicleStatusOutputDto } from "../../DTOs/userDto/VehicleDto";

export interface IChangeVehicleStatusUsecase {
    execute({ vehicleId }: ChangeVehicleStatusInputDto): Promise<ChangeVehicleStatusOutputDto>
}
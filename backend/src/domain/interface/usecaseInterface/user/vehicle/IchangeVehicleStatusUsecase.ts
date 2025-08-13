import { ChangeVehicleStatusInputDto, ChangeVehicleStatusOutputDto } from "../../../DTOs/userDto/VehicleDto";

export interface IchangeVehicleStatusUsecase {
    execute({ vehicleId }: ChangeVehicleStatusInputDto): Promise<ChangeVehicleStatusOutputDto>
}
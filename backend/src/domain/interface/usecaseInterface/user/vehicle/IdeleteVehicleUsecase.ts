import { DeleteVehicleInputDto, DeleteVehicleOutputDto } from "../../../DTOs/userDto/VehicleDto";

export interface IdeleteVehicleUsecase {
    execute({ vehicleId }: DeleteVehicleInputDto): Promise<DeleteVehicleOutputDto>
}
import { DeleteVehicleInputDto, DeleteVehicleOutputDto } from "../../DTOs/userDto/VehicleDto";

export interface IDeleteVehicleUsecase {
    execute({ vehicleId }: DeleteVehicleInputDto): Promise<DeleteVehicleOutputDto>
}
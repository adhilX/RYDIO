import { AddVehicleInputDto, AddVehicleOutputDto } from "../../../DTOs/userDto/VehicleDto";

export interface IaddvehicleUsecase {
    addVehicle({ vehicle, location }: AddVehicleInputDto): Promise<AddVehicleOutputDto>
}
import { AddVehicleInputDto, AddVehicleOutputDto } from "../../DTOs/userDto/VehicleDto";

export interface IAddVehicleUsecase {
    addVehicle({ vehicle, location }: AddVehicleInputDto): Promise<AddVehicleOutputDto>
}
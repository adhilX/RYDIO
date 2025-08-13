import { MyVehicleInputDto, MyVehicleOutputDto } from "../../../DTOs/userDto/VehicleDto";

export interface ImyVehicleUsecase {
    getMyvehicle({ owner_id, search, page, limit }: MyVehicleInputDto): Promise<MyVehicleOutputDto | null>
}
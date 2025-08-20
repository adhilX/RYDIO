import { PendingVehicleInputDto, PendingVehicleOutputDto } from "../../../DTOs/adminDto/AdminDto";

export interface IpendingVehicleUsecase {
    getPendingVehicle(input: PendingVehicleInputDto): Promise<PendingVehicleOutputDto | null>
}
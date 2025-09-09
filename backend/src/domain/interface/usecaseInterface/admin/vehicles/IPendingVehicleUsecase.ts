import { PendingVehicleInputDto, PendingVehicleOutputDto } from "../../../DTOs/adminDto/AdminDto";

export interface IPendingVehicleUsecase {
    getPendingVehicle(input: PendingVehicleInputDto): Promise<PendingVehicleOutputDto | null>
}
import { ApprovedVehicleInputDto, ApprovedVehicleOutputDto } from "../../../DTOs/adminDto/AdminDto";

export interface IApprovedVehicleUsecase {
    getApprovedVehicle(input: ApprovedVehicleInputDto): Promise<ApprovedVehicleOutputDto | null>
}
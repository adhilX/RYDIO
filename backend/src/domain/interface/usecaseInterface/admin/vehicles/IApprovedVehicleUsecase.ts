import { ApprovedVehicleInputDto, ApprovedVehicleOutputDto } from "../../../DTOs/adminDto/AdminDto";

export interface IapprovedVehicleUsecase {
    getApprovedVehicle(input: ApprovedVehicleInputDto): Promise<ApprovedVehicleOutputDto | null>
}
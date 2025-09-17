import { VehicleApprovalInputDto, VehicleApprovalOutputDto } from "../../../DTOs/adminDto/AdminDto";

export interface IChangeVehicleStatusUsecase {
    approveVehicle(input: VehicleApprovalInputDto): Promise<VehicleApprovalOutputDto>
}
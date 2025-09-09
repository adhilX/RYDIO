import { VehicleApprovalInputDto, VehicleApprovalOutputDto } from "../../../DTOs/adminDto/AdminDto";

export interface IVehicleApproveUsecase {
    approveVehicle(input: VehicleApprovalInputDto): Promise<VehicleApprovalOutputDto>
}
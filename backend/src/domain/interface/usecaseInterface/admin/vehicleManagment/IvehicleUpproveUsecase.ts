import { VehicleApprovalInputDto, VehicleApprovalOutputDto } from "../../../DTOs/adminDto/AdminDto";

export interface IvehicleAproveUsecase {
    approveVehicle(input: VehicleApprovalInputDto): Promise<VehicleApprovalOutputDto>
}
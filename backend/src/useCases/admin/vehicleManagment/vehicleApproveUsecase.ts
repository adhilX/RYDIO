import { VehicleRepository } from "../../../adapters/repository/user/vehicleRepository";
import { IvehicleAproveUsecase } from "../../../domain/interface/usecaseInterface/admin/vehicleManagment/IvehicleUpproveUsecase";
import { VehicleApprovalInputDto, VehicleApprovalOutputDto } from "../../../domain/interface/DTOs/adminDto/AdminDto";

export class VehicleUpproveUsecase implements IvehicleAproveUsecase {
    private _vehicleRepository: VehicleRepository
    constructor(vehicleRepository: VehicleRepository) {
        this._vehicleRepository = vehicleRepository
    }
    async approveVehicle(input: VehicleApprovalInputDto): Promise<VehicleApprovalOutputDto> {
        if(input.action == 'accepted'){
          await this._vehicleRepository.approveVehicle(input.id, input.action)
          return {
            success: true,
            message: 'Vehicle approved successfully'
          };
        }
        await this._vehicleRepository.rejectVehicle(input.id, input.action, input.reason)
        return {
          success: true,
          message: 'Vehicle rejected successfully'
        };
    }
}
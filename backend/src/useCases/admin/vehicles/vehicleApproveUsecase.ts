import { VehicleRepository } from "../../../adapters/repository/user/vehicleRepository";
import { IChangeVehicleStatusUsecase } from "../../../domain/interface/usecaseInterface/admin/vehicles/IChangeVehicleStatusUsecase";
import { VehicleApprovalInputDto, VehicleApprovalOutputDto } from "../../../domain/interface/DTOs/adminDto/AdminDto";

export class VehicleUpproveUsecase implements IChangeVehicleStatusUsecase {
    private _vehicleRepository: VehicleRepository
    constructor(vehicleRepository: VehicleRepository) {
        this._vehicleRepository = vehicleRepository
    }
    async approveVehicle(input: VehicleApprovalInputDto): Promise<VehicleApprovalOutputDto> {
      console.log('llllllllllllllllllllll')
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
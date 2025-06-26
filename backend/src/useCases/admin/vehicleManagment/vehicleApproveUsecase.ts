import { VehicleRepository } from "../../../adapters/repository/user/vehicleRepository";
import { IvehicleAproveUsecase } from "../../../domain/interface/usecaseInterface/admin/vehicleManagment/IvehicleUpproveUsecase";

export class VehicleUpproveUsecase implements IvehicleAproveUsecase {
    private vehicleRepository: VehicleRepository
    constructor(vehicleRepository: VehicleRepository) {
        this.vehicleRepository = vehicleRepository
    }
    approveVehicle(id: string,action:'accepted'|'rejected'): Promise<boolean> {
        if(action=='accepted'){
          return this.vehicleRepository.approveVehicle(id,action)
        }
        return this.vehicleRepository.rejectVehicle(id,action)
    }
}
import { VehicleRepository } from "../../../adapters/repository/user/vehicleRepository";
import { IvehicleAproveUsecase } from "../../../domain/interface/usecaseInterface/admin/vehicleManagment/IvehicleUpproveUsecase";

export class VehicleUpproveUsecase implements IvehicleAproveUsecase {
    private _vehicleRepository: VehicleRepository
    constructor(vehicleRepository: VehicleRepository) {
        this._vehicleRepository = vehicleRepository
    }
    approveVehicle(id: string,action:'accepted'|'rejected',reason?:string): Promise<boolean> {
        if(action=='accepted'){
          return this._vehicleRepository.approveVehicle(id,action)
        }
        return this._vehicleRepository.rejectVehicle(id,action,reason)
    }
}
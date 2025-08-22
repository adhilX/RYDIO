import { IVehicle } from "../../../domain/entities/vehcleEnties";
import { IvehicleRepository } from "../../../domain/interface/repositoryInterface/IvehicleRepository";
import { IvehicleDetailsUsecase } from "../../../domain/interface/usecaseInterface/user/vehicle/IvehicleDetailsUsecase";

export class VehicleDetailsUsecase implements IvehicleDetailsUsecase {


constructor(private _vehicleRepository:IvehicleRepository){
    this._vehicleRepository = _vehicleRepository
}

async getVehicleDetails(id: string): Promise<IVehicle | null> {
 return this._vehicleRepository.getVehicleDetails(id)
}
}
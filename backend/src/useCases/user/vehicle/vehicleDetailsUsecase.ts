import { IVehicle } from "../../../domain/entities/vehcleEnties";
import { IvehicleRepository } from "../../../domain/interface/repositoryInterface/IvehicleRepository";
import { IvehicleDetailsUsecase } from "../../../domain/interface/usecaseInterface/user/vehicle/IvehicleDetailsUsecase";

export class VehicleDetailsUsecase implements IvehicleDetailsUsecase {


constructor(private vehicleRepository:IvehicleRepository){
    this.vehicleRepository = vehicleRepository
}

async getVehicleDetails(id: string): Promise<IVehicle | null> {
 return this.vehicleRepository.getVehicleDetails(id)
}
}
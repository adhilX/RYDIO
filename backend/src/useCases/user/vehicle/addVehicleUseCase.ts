import { IVehicle } from "../../../domain/entities/vehcleEnties";
import { IvehicleRepository } from "../../../domain/interface/repositoryInterface/IvehicleRepository";
import { IaddvehicleUsecase } from "../../../domain/interface/usecaseInterface/user/vehicle/IaddvehicleUsecase";

export class AddVehicleUsecase implements IaddvehicleUsecase{
    private vehicleRepository : IvehicleRepository
    constructor(vehicleRepository:IvehicleRepository){
        this.vehicleRepository = vehicleRepository
    }
   async addVehicle(vehicle: IVehicle): Promise<IVehicle> {
        return await this.vehicleRepository.addVehicle({...vehicle,admin_approve:'pending'})
    }
}
import { IVehicle } from "../../../domain/entities/vehcleEnties";
import { IvehicleRepository } from "../../../domain/interface/repositoryInterface/IvehicleRepository";
import { VehicleModel } from "../../../framework/database/models/vehicleModel";

export class VehicleRepository implements IvehicleRepository{
   async addVehicle(vehicle: IVehicle): Promise<IVehicle> {
     return await VehicleModel.create({vehicle})
    }
}
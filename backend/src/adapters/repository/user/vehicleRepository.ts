import { IVehicle } from "../../../domain/entities/vehcleEnties";
import { IvehicleRepository } from "../../../domain/interface/repositoryInterface/IvehicleRepository";
import { VehicleModel } from "../../../framework/database/models/vehicleModel";

export class VehicleRepository implements IvehicleRepository{
   async addVehicle(vehicle: IVehicle): Promise<IVehicle> {
     return await VehicleModel.create({...vehicle})
    }

    async approveVehicle(id: string,action:string): Promise<boolean> {
        const result = await VehicleModel.findByIdAndUpdate(id, { admin_approve: action });
        return result !== null;
    }

    async rejectVehicle(id: string, action: string): Promise<boolean> {
         const result = await VehicleModel.findByIdAndUpdate(id, { admin_approve:action });
        return result !== null;
    }
}
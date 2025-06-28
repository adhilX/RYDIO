import mongoose from "mongoose";
import { IVehicle } from "../../../domain/entities/vehcleEnties";
import { IvehicleRepository } from "../../../domain/interface/repositoryInterface/IvehicleRepository";
import { VehicleModel } from "../../../framework/database/models/vehicleModel";

export class VehicleRepository implements IvehicleRepository{
   async addVehicle(vehicle: IVehicle): Promise<IVehicle> {
if (typeof vehicle.owner_id === 'string') {
  vehicle.owner_id = new mongoose.Types.ObjectId(vehicle.owner_id) as unknown as typeof vehicle.owner_id;
}
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
    async myVehicle(owner_id:string,search='',page=1,limit=10): Promise<{vehicle:IVehicle[],total:number }| null> {
 const query = search
      ? {
        $or: [
          { name: { $regex: search, $options: "i" } },
          { email: { $regex: search, $options: "i" } }
        ]
      } : {}
    const skip = (page - 1) * limit;
    const [vehicle, total] = await Promise.all([
      VehicleModel.find(query).skip(skip).limit(limit),
      VehicleModel.countDocuments(query)
    ]);
    return { vehicle, total }
}
}
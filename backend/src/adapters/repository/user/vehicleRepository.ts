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
    async myVehicle(owner_id: string, search: string, page: string, limit: string): Promise<{ vehicle: IVehicle[], total: number } | null> {
      const baseQuery: any = { owner_id };
      console.log(search)
      const query = search
        ? {
            ...baseQuery,
            $or: [
              { name: { $regex: search, $options: "i" } },
              { brand: { $regex: search, $options: "i" } },
            ]
          }
        : baseQuery;
      const pageNum = parseInt(page, 10) || 1;
      const limitNum = parseInt(limit, 10) || 10;
      const skip = (pageNum - 1) * limitNum;
      const [vehicle, total] = await Promise.all([
        VehicleModel.find(query).skip(skip).limit(limitNum),
        VehicleModel.countDocuments(query)
      ]);
      return { vehicle, total };
    }
}
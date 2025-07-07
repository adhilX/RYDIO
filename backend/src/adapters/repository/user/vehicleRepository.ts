import mongoose from "mongoose";
import { IVehicle } from "../../../domain/entities/vehcleEnties";
import { IvehicleRepository } from "../../../domain/interface/repositoryInterface/IvehicleRepository";
import { VehicleModel } from "../../../framework/database/models/vehicleModel";
import { locationModel } from "../../../framework/database/models/locationModel";

export class VehicleRepository implements IvehicleRepository {
  async addVehicle(vehicle: IVehicle): Promise<IVehicle> {
    if (typeof vehicle.owner_id === 'string') {
      vehicle.owner_id = new mongoose.Types.ObjectId(vehicle.owner_id) as unknown as typeof vehicle.owner_id;
    }
    return await VehicleModel.create({ ...vehicle })
  }

  async approveVehicle(id: string, action: string): Promise<boolean> {
    const result = await VehicleModel.findByIdAndUpdate(id, { admin_approve: action });
    return result !== null;
  }

  async rejectVehicle(id: string, action: string): Promise<boolean> {
    const result = await VehicleModel.findByIdAndUpdate(id, { admin_approve: action });
    return result !== null;
  }
  async myVehicle(owner_id: string, search: string, page: string, limit: string): Promise<{ vehicle: IVehicle[], total: number } | null> {
    const owner: any = { owner_id };
    console.log(search)
    const query = search
      ? {
        ...owner,
        $or: [
          { name: { $regex: search, $options: "i" } },
          { brand: { $regex: search, $options: "i" } },
        ]
      }
      : owner;
    const pageNum = Number(page)
    const limitNum = Number(limit)
    const skip = (pageNum - 1) * limitNum;
    const [vehicle, total] = await Promise.all([
      VehicleModel.find(query).skip(skip).limit(limitNum),
      VehicleModel.countDocuments(query)
    ]);
    return { vehicle, total };
  }
  async findVehicle(lat: number, lon: number, search: string, page: number, limit: number): Promise<{ vehicles: IVehicle[], total: number } | null> {

    const locations = await locationModel.find({
      location: {
        $near: {
          $geometry: { type: 'Point', coordinates: [lat, lon] },
          $minDistance: 0,
          $maxDistance: 99999999
        }
      }
    });
    if (!locations.length) return null

    const query = search
      ? {
        $or: [
          { name: { $regex: search, $options: "i" } },
          { brand: { $regex: search, $options: "i" } },
        ]
      }
      : {};
    const skip = (page - 1) * limit;
    const locationId = locations.map(loc => loc._id.toString());
    console.log(locationId)
    const [vehicles, total] = await Promise.all([
      VehicleModel.find({
        ...query,
        location_id: { $in: locationId },
        admin_approve: 'accepted'
      }).skip(skip).limit(limit),
      VehicleModel.countDocuments(query)
    ]);
    return { vehicles, total }
  }

  async getVehicleDetails(Id: string): Promise<IVehicle | null> {
    return await VehicleModel.findById(Id).populate('owner_id').populate('location_id')
  }
}
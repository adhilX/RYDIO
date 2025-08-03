import mongoose, { Types } from "mongoose";
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
async findVehicle(lat: number, lon: number, search: string, page: number, limit: number, user_id: string, filters: any): Promise<{ vehicles: IVehicle[], total: number } | null> {
  
  const locations = await locationModel.find({
    location: {
      $near: {
        $geometry: { type: 'Point', coordinates: [lon, lat] },
        $maxDistance: filters.distance_range * 1000
      }
    }
  });

  if (!locations.length) {
    return null;
  }

  const locationIds = locations.map(loc => loc._id);
  
  const query: any = {
    location_id: { $in: locationIds },
    admin_approve: 'accepted',
    is_available: true,
    owner_id: { $ne: user_id }
  };
  if (search) {
    query.$or = [
      { name: { $regex: search, $options: "i" } },
      { brand: { $regex: search, $options: "i" } }
    ];
  } 

  if (filters) {
    if (filters.fuel_types?.length) {
      query.fuel_type = { $in: filters.fuel_types };
    }

    if (filters.seats?.length) {
      query.seats = { $in: filters.seats };
    }

    if (filters.car_types?.length) {
      query.car_type = { $in: filters.car_types };
    }

    if (filters.transmission?.length) {
      query.automatic = { $in: filters.transmission };
    }
  }
  
  const skip = (page - 1) * limit;
  const [vehicles, total] = await Promise.all([
    VehicleModel.find(query).skip(skip).limit(limit),
    VehicleModel.countDocuments(query)
  ]);
 
  return { vehicles, total };
}
  async getVehicleDetails(Id: string): Promise<IVehicle | null> {
    return await VehicleModel.findById(Id).populate('owner_id').populate('location_id')
  }
 async isExistingVehicle(regiseration_number: string): Promise<boolean> {
  const result = await VehicleModel.findOne({ registration_number : regiseration_number });
  return result !== null;
 }
 async deleteVehicle(vehicleId:string):Promise<boolean>{
    const result = await VehicleModel.findByIdAndDelete(vehicleId);
    return result !== null;
 }
 async changeVehicleStatus(vehicleId: string): Promise<boolean> {
  const vehicle = await VehicleModel.findById(vehicleId);
  if (!vehicle) return false;

  vehicle.is_available = !vehicle.is_available;
  await vehicle.save();

  return true;
}
}
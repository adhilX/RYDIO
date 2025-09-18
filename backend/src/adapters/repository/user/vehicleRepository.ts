import { IVehicle } from "../../../domain/entities/vehcleEnties";
import { IVehicleRepository } from "../../../domain/interface/repositoryInterface/IVehicleRepository";
import { VehicleModel } from "../../../framework/database/models/vehicleModel";
import { locationModel } from "../../../framework/database/models/locationModel";
import { BaseRepository } from "../base/BaseRepo";
import { BookingStatus } from "../../../domain/entities/BookingEntities";

export class VehicleRepository extends BaseRepository<IVehicle> implements IVehicleRepository {
  constructor() {
    super(VehicleModel);
  }

  async approveVehicle(id: string, action: string): Promise<boolean> {
    const result = await VehicleModel.findByIdAndUpdate(id, { admin_approve: action });
    return result !== null;
  }

  async rejectVehicle(id: string, action: string,reason?:string): Promise<boolean> {
    const result = await VehicleModel.findByIdAndUpdate(id, { admin_approve: action,reject_reason:reason });
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
    return await VehicleModel.findById(Id).populate('owner_id').populate('location_id');
  }
 async isExistingVehicle(regiseration_number: string): Promise<boolean> {
  const result = await VehicleModel.findOne({ registration_number : regiseration_number });
  return result !== null;
 }
 async deleteVehicle(vehicleId:string):Promise<boolean>{
    const result = await this.delete(vehicleId);
    return result !== null;
 }
 async changeVehicleStatus(vehicleId: string): Promise<boolean> {
  const vehicle = await VehicleModel.findById(vehicleId);
  if (!vehicle) return false;

  vehicle.is_available = !vehicle.is_available;
  await vehicle.save();

  return true;
}
async getVehicle(vehicleId:string):Promise<IVehicle | null>{
    return await this.findById(vehicleId);
}

// Dashboard Analytics Methods
async getActiveVehiclesCount(): Promise<number> {
    return await VehicleModel.countDocuments({ 
        admin_approve: 'accepted', 
        is_available: true 
    });
}

async getLastMonthActiveVehiclesCount(): Promise<number> {
    const lastMonth = new Date();
    lastMonth.setMonth(lastMonth.getMonth() - 1);
    
    return await VehicleModel.countDocuments({
        admin_approve: 'accepted',
        is_available: true,
        createdAt: { $gte: lastMonth }
    });
}

async getVehicleActivityChartData(): Promise<{ total: number; active: number; pending: number; rejected: number }> {
    const [total, active, pending, rejected] = await Promise.all([
        VehicleModel.countDocuments({}),
        VehicleModel.countDocuments({ admin_approve: 'accepted', is_available: true }),
        VehicleModel.countDocuments({ admin_approve: 'pending' }),
        VehicleModel.countDocuments({ admin_approve: 'rejected' })
    ]);
    
    return { total, active, pending, rejected };
}

async getPendingVehiclesCount(): Promise<number> {
    return await VehicleModel.countDocuments({ 
        admin_approve: 'pending' 
    });
}

async getApprovedVehiclesCount(): Promise<number> {
    return await VehicleModel.countDocuments({ 
        admin_approve: 'accepted' 
    });
}

async getRejectedVehiclesCount(): Promise<number> {
    return await VehicleModel.countDocuments({ 
        admin_approve: 'rejected' 
    });
}

async getTopRevenueVehicles(): Promise<Array<{
    type: string;
    model: string;
    revenue: number;
}>> {
    return await VehicleModel.aggregate([
        {
            $match: {
                admin_approve: 'accepted'
            }
        },
        {
            $lookup: {
                from: 'bookings',
                localField: '_id',
                foreignField: 'vehicle_id',
                as: 'bookings'
            }
        },
        {
            $addFields: {
                completedBookings: {
                    $filter: {
                        input: '$bookings',
                        cond: { 
                            $and: [
                                { $eq: ['$$this.status', 'completed'] },
                                { $ne: ['$$this.total_amount', null] },
                                { $gt: ['$$this.total_amount', 0] }
                            ]
                        }
                    }
                }
            }
        },
        {
            $addFields: {
                totalRevenue: {
                    $cond: {
                        if: { $gt: [{ $size: '$completedBookings' }, 0] },
                        then: { $sum: '$completedBookings.total_amount' },
                        else: 0
                    }
                }
            }
        },
        {
            $project: {
                type: '$car_type',
                model: '$name',
                revenue: '$totalRevenue',
                _id: 0
            }
        },
        {
            $sort: { revenue: -1 }
        },
        {
            $limit: 5
        }
    ]);
}

// Reapply functionality
async reapplyVehicle(vehicleId: string): Promise<boolean> {
    const result = await VehicleModel.findByIdAndUpdate(
        vehicleId, 
        { 
            admin_approve: 'reapplied',
            $unset: { reject_reason: 1 }
        }
    );
    return result !== null;
}

}
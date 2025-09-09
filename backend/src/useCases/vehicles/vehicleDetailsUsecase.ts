import { IVehicleRepository } from "../../domain/interface/repositoryInterface/IVehicleRepository";
import { IvehicleDetailsUsecase } from "../../domain/interface/usecaseInterface/vehicles/IvehicleDetailsUsecase";
import { VehicleDetailsInputDto, VehicleDetailsOutputDto } from "../../domain/interface/DTOs/userDto/VehicleDto";

export class VehicleDetailsUsecase implements IvehicleDetailsUsecase {


constructor(private _vehicleRepository:IVehicleRepository){
    this._vehicleRepository = _vehicleRepository
}

async getVehicleDetails({ id }: VehicleDetailsInputDto): Promise<VehicleDetailsOutputDto | null> {
 const vehicle = await this._vehicleRepository.getVehicleDetails(id);
 if (!vehicle) return null;
 
 return {
   _id: vehicle._id,
   owner_id: typeof vehicle.owner_id === 'object' && vehicle.owner_id !== null ? vehicle.owner_id : (vehicle.owner_id?.toString() || ''),
   location_id: typeof vehicle.location_id === 'object' && vehicle.location_id !== null ? vehicle.location_id : (vehicle.location_id?.toString() || ''),
   name: vehicle.name,
   brand: vehicle.brand,
   registration_number: vehicle.registration_number,
   fuel_type: vehicle.fuel_type,
   seats: vehicle.seats,
   car_type: vehicle.car_type,
   automatic: vehicle.automatic,
   price_per_day: vehicle.price_per_day,
   description: vehicle.description,
   image_urls: vehicle.image_urls,
   admin_approve: vehicle.admin_approve,
   reject_reason: vehicle.reject_reason,
   is_available: vehicle.is_available || true,
   created_at: vehicle.created_at || new Date()
 };
}
}
import { IvehicleRepository } from "../../../domain/interface/repositoryInterface/IvehicleRepository";
import { ImyVehicleUsecase } from "../../../domain/interface/usecaseInterface/user/vehicle/ImyVehicleUsecase";
import { MyVehicleInputDto, MyVehicleOutputDto } from "../../../domain/interface/DTOs/userDto/VehicleDto";


export class MyVehicleUsecase implements ImyVehicleUsecase {
    private _vehicleRepository : IvehicleRepository
    constructor(vehicleRepository:IvehicleRepository){
        this._vehicleRepository = vehicleRepository
    }


  async getMyvehicle({ owner_id, search, page, limit }: MyVehicleInputDto): Promise<MyVehicleOutputDto | null> {
        const result = await this._vehicleRepository.myVehicle(owner_id, search, page, limit);
        if (!result) return null;
        
        return {
            vehicles: result.vehicle.map(vehicle => ({
                _id: vehicle._id,
                owner_id: vehicle.owner_id.toString(),
                location_id: vehicle.location_id.toString(),
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
                is_available: vehicle.is_available!,
                created_at: vehicle.created_at || new Date()
            })),
            total: result.total
        };
  }
}
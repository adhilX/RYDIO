import { ILocationRepository } from "../../domain/interface/repositoryInterface/IlocationRepository";
import { IVehicleRepository } from "../../domain/interface/repositoryInterface/IVehicleRepository";
import { IAddVehicleUsecase } from "../../domain/interface/usecaseInterface/vehicles/IAddVehicleUsecase";
import { AddVehicleInputDto, AddVehicleOutputDto } from "../../domain/interface/DTOs/userDto/VehicleDto";
export class AddVehicleUsecase implements IAddVehicleUsecase{
    private _vehicleRepository : IVehicleRepository
    private _locationRepository : ILocationRepository
    constructor(vehicleRepository:IVehicleRepository,locationRepository:ILocationRepository){
        this._vehicleRepository = vehicleRepository
        this._locationRepository = locationRepository
    }
    
  async addVehicle({ vehicle, location }: AddVehicleInputDto): Promise<AddVehicleOutputDto> {
    console.log(vehicle,location)
    if(!location) throw new Error('Location is required');
    if(!vehicle) throw new Error('Vehicle is required');

    const isExistingVehicle = await this._vehicleRepository.isExistingVehicle(vehicle.registration_number);
    if (isExistingVehicle) throw new Error('Vehicle already exists');
    const savedLocation = await this._locationRepository.findOrCreate(location);
    const savedVehicle = await this._vehicleRepository.create({
      ...vehicle,
      location_id: savedLocation._id!,
      admin_approve: 'pending',
      is_available: true
    });

    return {
      _id: savedVehicle._id,
      owner_id: savedVehicle.owner_id.toString(),
      location_id: savedVehicle.location_id.toString(),
      name: savedVehicle.name,
      brand: savedVehicle.brand,
      registration_number: savedVehicle.registration_number,
      fuel_type: savedVehicle.fuel_type,
      seats: savedVehicle.seats,
      car_type: savedVehicle.car_type,
      automatic: savedVehicle.automatic,
      price_per_day: savedVehicle.price_per_day,
      description: savedVehicle.description,
      image_urls: savedVehicle.image_urls,
      admin_approve: savedVehicle.admin_approve,
      reject_reason: savedVehicle.reject_reason,
      is_available: savedVehicle.is_available || true,
      created_at: savedVehicle.created_at || new Date()
    };
  }
}
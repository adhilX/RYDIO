import { Location } from "../../../domain/entities/LocationEnties";
import { IVehicle } from "../../../domain/entities/vehcleEnties";
import { ILocationRepository } from "../../../domain/interface/repositoryInterface/IlocationRepository";
import { IvehicleRepository } from "../../../domain/interface/repositoryInterface/IvehicleRepository";
import { IaddvehicleUsecase } from "../../../domain/interface/usecaseInterface/user/vehicle/IaddvehicleUsecase";

interface AddVehicleProps {
  vehicle: Omit<IVehicle, 'location_id'>;
  location: Location
}
export class AddVehicleUsecase implements IaddvehicleUsecase{
    private vehicleRepository : IvehicleRepository
    private locationRepository : ILocationRepository
    constructor(vehicleRepository:IvehicleRepository,locationRepository:ILocationRepository){
        this.vehicleRepository = vehicleRepository
        this.locationRepository = locationRepository
    }


  async addVehicle({ vehicle, location }: AddVehicleProps): Promise<IVehicle> {
    console.log(vehicle,location)
    const savedLocation = await this.locationRepository.findOrCreate(location);
    return this.vehicleRepository.addVehicle({
      ...vehicle,
      location_id: savedLocation._id!.toString(),
    });
  }
}
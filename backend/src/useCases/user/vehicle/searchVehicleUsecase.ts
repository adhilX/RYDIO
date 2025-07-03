import { IVehicle } from "../../../domain/entities/vehcleEnties";
import { IvehicleRepository } from "../../../domain/interface/repositoryInterface/IvehicleRepository";
import { IsearchVehicleUsecase } from "../../../domain/interface/usecaseInterface/user/vehicle/IsearchVehicleUsecase";

export class SearchVehicleUsecase implements IsearchVehicleUsecase{

    constructor(private vehicleRepsitory:IvehicleRepository){
        this.vehicleRepsitory = vehicleRepsitory
    }

     async searchVehicle(lat: number, lon: number): Promise<IVehicle[] | null> {
        return  this.vehicleRepsitory.findVehicle(lat,lon)
     }
} 
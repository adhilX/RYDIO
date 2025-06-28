import { IVehicle } from "../../../domain/entities/vehcleEnties";
import { IvehicleRepository } from "../../../domain/interface/repositoryInterface/IvehicleRepository";
import { ImyVehicleUsecase } from "../../../domain/interface/usecaseInterface/user/vehicle/ImyVehicleUsecase";


export class MyVehicleUsecase implements ImyVehicleUsecase {
    private vehicleRepository : IvehicleRepository
    constructor(vehicleRepository:IvehicleRepository){
        this.vehicleRepository = vehicleRepository
    }


  async getMyvehicle(owner_id:string): Promise<{vehicle:IVehicle[],total:number}|null> {
    return this.vehicleRepository.myVehicle(owner_id)
  }
}
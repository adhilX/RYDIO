import { IVehicle } from "../../../domain/entities/vehcleEnties";
import { IvehicleRepository } from "../../../domain/interface/repositoryInterface/IvehicleRepository";
import { ImyVehicleUsecase } from "../../../domain/interface/usecaseInterface/user/vehicle/ImyVehicleUsecase";


export class MyVehicleUsecase implements ImyVehicleUsecase {
    private _vehicleRepository : IvehicleRepository
    constructor(vehicleRepository:IvehicleRepository){
        this._vehicleRepository = vehicleRepository
    }


  async getMyvehicle(owner_id: string, search: string, page: string, limit: string ): Promise<{ vehicle: IVehicle[]; total: number; } | null> {
        return this._vehicleRepository.myVehicle(owner_id,search,page,limit)

  }
}
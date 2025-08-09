import { IdeleteVehicleUsecase } from "../../../domain/interface/usecaseInterface/user/vehicle/IdeleteVehicleUsecase";
import { IvehicleRepository } from "../../../domain/interface/repositoryInterface/IvehicleRepository";

export class DeleteVehicleUsecase implements IdeleteVehicleUsecase{
    private _vehicleRepository : IvehicleRepository
    constructor(vehicleRepository:IvehicleRepository){
        this._vehicleRepository = vehicleRepository
    }
    async execute(vehicleId:string):Promise<boolean>{
        try {
            const result = await this._vehicleRepository.deleteVehicle(vehicleId);
            return result
        } catch (error) {
            console.log('error while deleting vehicle',error)
            return false
        }
    }
}
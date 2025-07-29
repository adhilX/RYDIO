import { IvehicleRepository } from "../../../domain/interface/repositoryInterface/IvehicleRepository";
import { IchangeVehicleStatusUsecase } from "../../../domain/interface/usecaseInterface/user/vehicle/IchangeVehicleStatusUsecase";

export class ChangeVehicleStatusUsecase implements IchangeVehicleStatusUsecase{
    constructor(private vehicleRepository:IvehicleRepository){
    }
    async execute(vehicleId:string):Promise<boolean>{
       const result = await this.vehicleRepository.changeVehicleStatus(vehicleId);
       return result
        }
    }

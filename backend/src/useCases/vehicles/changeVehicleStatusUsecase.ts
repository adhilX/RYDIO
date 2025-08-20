import { IvehicleRepository } from "../../domain/interface/repositoryInterface/IvehicleRepository";
import { IchangeVehicleStatusUsecase } from "../../domain/interface/usecaseInterface/vehicles/IchangeVehicleStatusUsecase";
import { ChangeVehicleStatusInputDto, ChangeVehicleStatusOutputDto } from "../../domain/interface/DTOs/userDto/VehicleDto";

export class ChangeVehicleStatusUsecase implements IchangeVehicleStatusUsecase{
    constructor(private _vehicleRepository:IvehicleRepository){
    }
    async execute({ vehicleId }: ChangeVehicleStatusInputDto): Promise<ChangeVehicleStatusOutputDto> {
       const result = await this._vehicleRepository.changeVehicleStatus(vehicleId);
       return {
           success: result,
           message: result ? 'Vehicle status changed successfully' : 'Failed to change vehicle status'
       };
    }
    }

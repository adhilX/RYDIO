import { IVehicleRepository } from "../../domain/interface/repositoryInterface/IVehicleRepository";
import { IchangeVehicleStatusUsecase } from "../../domain/interface/usecaseInterface/vehicles/IchangeVehicleStatusUsecase";
import { ChangeVehicleStatusInputDto, ChangeVehicleStatusOutputDto } from "../../domain/interface/DTOs/userDto/VehicleDto";

export class ChangeVehicleStatusUsecase implements IchangeVehicleStatusUsecase{
    constructor(private _vehicleRepository:IVehicleRepository){
    }
    async execute({ vehicleId }: ChangeVehicleStatusInputDto): Promise<ChangeVehicleStatusOutputDto> {
       const result = await this._vehicleRepository.changeVehicleStatus(vehicleId);
       return {
           success: result,
           message: result ? 'Vehicle status changed successfully' : 'Failed to change vehicle status'
       };
    }
    }

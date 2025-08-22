import { IdeleteVehicleUsecase } from "../../domain/interface/usecaseInterface/vehicles/IdeleteVehicleUsecase";
import { IvehicleRepository } from "../../domain/interface/repositoryInterface/IvehicleRepository";
import { DeleteVehicleInputDto, DeleteVehicleOutputDto } from "../../domain/interface/DTOs/userDto/VehicleDto";

export class DeleteVehicleUsecase implements IdeleteVehicleUsecase{
    private _vehicleRepository : IvehicleRepository
    constructor(vehicleRepository:IvehicleRepository){
        this._vehicleRepository = vehicleRepository
    }
    async execute({ vehicleId }: DeleteVehicleInputDto): Promise<DeleteVehicleOutputDto> {
        try {
            const result = await this._vehicleRepository.deleteVehicle(vehicleId);
            return {
                success: result,
                message: result ? 'Vehicle deleted successfully' : 'Failed to delete vehicle'
            };
        } catch (error) {
            console.log('error while deleting vehicle',error)
            return {
                success: false,
                message: 'Error occurred while deleting vehicle'
            };
        }
    }
}
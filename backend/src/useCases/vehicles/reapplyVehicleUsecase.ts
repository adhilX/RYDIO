import { IVehicleRepository } from "../../domain/interface/repositoryInterface/IVehicleRepository";
import { IReapplyVehicleUsecase } from "../../domain/interface/usecaseInterface/vehicles/IReapplyVehiclUsecase";


export class ReapplyVehicleUsecase implements IReapplyVehicleUsecase {
    private _vehicleRepository: IVehicleRepository;

    constructor(vehicleRepository: IVehicleRepository) {
        this._vehicleRepository = vehicleRepository;
    }

    async reapplyVehicle(vehicleId: string): Promise<{ success: boolean; message: string }> {
        try {
            const vehicle = await this._vehicleRepository.getVehicle(vehicleId);
            
            if (!vehicle) {
                return {
                    success: false,
                    message: "Vehicle not found"
                };
            }
            if (vehicle.admin_approve !== 'rejected') {
                return {
                    success: false,
                    message: "Vehicle must be in rejected status to reapply"
                };
            }
            await this._vehicleRepository.reapplyVehicle(vehicleId);   
             return {
                success: true,
                message :"Vehicle reapply successfully"
             }
        } catch (error) {
            console.error("Error in reapplyVehicle usecase:", error);
            return {
                success: false,
                message: "Internal server error"
            };
        }
    }
}

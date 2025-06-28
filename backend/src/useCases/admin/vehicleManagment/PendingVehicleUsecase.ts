import { IVehicle } from "../../../domain/entities/vehcleEnties";
import { IadminRepository } from "../../../domain/interface/repositoryInterface/IadminRepository";
import { IpendingVehicleUsecase } from "../../../domain/interface/usecaseInterface/admin/vehicleManagment/IpendingVehicleUsecase";

    export class PendingVehicleusercase implements IpendingVehicleUsecase {
        private adminRepository : IadminRepository

        constructor(adminRepository:IadminRepository){
            this.adminRepository = adminRepository
        }

    async getPendingVehicle( page:number, limit: number): Promise<{ vehicle: IVehicle[]; total: number; } | null> {
        const result = await this.adminRepository.getPendingVehicle(page, limit);
        if (!result) return null;
        return { vehicle: result.vehicles, total: result.total };
    }
    }
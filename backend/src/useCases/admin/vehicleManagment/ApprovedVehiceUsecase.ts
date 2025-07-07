import { IVehicle } from "../../../domain/entities/vehcleEnties";
import { IadminRepository } from "../../../domain/interface/repositoryInterface/IadminRepository";
import { IapprovedVehicleUsecase } from "../../../domain/interface/usecaseInterface/admin/vehicleManagment/IApprovedVehicleUsecase";

    export class ApprovedVehicleusercase implements IapprovedVehicleUsecase {
        private adminRepository : IadminRepository

        constructor(adminRepository:IadminRepository){
            this.adminRepository = adminRepository
        }

    async getApprovedVehicle( search:string,page:number, limit: number): Promise<{ vehicle: IVehicle[]; total: number; } | null> {
        const result = await this.adminRepository.getApprovedVehicle(search,page, limit);
        if (!result) return null;
        return { vehicle: result.vehicles, total: result.total };
    }
    }
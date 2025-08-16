import { IVehicle } from "../../../domain/entities/vehcleEnties";
import { IadminRepository } from "../../../domain/interface/repositoryInterface/IadminRepository";
import { IapprovedVehicleUsecase } from "../../../domain/interface/usecaseInterface/admin/vehicleManagment/IApprovedVehicleUsecase";

    export class ApprovedVehicleusercase implements IapprovedVehicleUsecase {
        private _adminRepository : IadminRepository

        constructor(adminRepository:IadminRepository){
            this._adminRepository = adminRepository
        }

    async getApprovedVehicle( search:string,page:number, limit: number): Promise<{ vehicle: IVehicle[]; total: number,totalCount:number } | null> {
        const result = await this._adminRepository.getApprovedVehicle(search,page, limit);
        if (!result) return null;
        return { vehicle: result.vehicles, total: result.total, totalCount: result.totalCount };
    }
    }
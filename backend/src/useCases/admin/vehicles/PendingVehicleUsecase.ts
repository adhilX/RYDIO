import { IAdminRepository } from "../../../domain/interface/repositoryInterface/IAdminRepository";
import { IPendingVehicleUsecase } from "../../../domain/interface/usecaseInterface/admin/vehicles/IPendingVehicleUsecase";
import { PendingVehicleInputDto, PendingVehicleOutputDto } from "../../../domain/interface/DTOs/adminDto/AdminDto";

    export class PendingVehicleusercase implements IPendingVehicleUsecase {
        private _adminRepository : IAdminRepository

        constructor(adminRepository:IAdminRepository){
            this._adminRepository = adminRepository
        }

    async getPendingVehicle(input: PendingVehicleInputDto): Promise<PendingVehicleOutputDto | null> {
        const result = await this._adminRepository.getPendingVehicle(input.page, input.limit);
        if (!result) return null;
        return { vehicle: result.vehicles, total: result.total };
    }
    }
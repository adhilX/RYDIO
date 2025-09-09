import { IAdminRepository } from "../../../domain/interface/repositoryInterface/IAdminRepository";
import { IApprovedVehicleUsecase } from "../../../domain/interface/usecaseInterface/admin/vehicles/IApprovedVehicleUsecase";
import { ApprovedVehicleInputDto, ApprovedVehicleOutputDto } from "../../../domain/interface/DTOs/adminDto/AdminDto";

    export class ApprovedVehicleusercase implements IApprovedVehicleUsecase {
        private _adminRepository : IAdminRepository

        constructor(adminRepository:IAdminRepository){
            this._adminRepository = adminRepository
        }

    async getApprovedVehicle(input: ApprovedVehicleInputDto): Promise<ApprovedVehicleOutputDto | null> {
        const result = await this._adminRepository.getApprovedVehicle(input.search, input.page, input.limit);
        if (!result) return null;
        return { vehicle: result.vehicles, total: result.total, totalCount: result.totalCount };
    }
    }
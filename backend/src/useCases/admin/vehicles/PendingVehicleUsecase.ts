import { IadminRepository } from "../../../domain/interface/repositoryInterface/IadminRepository";
import { IpendingVehicleUsecase } from "../../../domain/interface/usecaseInterface/admin/vehicles/IpendingVehicleUsecase";
import { PendingVehicleInputDto, PendingVehicleOutputDto } from "../../../domain/interface/DTOs/adminDto/AdminDto";

    export class PendingVehicleusercase implements IpendingVehicleUsecase {
        private _adminRepository : IadminRepository

        constructor(adminRepository:IadminRepository){
            this._adminRepository = adminRepository
        }

    async getPendingVehicle(input: PendingVehicleInputDto): Promise<PendingVehicleOutputDto | null> {
        const result = await this._adminRepository.getPendingVehicle(input.page, input.limit);
        if (!result) return null;
        return { vehicle: result.vehicles, total: result.total };
    }
    }
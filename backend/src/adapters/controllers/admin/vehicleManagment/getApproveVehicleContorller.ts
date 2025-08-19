import { Request, Response } from "express";
import { HttpStatus } from "../../../../domain/entities/httpStatus";
import { IapprovedVehicleUsecase } from "../../../../domain/interface/usecaseInterface/admin/vehicleManagment/IApprovedVehicleUsecase";

export class GetApprovedVehicleController{
    private _approvedVehicleUsecase : IapprovedVehicleUsecase
    constructor(IapprovedVehicleUsecase: IapprovedVehicleUsecase) {
        this._approvedVehicleUsecase = IapprovedVehicleUsecase
    }
    
    async approveVehicle(req: Request, res: Response): Promise<void> {
        try {
            const page = req.query.page ? Number(req.query.page as string) : 1;
            const limit = req.query.limit ? Number(req.query.limit as string) : 10;
            const search = req.query.search as string
            const response = await this._approvedVehicleUsecase.getApprovedVehicle({search,page, limit})
            res.status(HttpStatus.OK).json(response )
        } catch (error) {
            console.error('Error while fetching approved vehicles:', error)
            res.status(HttpStatus.BAD_REQUEST).json({
                message: 'Error while fetching approved vehicles',
                error: error instanceof Error ? error.message : 'Unknown error'
            })
        }
    }
    
}
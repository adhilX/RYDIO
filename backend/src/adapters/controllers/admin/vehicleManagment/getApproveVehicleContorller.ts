import { Request, Response } from "express";
import { HttpStatus } from "../../../../domain/entities/httpStatus";
import { IapprovedVehicleUsecase } from "../../../../domain/interface/usecaseInterface/admin/vehicleManagment/IApprovedVehicleUsecase";

export class GetApprovedVehicleController{
    private approvedVehicleUsecase : IapprovedVehicleUsecase
    constructor(IapprovedVehicleUsecase: IapprovedVehicleUsecase) {
        this.approvedVehicleUsecase = IapprovedVehicleUsecase
    }
    
    async approveVehicle(req: Request, res: Response): Promise<void> {
        try {
            const page = req.query.page ? parseInt(req.query.page as string) : 1;
            const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
            const response = await this.approvedVehicleUsecase.getApprovedVehicle(page, limit)
            console.log(response)
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
import { Request, Response } from "express";
import { IvehicleAproveUsecase } from "../../../../domain/interface/usecaseInterface/admin/vehicleManagment/IvehicleUpproveUsecase";
import { HttpStatus } from "../../../../domain/entities/httpStatus";
import { IpendingVehicleUsecase } from "../../../../domain/interface/usecaseInterface/admin/vehicleManagment/IpendingVehicleUsecase";

export class PendingVehicleController{
    private pendingVehicleUsecase : IpendingVehicleUsecase
    constructor(pendingVehicleUsecase: IpendingVehicleUsecase) {
        this.pendingVehicleUsecase = pendingVehicleUsecase
    }
    
    async approveVehicle(req: Request, res: Response): Promise<void> {
        try {
            const page = req.query.page ? parseInt(req.query.page as string) : 1;
            const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
            const response = await this.pendingVehicleUsecase.getPendingVehicle(page, limit)
            res.status(HttpStatus.OK).json(response )
        } catch (error) {
            console.error('Error while fetching pending vehicles:', error)
            res.status(HttpStatus.BAD_REQUEST).json({
                message: 'Error while fetching pending vehicles',
                error: error instanceof Error ? error.message : 'Unknown error'
            })
        }
    }
    
}
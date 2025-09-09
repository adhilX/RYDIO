import { Request, Response } from "express";
import { IVehicleApproveUsecase } from "../../../../domain/interface/usecaseInterface/admin/vehicles/IvehicleUpproveUsecase";
import { HttpStatus } from "../../../../domain/entities/httpStatus";

export class VehicleUpproveController{
    private _vehicleUpproveUsecase: IVehicleApproveUsecase

    constructor(vehicleUpproveUsecase: IVehicleApproveUsecase) {
        this._vehicleUpproveUsecase = vehicleUpproveUsecase
    }
    
    async approveVehicle(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params
            const {action,reason}= req.body
            await this._vehicleUpproveUsecase.approveVehicle({id,action,reason})
            res.status(HttpStatus.OK).json({ message: `Vehicle ${action} successfully` })
        } catch (error) {
            console.log('Error while approving vehicle:', error)
            res.status(HttpStatus.BAD_REQUEST).json({
                message: 'Error while approving vehicle',
                error: error instanceof Error ? error.message : 'Unknown error'
            })
        }
    }
}
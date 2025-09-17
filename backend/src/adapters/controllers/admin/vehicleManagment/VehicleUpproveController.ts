import { Request, Response } from "express";
import { HttpStatus } from "../../../../domain/entities/httpStatus";
import { IChangeVehicleStatusUsecase } from "../../../../domain/interface/usecaseInterface/admin/vehicles/IChangeVehicleStatusUsecase";

export class VehicleUpproveController{
    private _vehicleUpproveUsecase: IChangeVehicleStatusUsecase

    constructor(vehicleUpproveUsecase: IChangeVehicleStatusUsecase) {
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
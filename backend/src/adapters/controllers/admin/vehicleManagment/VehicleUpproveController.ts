import { Request, Response } from "express";
import { IvehicleAproveUsecase } from "../../../../domain/interface/usecaseInterface/admin/vehicleManagment/IvehicleUpproveUsecase";
import { HttpStatus } from "../../../../domain/entities/httpStatus";

export class VehicleUpproveController{
    private vehicleUpproveUsecase: IvehicleAproveUsecase

    constructor(vehicleUpproveUsecase: IvehicleAproveUsecase) {
        this.vehicleUpproveUsecase = vehicleUpproveUsecase
    }
    
    async approveVehicle(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params
            const {action}= req.body
            const response = await this.vehicleUpproveUsecase.approveVehicle(id,action)
            console.log(req.body)
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
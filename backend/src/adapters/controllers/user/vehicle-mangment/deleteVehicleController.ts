import { Request, Response } from "express";
import { IdeleteVehicleUsecase } from "../../../../domain/interface/usecaseInterface/user/vehicle/IdeleteVehicleUsecase";
import { HttpStatus } from "../../../../domain/entities/httpStatus";

export class DeleteVehicleController {
    constructor(private _deleteVehicleUseCase:IdeleteVehicleUsecase) {
    }
    async deleteVehicle(req:Request,res:Response){
        try {
            const {vehicleId} = req.params;
            await this._deleteVehicleUseCase.execute({ vehicleId });
            res.status(HttpStatus.OK).json({message:'vehicle deleted successfully',success:true});
        } catch (error) {
            console.log('error while deleting vehicle',error)
            res.status(HttpStatus.BAD_REQUEST).json({
                message:'error while deleting vehicle',
                error:error instanceof Error ? error.message : 'error while deleting vehicle',
                success:false
            })
        }
    }
}